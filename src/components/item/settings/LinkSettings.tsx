import { ChangeEvent } from 'react';

import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';

import { LinkItemType } from '@graasp/sdk';

import {
  DEFAULT_LINK_SHOW_BUTTON,
  DEFAULT_LINK_SHOW_IFRAME,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  SETTINGS_LINK_SHOW_BUTTON_ID,
  SETTINGS_LINK_SHOW_IFRAME_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

type Props = {
  item: LinkItemType;
};

const LinkSettings = ({ item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { mutate: editItem } = mutations.useEditItem();

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
      <Typography variant="h6" m={0} p={0}>
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
