import { ChangeEvent, useState } from 'react';

import { Publish } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material';

import { DiscriminatedItem, Invitation, PermissionLevel } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button, Loader } from '@graasp/ui';

import * as Papa from 'papaparse';

import {
  useBuilderTranslation,
  useCommonTranslation,
  useMessagesTranslation,
} from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

const label = 'shareItemFromCsvLabel';
const allowedExtensions = ['.csv'].join(',');

type Props = {
  item: DiscriminatedItem;
};

const CsvInputParser = ({ item }: Props): JSX.Element => {
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
  } = mutations.useShareItem();

  const openModal = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.files?.length) {
      const file = t.files?.[0];

      if (file) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: ({ data: parsedData }: { data: Partial<Invitation>[] }) => {
            // add current item path and default permission read
            const dataWithItemPath = parsedData.map<Partial<Invitation>>(
              (d) => ({
                permission: PermissionLevel.Read,
                ...d,
                itemPath,
              }),
            );

            share({ data: dataWithItemPath, itemId });
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
    const genericErrors: Error[] = results?.errors?.filter(
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
            <Box textAlign="center">
              <Button
                id={SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID}
                startIcon={<Publish />}
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
