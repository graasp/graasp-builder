import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { Button, Loader } from '@graasp/ui';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import buildI18n from '@graasp/translations';
import PublishIcon from '@material-ui/icons/Publish';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Papa from 'papaparse';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';
import {
  SHARE_ITEM_CSV_PARSER_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID,
} from '../../../config/selectors';

const allowedExtensions = ['.csv'].join(',');

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    textAlign: 'center',
  },
}));

const CsvInputParser = ({ item }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id: itemId, path: itemPath } = item;
  const [isOpen, setIsOpen] = useState(false);
  const messageI18n = buildI18n();
  const {
    mutate: share,
    isLoading,
    isSuccess,
    isError,
    data: results,
    error,
  } = useMutation(MUTATION_KEYS.SHARE_ITEM);

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
        const csv = Papa.parse(target.result, { header: true });
        const parsedData = csv?.data;

        // add current item path and default permission read
        const dataWithItemPath = parsedData.map((d) => ({
          permission: PERMISSION_LEVELS.READ,
          ...d,
          itemPath,
        }));

        share({ data: dataWithItemPath, itemId });
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
    const genericErrors = results?.failure?.filter(
      (e) => e?.code && e?.message && !e?.data,
    );
    if (genericErrors?.length) {
      return genericErrors.map((err) => (
        <Alert severity="error">{t(err.message)}</Alert>
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
          {t('The users were successfully imported!')}
        </Alert>
      );
    }

    return (
      <Alert id={SHARE_ITEM_FROM_CSV_RESULT_FAILURES_ID} severity="error">
        <AlertTitle>{t('The import failed for these entries')}</AlertTitle>
        <Grid container>
          {failureToShow.map((e) => (
            <Grid container>
              <Grid item xs={4}>
                {e?.data?.email ?? e?.data?.name}
              </Grid>
              <Grid item xs={8}>
                {messageI18n.t(e?.message)}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Alert>
    );
  };

  const label = 'shareItemFromCsvLabel';

  return (
    <>
      <Button
        id={SHARE_ITEM_CSV_PARSER_BUTTON_ID}
        onClick={openModal}
        variant="outlined"
        size="small"
      >
        {t('Import from CSV')}
      </Button>
      {isOpen && (
        <Dialog
          scroll="paper"
          onClose={handleClose}
          aria-labelledby={label}
          open
        >
          <DialogTitle id={label}>
            {t('Import users from a CSV file')}
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              {t(
                "Your CSV should have at least the column 'email'. The columns 'name' and 'permission' are optional.",
              )}
              <br />
              {t(
                'A CSV entry cannot override the data already saved. If a user already has permission, update the value in the table manually.',
              )}
            </DialogContentText>
            <Box className={classes.buttonWrapper}>
              <Button
                id={SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID}
                startIcon={<PublishIcon />}
                component="label"
              >
                {t('Choose a CSV file')}
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
              {t('Close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

CsvInputParser.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default CsvInputParser;
