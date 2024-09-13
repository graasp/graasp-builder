import { ChangeEvent } from 'react';

import { IconButton, Stack, TextField, Tooltip } from '@mui/material';

import { RefreshCcwIcon } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';
import {
  SHORT_LINK_ALIAS_INPUT_ID,
  SHORT_LINK_RANDOMIZE_BUTTON_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';
import { randomAlias } from '@/utils/shortLink';

type Props = {
  alias: string;
  onChange: (newAlias: string) => void;
  hasError: boolean;
};

const AliasInput = ({ alias, onChange, hasError }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleAliasChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };
  return (
    <Stack direction="row" alignItems="center">
      <TextField
        id={SHORT_LINK_ALIAS_INPUT_ID}
        label={translateBuilder(BUILDER.ALIAS_INPUT)}
        variant="outlined"
        size="small"
        value={alias}
        onChange={handleAliasChange}
        error={hasError}
      />
      <Tooltip title={translateBuilder(BUILDER.GENERATE_ALIAS_TOOLTIP)}>
        <span>
          <IconButton
            onClick={() => onChange(randomAlias())}
            id={SHORT_LINK_RANDOMIZE_BUTTON_ID}
          >
            <RefreshCcwIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default AliasInput;
