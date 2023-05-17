import { TextField, TextFieldProps } from '@mui/material';
import Typography from '@mui/material/Typography';

import { EmbeddedLinkItemType, getEmbeddedLinkExtra } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';
import { isUrlValid } from '../../../utils/item';
import { buildEmbeddedLinkExtra } from '../../../utils/itemExtra';

type Props = {
  onChange: (item: Partial<EmbeddedLinkItemType>) => void;
  item?: EmbeddedLinkItemType;
};

const LinkForm = ({ onChange, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleLinkInput: TextFieldProps['onChange'] = (event) => {
    onChange({
      ...item,
      name: translateBuilder(BUILDER.LINK_DEFAULT_NAME), // todo: this is replaced by iframely
      extra: buildEmbeddedLinkExtra({
        url: event.target.value,
        html: '',
        thumbnails: [],
        icons: [],
      }),
    });
  };

  const { url } = getEmbeddedLinkExtra(item?.extra) || {};
  const isLinkInvalid = Boolean(url?.length) && !isUrlValid(url);

  return (
    <>
      <Typography variant="h6">
        {translateBuilder(BUILDER.CREATE_ITEM_LINK_TITLE)}
      </Typography>
      <TextField
        id={ITEM_FORM_LINK_INPUT_ID}
        error={isLinkInvalid}
        autoFocus
        margin="dense"
        label={translateBuilder(BUILDER.CREATE_ITEM_LINK_LABEL)}
        value={url}
        onChange={handleLinkInput}
        helperText={
          Boolean(isLinkInvalid) &&
          translateBuilder(BUILDER.CREATE_ITEM_LINK_INVALID_LINK_ERROR)
        }
        fullWidth
      />
    </>
  );
};

export default LinkForm;
