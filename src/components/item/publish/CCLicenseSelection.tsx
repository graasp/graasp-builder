import { RecordOf } from 'immutable';

import HelpIcon from '@mui/icons-material/Help';
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Item, redirect } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { CCLicenseIcon, Loader } from '@graasp/ui';

import {
  CC_LICENSE_ABOUT_URL,
  CC_LICENSE_ADAPTION_OPTIONS,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import CCLicenseDialog from './CCLicenseDialog';

const { EDIT_ITEM } = MUTATION_KEYS;

// TODO: export in graasp sdk
// eslint-disable-next-line
enum CCLicenseAdaption {
  ALLOW = 'allow',
  ALIKE = 'alike',
}

type Props = {
  item: RecordOf<Item>;
};

const CCLicenseSelection: FC<Props> = ({ item }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: updateCCLicense } = useMutation<
    any,
    any,
    {
      id: string;
      name: string;
      settings: { ccLicenseAdaption: CCLicenseAdaption };
    }
  >(EDIT_ITEM);
  const [optionValue, setOptionValue] = useState<CCLicenseAdaption>();
  const [open, setOpen] = useState(false);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // itemId
  const itemId = item?.id;

  const settings = item?.settings;
  const itemName = item?.name;

  useEffect(() => {
    if (settings?.ccLicenseAdaption) {
      setOptionValue(settings.ccLicenseAdaption as CCLicenseAdaption);
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const handleChange = (event: ChangeEvent<{ value: string }>) => {
    setOptionValue(event.target.value as CCLicenseAdaption);
  };

  const handleClick = () => {
    const url = CC_LICENSE_ABOUT_URL;
    redirect(url, { openInNewTab: true });
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (optionValue) {
      updateCCLicense({
        id: itemId,
        name: itemName,
        settings: { ccLicenseAdaption: optionValue },
      });
    } else {
      console.error(`optionValue "${optionValue}" is undefined`);
    }
    setOpen(false);
  };

  return (
    <>
      <Typography variant="h6" mt={2}>
        {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_TITLE)}
        <Tooltip
          title={translateBuilder(
            BUILDER.ITEM_SETTINGS_CC_LICENSE_MORE_INFORMATIONS,
          )}
          arrow
        >
          <IconButton aria-label="info" onClick={handleClick}>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_INFORMATIONS)}
      </Typography>
      <RadioGroup
        aria-label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL)}
        name={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_LABEL)}
        value={optionValue}
        onChange={handleChange}
      >
        <FormControlLabel
          value={CC_LICENSE_ADAPTION_OPTIONS.ALLOW}
          control={<Radio color="primary" />}
          label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_ALLOW_LABEL)}
        />
        <FormControlLabel
          value={CC_LICENSE_ADAPTION_OPTIONS.ALIKE}
          control={<Radio color="primary" />}
          label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_ALIKE_LABEL)}
        />
        <FormControlLabel
          value={CC_LICENSE_ADAPTION_OPTIONS.NONE}
          control={<Radio color="primary" />}
          label={translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_NONE_LABEL)}
        />
      </RadioGroup>
      <CCLicenseDialog
        open={open}
        setOpen={setOpen}
        buttonName={translateBuilder(
          BUILDER.ITEM_SETTINGS_CC_LICENSE_SUBMIT_BUTTON,
        )}
        handleSubmit={handleSubmit}
      />
      {settings?.ccLicenseAdaption && (
        <>
          <Typography variant="subtitle1">
            {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_PREVIEW_TITLE)}
          </Typography>
          <CCLicenseIcon
            adaption={settings?.ccLicenseAdaption as CCLicenseAdaption}
            sx={{ mt: 1 }}
          />
        </>
      )}
    </>
  );
};

export default CCLicenseSelection;
