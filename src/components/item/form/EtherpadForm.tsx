import { useState } from 'react';

import { TextField, Typography } from '@mui/material';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_ETHERPAD_NAME_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';

const useEtherpadForm = (): {
  padName: string;
  EtherpadForm: () => JSX.Element;
} => {
  const [padName, setPadName] = useState('');

  const EtherpadForm = (): JSX.Element => {
    const { t: translateBuilder } = useBuilderTranslation();
    return (
      <>
        <Typography variant="body1" paragraph>
          {translateBuilder(BUILDER.CREATE_NEW_ITEM_ETHERPAD_INFORMATIONS)}
        </Typography>
        <TextField
          variant="standard"
          autoFocus
          required
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
