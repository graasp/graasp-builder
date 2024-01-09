import { ChangeEvent, useState, useContext } from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { API_HOST } from '../../../config/env';
import { ItemRecord } from '@graasp/sdk/frontend';
import { COMMON } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';
import { GROUP_COLUMN_NAME } from '../../../config/constants'
import axios from 'axios';
import {
  useBuilderTranslation,
  useCommonTranslation,
  useMessagesTranslation,
} from '../../../config/i18n';
import { hooks } from '../../../config/queryClient';
import {
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID,
  SELECT_TEMPLATE_FOLDER,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { SelectItemModalContext } from '../../context/SelectItemModalContext';
import { ItemMembership, Invitation } from '@graasp/sdk';

import * as Papa from 'papaparse';
import { useMutation, useQueryClient } from 'react-query';
import notifier from '../../../config/notifier';

const label = 'shareItemFromCsvLabel';
const allowedExtensions = ['.csv'].join(',');
const { useItem } = hooks;
type Props = {
  item: ItemRecord;
};

const CsvInputParser = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateMessages } = useMessagesTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { id: itemId } = item;
  const [isOpen, setIsOpen] = useState(false);
  const [isVisibleFolderBtn, setFolderBtn] = useState(false);
  const [isEnabledConfirmBtn, setConfirmBtn] = useState(false);
  const [attachedFile, setFile] = useState<File | null>(null);
  const openModal = () => {
    setIsOpen(true);
  };

  // TO-DO: Move following section to query-client
  // START QUERY SECTION
  const postManyItemMemberships = async (
    {
      _attachedFile,
      _itemId,
      idTemplate,
    }: {
      _attachedFile: File;
      _itemId: string;
      idTemplate?: string;
    }
  ) => {

    const formData = new FormData();
    formData.append("file", _attachedFile);
    return axios.post<{
      data: (Invitation | ItemMembership)[];
      errors: Error[];
    }>(`${API_HOST}/items/${_itemId}/invitations/upload_csv?id=${_itemId}&template_id=${idTemplate}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
    }).then(({ data }) => data);
  }
  const ITEMS_KEY = 'items';
  const useShareCustom = () => {
    const queryClient = useQueryClient();
    return useMutation(
      async ({
        _attachedFile,
        _itemId,
        idTemplate,
      }: {
        _attachedFile: File;
        _itemId: string;
        idTemplate?: string;
      }): Promise<{
        data: (Invitation | ItemMembership)[];
        errors: Error[];
      }> => {

        const res = await postManyItemMemberships({ _attachedFile, _itemId, idTemplate }) // Pass the parameters as an object
        return res
      },
      {
        onSuccess: (_results) => {
          notifier?.({
            type: 'SHARE_ITEM/SUCCESS',
            payload: _results,
          });
        },
        onError: (_error: Error) => {
          notifier?.({
            type: 'SHARE_ITEM/FAILURE',
            payload: { error: _error },
          });
        },
        onSettled: (_data, _error, { _itemId }) => {
          queryClient.invalidateQueries([
            ITEMS_KEY,
            'memberships',
            _itemId,
          ]);
          queryClient.invalidateQueries([
            ITEMS_KEY,
            _itemId,
            'invitations',
          ]);
        },
      },
    );
  }
  // END OF QUERY SECTION

  const {
    mutate: share,
    isLoading,
    isSuccess,
    isError,
    data: results,
    error,
  } = useShareCustom();

  const { openModal: openMoveModal, selId: idTemplate, cleanItemSel: cleanId } = useContext(SelectItemModalContext);

  const handleClose = () => {
    if (cleanId)
      cleanId();
    setIsOpen(false);
    setFolderBtn(false);
    setConfirmBtn(false);

  };
  const sendQuery = () => {
    if (attachedFile) {
      share({ _attachedFile: attachedFile, _itemId: itemId, idTemplate })
    }
  };


  const { data: itemObj } = useItem(idTemplate)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.files?.length) {
      const file = t.files?.[0];
      if (file) {
        // it is necessary to check if CSV contains the group column, 
        // parser only reads the first row to avoid processing whole file 
        // at the front-end
        Papa.parse(file, {
          header: true,
          dynamicTyping: false,
          preview: 1,
          complete(_results) {
            const headers = _results.meta.fields
            if (headers?.includes(GROUP_COLUMN_NAME)) {
              setFolderBtn(true)
            }
            setConfirmBtn(true);
            setFile(file);
          },
        });
      } else {
        translateBuilder('Please select a file to upload.');
      }
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return <Loader />;
    }

    // general errors
    if (isError) {
      return (
        <Alert id={SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID} severity="error">
          {translateBuilder(error.message)}
        </Alert>
      );
    }

    if (!results) {
      return null;
    }

    // show generic network/axios errors
    const genericErrors = results?.errors?.filter(
      (e: { code?: string; message?: string; data?: unknown }) =>
        e?.code && e?.message && !e?.data,
    );


    if (genericErrors?.length) {
      return genericErrors.map((err) => (
        <Alert key={err.message} severity="error">
          {translateBuilder(err.message)}
        </Alert>
      ));
    }
    // does not show errors if results is not defined
    // or if there is no failure with meaningful data
    // this won't show membership already exists error
    // todo: fix type
    const failureToShow = results.errors.filter(
      (e: any) => e?.data && (e?.data?.email || e?.data?.name),
    );

    if (!failureToShow.length && isSuccess) {
      return (
        <Alert severity="success">
          {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_SUCCESS_MESSAGE)}
        </Alert>
      );
    }
    return (
      <Alert id={SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID} severity="error">
        <AlertTitle>
          {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_ERROR_MESSAGE)}
        </AlertTitle>
        <Grid container>
          {/* todo: fix type */}
          {failureToShow.map((e: any) => (
            <Grid container key={e}>
              <Grid item xs={4}>
                {e?.data?.email ?? e?.data?.name}
              </Grid>
              <Grid item xs={8}>
                {translateMessages(e?.message)}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Alert>
    );
  };

  return (
    <>
      <Button
        id={SHARE_ITEM_CSV_PARSER_BUTTON_ID}
        onClick={openModal}
        variant="outlined"
        size="small"
      >
        {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_BUTTON)}
      </Button>

      {isOpen && (
        <Dialog
          scroll="paper"
          onClose={handleClose}
          aria-labelledby={label}
          open
        >
          <DialogTitle id={label}>
            {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_TITLE)}
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_CONTENT)}
            </DialogContentText>

            <Box textAlign="center" mb={2}>
              <Button
                id={SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID}
                startIcon={<PublishIcon />}
                component="label"
              >
                {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_INPUT_BUTTON)}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept={allowedExtensions}
                />
              </Button>
            </Box>
            {isVisibleFolderBtn &&
              <>
                <DialogContentText>
                  {translateBuilder(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_CONTENT_GROUP_COLUMN_DETECTED)}
                </DialogContentText>
                <Box textAlign="center" mb={2}>
                  <Button
                    variant="outlined"
                    id={SELECT_TEMPLATE_FOLDER}
                    startIcon={<FolderCopyIcon />}
                    component="label"
                    onClick={() => { if (openMoveModal) openMoveModal([itemId]) }}
                  >
                    {itemObj ? itemObj.name : translateBuilder(BUILDER.SELECT_TEMPLATE_INPUT_BUTTON)}
                  </Button>
                </Box>
              </>
            }

            {renderResults()}
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between' }}>
            <Button variant="text" onClick={handleClose} color="primary">
              {translateCommon(COMMON.CLOSE_BUTTON)}
            </Button>
            <Button variant="text" onClick={sendQuery} color="primary" disabled={!isEnabledConfirmBtn}>
              {translateCommon('Confirm')}
            </Button>
          </DialogActions>
        </Dialog >
      )}
    </>
  );
};

export default CsvInputParser;
