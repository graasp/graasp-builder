import { ChangeEvent, ChangeEventHandler, useState } from 'react';

import {
  Alert,
  AlertTitle,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';

import { Table2 } from 'lucide-react';
import Papa from 'papaparse';

import {
  CSV_EMAIL_COLUMN_NAME,
  CSV_GROUP_COLUMN_NAME,
} from '@/config/constants';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import {
  CSV_FILE_SELECTION_DELETE_BUTTON_ID,
  SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID,
  SHARE_ITEM_FROM_CSV_CANCEL_BUTTON_ID,
  SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ChoiceDisplay from './ChoiceDisplay';
import DisplayInvitationSummary from './DisplayInvitationSummary';
import TemplateSelectionButton from './TemplateSelectionButton';

export const DIALOG_ID_LABEL = 'shareItemFromCsvLabel';

const allowedExtensions = ['.csv'].join(',');

type CSVFileSelectionButtonProps = {
  csvFile?: File;
  removeFile: () => void;
  handleFileChange: ChangeEventHandler<HTMLInputElement>;
};
const CSVFileSelectionButton = ({
  csvFile,
  removeFile,
  handleFileChange,
}: CSVFileSelectionButtonProps) => {
  const { t } = useBuilderTranslation();
  if (csvFile) {
    return (
      <ChoiceDisplay
        deleteButtonId={CSV_FILE_SELECTION_DELETE_BUTTON_ID}
        onDelete={removeFile}
        name={csvFile.name}
      />
    );
  }
  return (
    <Button
      id={SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID}
      startIcon={<Table2 />}
      variant="outlined"
      component="label"
      sx={{ width: 'max-content', textTransform: 'none' }}
    >
      {t(BUILDER.SHARE_ITEM_CSV_IMPORT_INPUT_BUTTON)}
      <input
        type="file"
        hidden
        onChange={handleFileChange}
        accept={allowedExtensions}
      />
    </Button>
  );
};

type ImportUsersDialogContentProps = {
  item: DiscriminatedItem;
  isFolder: boolean;
  handleClose: () => void;
};

const ImportUsersDialogContent = ({
  item,
  isFolder,
  handleClose,
}: ImportUsersDialogContentProps): JSX.Element => {
  const { t: translateCommon } = useCommonTranslation();
  const [csvFile, setCsvFile] = useState<File>();
  const [csvFileErrors, setCsvFileErrors] = useState<string>();
  const [showTemplateSelectionButton, setShowTemplateSelectionButton] =
    useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);
  const { t } = useBuilderTranslation();
  const { mutate: postUserCsv, isSuccess: isSuccessPostingCSV } =
    mutations.useCSVUserImport();
  const {
    mutate: postUserCsvWithTemplate,
    data: userCsvDataWithTemplate,
    error: userCSVErrorWithTemplate,
    isSuccess: isSuccessPostingCSVWithTemplate,
  } = mutations.useCSVUserImportWithTemplate();

  const isSuccess = isSuccessPostingCSV || isSuccessPostingCSVWithTemplate;

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files?.length) {
      const file = target.files?.[0];
      if (file) {
        // it is necessary to check if CSV contains the group column,
        // parser only reads the first row to avoid processing whole file
        // at the front-end
        Papa.parse(file, {
          header: true,
          dynamicTyping: false,
          preview: 1,
          transformHeader(header) {
            return header.trim().toLowerCase();
          },
          complete(results) {
            const headers = results.meta.fields;

            // check for errors in the column names
            if (!headers?.includes(CSV_EMAIL_COLUMN_NAME.toLowerCase())) {
              setCsvFileErrors(
                t(BUILDER.SHARE_ITEM_CSV_IMPORT_ERROR_MISSING_COLUMN, {
                  column: CSV_EMAIL_COLUMN_NAME,
                }),
              );
              return;
            }
            if (headers?.includes(CSV_GROUP_COLUMN_NAME) && isFolder) {
              setShowTemplateSelectionButton(true);
            } else {
              setShowTemplateSelectionButton(false);
            }
            setIsConfirmButtonEnabled(true);
            setCsvFile(file);
          },
        });
      } else {
        // TODO: this should be displayed somewhere
        console.error(t('Please select a file to upload.'));
      }
    }
  };

  const removeFile = () => {
    setShowTemplateSelectionButton(false);
    setIsConfirmButtonEnabled(false);
    setCsvFile(undefined);
  };

  const handlePostUserCSV = () => {
    if (csvFile) {
      if (selectedTemplateId) {
        postUserCsvWithTemplate({
          file: csvFile,
          itemId: item.id,
          templateItemId: selectedTemplateId,
        });
      } else {
        postUserCsv({
          file: csvFile,
          itemId: item.id,
        });
      }
    } else {
      console.error('no file set');
    }
  };

  const onTemplateSelected = (selectedTemplateItemId: string | undefined) => {
    setSelectedTemplateId(selectedTemplateItemId);
  };

  return (
    <>
      <DialogTitle id={DIALOG_ID_LABEL}>
        {t(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_TITLE)}
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction="column" alignItems="center" spacing={2}>
          <DialogContentText>
            {t(BUILDER.SHARE_ITEM_CSV_IMPORT_MODAL_CONTENT)}
          </DialogContentText>
          <CSVFileSelectionButton
            csvFile={csvFile}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />
          {csvFileErrors && (
            <Alert id={SHARE_ITEM_FROM_CSV_ALERT_ERROR_ID} severity="error">
              {csvFileErrors}
            </Alert>
          )}
          {showTemplateSelectionButton && (
            <TemplateSelectionButton
              targetItemId={item.id}
              selectedItemId={selectedTemplateId}
              onTemplateSelected={onTemplateSelected}
            />
          )}
          <DisplayInvitationSummary
            userCsvDataWithTemplate={userCsvDataWithTemplate}
            error={userCSVErrorWithTemplate}
          />
          {isSuccess && (
            <Alert severity="success">
              <AlertTitle>{t(BUILDER.IMPORT_CSV_SUCCESS_TITLE)}</AlertTitle>
              <Typography>{t(BUILDER.IMPORT_CSV_SUCCESS_TEXT)}</Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          id={SHARE_ITEM_FROM_CSV_CANCEL_BUTTON_ID}
          variant="text"
          onClick={handleClose}
          disabled={isSuccess}
        >
          {translateCommon(COMMON.CANCEL_BUTTON)}
        </Button>

        <Button
          id={SHARE_ITEM_FROM_CSV_CONFIRM_BUTTON_ID}
          variant="contained"
          onClick={isSuccess ? handleClose : handlePostUserCSV}
          color="primary"
          disabled={!isConfirmButtonEnabled}
        >
          {isSuccess
            ? translateCommon(COMMON.CLOSE_BUTTON)
            : translateCommon(COMMON.CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );
};
export default ImportUsersDialogContent;
