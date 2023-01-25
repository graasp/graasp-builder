import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';

import { EmbeddedLinkItemExtraProperties, Item, ItemType } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';
import { isUrlValid } from '../../../utils/item';

type Props = {
  onChange: (item: Partial<Item>) => void;
  item: Partial<Item>;
};

const LinkForm = ({ onChange, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleLinkInput = (event) => {
    onChange({
      ...item,
      name: translateBuilder(BUILDER.LINK_DEFAULT_NAME), // todo: this is replaced by iframely
      extra: { [ItemType.LINK]: { url: event.target.value } },
    });
  };

  const { url } =
    (item.extra[ItemType.LINK] as EmbeddedLinkItemExtraProperties) || {};
  const isLinkInvalid = url?.length && !isUrlValid(url);

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
