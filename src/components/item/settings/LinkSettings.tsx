import { RecordOf } from 'immutable';

import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import Typography from '@mui/material/Typography';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

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
  const { t } = useBuilderTranslation();

  const { mutate: editItem } = useMutation(MUTATION_KEYS.EDIT_ITEM);

  const { settings } = item;

  const handleIframeSetting = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        showLinkIframe: event.target.checked,
      },
    });
  };

  const handleButtonSetting = (event) => {
    editItem({
      id: item.id,
      name: item.name,
      settings: {
        showLinkButton: event.target.checked,
      },
    });
  };

  const renderIframeToggle = () => {
    const control = (
      <Switch
        id={SETTINGS_LINK_SHOW_IFRAME_ID}
        onChange={handleIframeSetting}
        checked={settings?.showLinkIframe ?? true}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={t(BUILDER.SETTINGS_LINK_SHOW_IFRAME)}
        control={control}
      />
    );
  };

  const renderButtonToggle = () => {
    const control = (
      <Switch
        id={SETTINGS_LINK_SHOW_BUTTON_ID}
        onChange={handleButtonSetting}
        checked={settings?.showLinkButton ?? false}
        color="primary"
      />
    );
    return (
      <FormControlLabel
        label={t(BUILDER.SETTINGS_LINK_SHOW_BUTTON)}
        control={control}
      />
    );
  };

  return (
    <>
      <Typography variant="h5" m={0} p={0}>
        {t(BUILDER.SETTINGS_LINK_SETTINGS_TITLE)}
      </Typography>
      <Typography variant="body">
        {t(BUILDER.SETTINGS_LINK_SETTINGS_INFORMATIONS)}
      </Typography>
      <FormGroup>
        {renderIframeToggle()}
        {renderButtonToggle()}
      </FormGroup>
    </>
  );
};

export default LinkSettings;
