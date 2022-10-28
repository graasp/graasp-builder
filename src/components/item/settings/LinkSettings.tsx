import { RecordOf } from 'immutable';

import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ChangeEvent, FC } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import {
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  SETTINGS_LINK_SHOW_BUTTON_ID,
  SETTINGS_LINK_SHOW_IFRAME_ID,
} from '../../../config/selectors';

type Props = {
  item: RecordOf<Item>;
};

const LinkSettings: FC<Props> = ({ item }) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = useMutation<any, any, any>(
    MUTATION_KEYS.EDIT_ITEM,
  );

  const { settings } = item;

  const handleIframeSetting = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.checked !== settings?.showLinkIframe) {
      editItem({
        id: item.id,
        name: item.name,
        settings: {
          showLinkIframe: event.target.checked,
        },
      });
    } else {
      console.error(`Value ${event?.target?.checked} is invalid`);
    }
  };

  const handleButtonSetting = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.checked !== settings?.showLinkButton) {
      editItem({
        id: item.id,
        name: item.name,
        settings: {
          showLinkButton: event.target.checked,
        },
      });
    } else {
      console.error(`Value ${event?.target?.checked} is invalid`);
    }
  };

  const renderIframeToggle = () => {
    const control = (
      <Switch
        id={SETTINGS_LINK_SHOW_IFRAME_ID}
        onChange={handleIframeSetting}
        checked={Boolean(settings?.showLinkIframe ?? DEFAULT_LINK_SHOW_IFRAME)}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_LINK_SHOW_IFRAME)}
        control={control}
      />
    );
  };

  const renderButtonToggle = () => {
    const control = (
      <Switch
        id={SETTINGS_LINK_SHOW_BUTTON_ID}
        onChange={handleButtonSetting}
        checked={Boolean(settings?.showLinkButton ?? DEFAULT_LINK_SHOW_BUTTON)}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={translateBuilder(BUILDER.SETTINGS_LINK_SHOW_BUTTON)}
        control={control}
      />
    );
  };

  return (
    <>
      <Typography variant="h5" m={0} p={0}>
        {translateBuilder(BUILDER.SETTINGS_LINK_SETTINGS_TITLE)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.SETTINGS_LINK_SETTINGS_INFORMATIONS)}
      </Typography>
      <FormGroup>
        {renderIframeToggle()}
        {renderButtonToggle()}
      </FormGroup>
    </>
  );
};

export default LinkSettings;
