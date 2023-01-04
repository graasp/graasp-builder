import { TextField, Typography } from '@mui/material';

import { FC, useState } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_ETHERPAD_NAME_INPUT_ID } from '../../../config/selectors';

const useEtherpadForm = (): { padName: string; EtherpadForm: FC } => {
  const [padName, setPadName] = useState('');

  const EtherpadForm: FC = () => {
    const { t: translateBuilder } = useBuilderTranslation();
    return (
      <>
        <Typography variant="h6">
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_TITLE)}
        </Typography>
        <Typography variant="body1" paragraph>
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_INFORMATIONS)}
        </Typography>
        <TextField
          variant="standard"
          autoFocus
          id={ITEM_FORM_ETHERPAD_NAME_INPUT_ID}
          label={translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_LABEL)}
          value={padName}
          onChange={(e) => setPadName(e.target.value)}
          // always shrink because setting name from defined app does not shrink automatically
          InputLabelProps={{ shrink: true }}
          sx={{ width: '50%', my: 1 }}
        />
      </>
    );
  };

  return { padName, EtherpadForm };
};

export default useEtherpadForm;
