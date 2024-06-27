import { type MouseEvent } from 'react';

import {
  ToggleButton as MuiToggleButton,
  Paper,
  SelectChangeEvent,
  ToggleButtonGroup,
  styled,
  toggleButtonGroupClasses,
} from '@mui/material';

import {
  Alignment,
  AlignmentType,
  DEFAULT_FILE_ALIGNMENT_SETTING,
  DEFAULT_FILE_MAX_WIDTH_SETTING,
  LocalFileItemType,
  MaxWidth,
  S3FileItemType,
} from '@graasp/sdk';
import { DEFAULT_LIGHT_PRIMARY_COLOR, Select } from '@graasp/ui';

import {
  AlignCenterIcon,
  AlignCenterVerticalIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Expand as ExpandIcon,
} from 'lucide-react';

import { useBuilderTranslation, useEnumsTranslation } from '@/config/i18n';
import { mutations } from '@/config/queryClient';
import { FILE_SETTING_MAX_WIDTH_ID } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import ItemSettingProperty from './ItemSettingProperty';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.divider}`,
}));
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
}));
const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    backgroundColor: DEFAULT_LIGHT_PRIMARY_COLOR.main,
    '&:hover': {
      backgroundColor: DEFAULT_LIGHT_PRIMARY_COLOR.dark,
    },
  },
}));

const FileSettings = ({
  item,
}: {
  item: S3FileItemType | LocalFileItemType;
}): JSX.Element => {
  const { t: translateEnum } = useEnumsTranslation();
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editItem } = mutations.useEditItem();

  const onChangeMaxWidth = (e: SelectChangeEvent<MaxWidth>) => {
    editItem({
      id: item.id,
      settings: { maxWidth: e.target.value as MaxWidth },
    });
  };

  const onChangeAlignment = (
    _e: MouseEvent<HTMLElement>,
    value: AlignmentType,
  ) => {
    // only send an update when the value is not null, as this is sent when clicking a selected button
    if (value !== null) {
      editItem({
        id: item.id,
        settings: { alignment: value },
      });
    }
  };

  const alignment = item.settings.alignment ?? DEFAULT_FILE_ALIGNMENT_SETTING;
  const maxWidth = item.settings.maxWidth ?? DEFAULT_FILE_MAX_WIDTH_SETTING;

  return (
    <>
      <ItemSettingProperty
        title={translateBuilder(BUILDER.SETTINGS_MAX_WIDTH_LABEL)}
        valueText={translateBuilder(BUILDER.SETTINGS_MAX_WIDTH_LABEL)}
        icon={<ExpandIcon />}
        inputSetting={
          <Select
            id={FILE_SETTING_MAX_WIDTH_ID}
            size="small"
            values={Object.values(MaxWidth).map((s) => ({
              text: translateEnum(s),
              value: s,
            }))}
            onChange={onChangeMaxWidth}
            value={maxWidth}
          />
        }
      />
      <ItemSettingProperty
        title={translateBuilder(BUILDER.SETTINGS_ALIGNMENT_LABEL)}
        valueText={translateBuilder(BUILDER.SETTINGS_ALIGNMENT_HELPER)}
        icon={<AlignCenterVerticalIcon />}
        inputSetting={
          <StyledPaper elevation={0}>
            <StyledToggleButtonGroup
              value={alignment}
              exclusive
              onChange={onChangeAlignment}
              aria-label={translateBuilder(
                BUILDER.SETTINGS_ALIGNMENT_ARIA_LABEL,
              )}
              size="small"
            >
              <ToggleButton
                value={Alignment.Left}
                aria-label={translateBuilder(
                  BUILDER.SETTINGS_ALIGNMENT_LEFT_ARIA_LABEL,
                )}
              >
                <AlignLeftIcon />
              </ToggleButton>
              <ToggleButton
                value={Alignment.Center}
                aria-label={translateBuilder(
                  BUILDER.SETTINGS_ALIGNMENT_CENTER_ARIA_LABEL,
                )}
              >
                <AlignCenterIcon />
              </ToggleButton>
              <ToggleButton
                value={Alignment.Right}
                aria-label={translateBuilder(
                  BUILDER.SETTINGS_ALIGNMENT_RIGHT_ARIA_LABEL,
                )}
              >
                <AlignRightIcon />
              </ToggleButton>
            </StyledToggleButtonGroup>
          </StyledPaper>
        }
      />
    </>
  );
};

export default FileSettings;
