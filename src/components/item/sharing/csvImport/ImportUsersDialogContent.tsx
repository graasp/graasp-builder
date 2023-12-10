import { ChangeEvent, useState } from 'react';

import PublishIcon from '@mui/icons-material/Publish';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';

import Papa from 'papaparse';

import { GROUP_COLUMN_NAME } from '@/config/constants';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import DisplayInvitationSummary from './DisplayInvitationSummary';
import TemplateSelectionButton from './TemplateSelectionButton';

export const DIALOG_ID_LABEL = 'shareItemFromCsvLabel';

const allowedExtensions = ['.csv'].join(',');

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
  // const { t } = useBuilderTranslation();
  const { t: translateCommon } = useCommonTranslation();
  const [csvFile, setCsvFile] = useState<File>();
  const [showTemplateSelectionButton, setShowTemplateSelectionButton] =
    useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);
  const { t } = useBuilderTranslation();
  const {
    mutate: postUserCsv,
    data: userCsvData,
    error: userCSVError,
    isSuccess: isSuccessPostingCSV,
  } = mutations.useCSVUserImport();

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
          complete(_results) {
            const headers = _results.meta.fields;
            if (headers?.includes(GROUP_COLUMN_NAME) && isFolder) {
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

  const handlePostUserCSV = () => {
    if (csvFile) {
      postUserCsv({
        file: csvFile,
        itemId: item.id,
        templateItemId: selectedTemplateId,
      });
    } else {
      console.error('no file set');
    }
  };

  const onTemplateSelected = (selectedTemplateItemId: string) => {
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
          <Button
            id={SHARE_ITEM_CSV_PARSER_INPUT_BUTTON_ID}
            startIcon={<PublishIcon />}
            variant="contained"
            component="label"
            sx={{ width: 'max-content' }}
          >
            {t(BUILDER.SHARE_ITEM_CSV_IMPORT_INPUT_BUTTON)}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept={allowedExtensions}
            />
          </Button>
          {showTemplateSelectionButton && (
            <TemplateSelectionButton
              targetItemId={item.id}
              selectedItemId={selectedTemplateId}
              onTemplateSelected={onTemplateSelected}
            />
          )}
          <DisplayInvitationSummary
            userCsvData={userCsvData}
            error={userCSVError}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={handleClose}
          disabled={isSuccessPostingCSV}
        >
          {translateCommon(COMMON.CANCEL_BUTTON)}
        </Button>

        <Button
          variant={isSuccessPostingCSV ? 'contained' : 'text'}
          onClick={isSuccessPostingCSV ? handleClose : handlePostUserCSV}
          color="primary"
          disabled={!isConfirmButtonEnabled}
        >
          {isSuccessPostingCSV
            ? translateCommon(COMMON.CLOSE_BUTTON)
            : translateCommon(COMMON.CONFIRM_BUTTON)}
        </Button>
      </DialogActions>
    </>
  );
};
export default ImportUsersDialogContent;
