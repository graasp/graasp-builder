import { RecordOf } from 'immutable';
import Papa from 'papaparse';

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

import { FC, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER, COMMON } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';

import {
  useBuilderTranslation,
  useCommonTranslation,
  useMessagesTranslation,
} from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID,
} from '../../../config/selectors';
import { PERMISSION_LEVELS } from '../../../enums';

const label = 'shareItemFromCsvLabel';
const allowedExtensions = ['.csv'].join(',');

type Props = {
  item: RecordOf<Item>;
};

const CsvInputParser: FC<Props> = ({ item }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { t: translateMessages } = useMessagesTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const { id: itemId, path: itemPath } = item;
  const [isOpen, setIsOpen] = useState(false);
  const {
    mutate: share,
    isLoading,
    isSuccess,
    isError,
    data: results,
    error,
  } = useMutation<any, any, any>(MUTATION_KEYS.SHARE_ITEM);

  const openModal = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const reader = new FileReader();

      // Event listener on reader when the file loads
      reader.onload = async ({ target }) => {
        if (target?.result) {
          const csv = Papa.parse(target.result, { header: true });
          const parsedData = csv?.data;

          // add current item path and default permission read
          const dataWithItemPath = parsedData.map((d) => ({
            permission: PERMISSION_LEVELS.READ,
            ...d,
            itemPath,
          }));

          share({ data: dataWithItemPath, itemId });
        }
      };
      reader.readAsText(inputFile);
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
          {t(error)}
        </Alert>
      );
    }

    if (!results) {
      return null;
    }

    // show generic network/axios errors
    const genericErrors: Error[] = results?.failure?.filter(
      (e: { code?: string; message?: string; data?: unknown }) =>
        e?.code && e?.message && !e?.data,
    );
    if (genericErrors?.length) {
      return genericErrors.map((err) => (
        <Alert key={err.message} severity="error">
          {t(err.message)}
        </Alert>
      ));
    }

    // does not show errors if results is not defined
    // or if there is no failure with menaningful data
    // this won't show membership already exists error
    const failureToShow = results.failure.filter(
      (e) => e?.data?.email || e?.data?.name,
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
          {failureToShow.map((e) => (
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
            <Box textAlign="center">
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
            {renderResults()}
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleClose} color="primary">
              {translateCommon(COMMON.CLOSE_BUTTON)}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CsvInputParser;
