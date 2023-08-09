import { ChangeEvent, useEffect, useState } from 'react';

import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { DISPLAY_CO_EDITORS_OPTIONS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  CO_EDITOR_SETTINGS_RADIO_GROUP_ID,
  buildCoEditorSettingsRadioButtonId,
} from '../../../config/selectors';
import { useCurrentUserContext } from '../../context/CurrentUserContext';

type Props = {
  item: ItemRecord;
  disabled: boolean;
};

const CoEditorSettings = ({ item, disabled }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: updateDisplayCoEditors } = mutations.useEditItem();

  // user
  const { isLoading: isMemberLoading } = useCurrentUserContext();

  // current item
  const itemId = item?.id;
  const settings = item?.settings;
  const itemName = item?.name;

  // by default, co editors will not be displayed
  const [optionValue, setOptionValue] = useState(
    DISPLAY_CO_EDITORS_OPTIONS.NO.value,
  );

  useEffect(() => {
    if (settings?.displayCoEditors) {
      setOptionValue(settings.displayCoEditors);
    }
  }, [settings]);

  if (isMemberLoading) {
    return <Loader />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    // value from radio button is string, convert to boolean
    const newValue = event.target.value === 'true';
    setOptionValue(newValue);
    updateDisplayCoEditors({
      id: itemId,
      name: itemName,
      settings: { displayCoEditors: newValue },
    });
  };

  return (
    <>
      <Typography variant="h6" mt={2}>
        {translateBuilder(BUILDER.ITEM_SETTINGS_CO_EDITORS_TITLE)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.ITEM_SETTINGS_CO_EDITORS_INFORMATIONS)}
      </Typography>
      <RadioGroup
        id={CO_EDITOR_SETTINGS_RADIO_GROUP_ID}
        name={translateBuilder(BUILDER.ITEM_SETTINGS_CO_EDITORS_LABEL)}
        value={optionValue}
        onChange={handleChange}
      >
        {Object.values(DISPLAY_CO_EDITORS_OPTIONS).map((option) => (
          <FormControlLabel
            key={option.label}
            id={buildCoEditorSettingsRadioButtonId(option.value)}
            value={option.value}
            control={<Radio color="primary" />}
            label={translateBuilder(option.label)}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default CoEditorSettings;
