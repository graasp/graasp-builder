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
import { ImmutableCast, ItemRecord } from '@graasp/sdk/frontend';
import { COMMON } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';
import axios from 'axios';
import {
  useBuilderTranslation,
  useCommonTranslation,
  useMessagesTranslation,
} from '../../../config/i18n';
import { mutations, hooks } from '../../../config/queryClient';
import {
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID,
  SELECT_TEMPLATE_FOLDER,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { SelectItemModalContext } from '../../context/SelectItemModalContext';


const label = 'shareItemFromCsvLabel';
const allowedExtensions = ['.csv'].join(',');
const { useItem } = hooks;

// const { buildGetItemRoute } = API_ROUTES;
type Props = {
  item: ItemRecord;
};

const CsvInputParser = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateMessages } = useMessagesTranslation();
  const { t: translateCommon } = useCommonTranslation();
  // const { id: itemId, path: itemPath } = item;
  const { id: itemId } = item;
  const [isOpen, setIsOpen] = useState(false);
  const {
    // mutate: share,
    isLoading,
    isSuccess,
    isError,
    data: results,
    error,
  } = mutations.useShareItem();

  // const { mutate: postItem } = mutations.usePostItem();
  const openModal = () => {
    setIsOpen(true);
  };

  const { openModal: openMoveModal, selId: idTemplate, cleanItemSel: cleanId } = useContext(SelectItemModalContext);

  const handleClose = () => {
    if (cleanId)
      cleanId();
    setIsOpen(false);
  };

  const { data: itemObj } = useItem(idTemplate)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.files?.length) {
      const file = t.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        // TO-DO: this request needs to be moved to query-client
        axios.post(`${API_HOST}/items/${itemId}/invitations/upload_csv?id=${itemId}&template_id=${idTemplate}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        })
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
    const genericErrors: ImmutableCast<Error[]> = results?.errors?.filter(
      (e: { code?: string; message?: string; data?: unknown }) =>
        e?.code && e?.message && !e?.data,
    );
    if (genericErrors?.size) {
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
    if (!failureToShow.size && isSuccess) {
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
            <Box textAlign="center" mb={2}>
              <Button
                id={SELECT_TEMPLATE_FOLDER}
                startIcon={<FolderCopyIcon />}
                component="label"
                onClick={() => { if (openMoveModal) openMoveModal([itemId]) }}
              >
                {translateBuilder(BUILDER.SELECT_TEMPLATE_INPUT_BUTTON)}
              </Button>
            </Box>

            <Box textAlign="center">
              template name selected: {itemObj ? itemObj.name : ''}
            </Box>

            {renderResults()}
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleClose} color="primary">
              {translateCommon(COMMON.CLOSE_BUTTON)}
            </Button>
          </DialogActions>
        </Dialog >
      )}
    </>
  );
};

export default CsvInputParser;
