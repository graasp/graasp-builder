import { TextField, TextFieldProps, Typography } from '@mui/material';

import { LinkItemType, buildLinkExtra, getLinkExtra } from '@graasp/sdk';

import { useBuilderTranslation } from '../../../config/i18n';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import { isUrlValid } from '../../../utils/item';

type Props = {
  onChange: (item: Partial<LinkItemType>) => void;
  item?: LinkItemType;
};

const LinkForm = ({ onChange, item }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const handleLinkInput: TextFieldProps['onChange'] = (event) => {
    const newValue = event.target.value;
    const hasProtocol = /^https?:\/\//;
    onChange({
      ...item,
      name: translateBuilder(BUILDER.LINK_DEFAULT_NAME), // todo: this is replaced by iframely
      extra: buildLinkExtra({
        // when used inside the NewItem Modal this component does not receive the item prop
        // so the https will not show, but it will be added when we submit the url.
        url: hasProtocol.test(newValue) ? newValue : `https://${newValue}`,
        html: '',
        thumbnails: [],
        icons: [],
      }),
    });
  };

  let url = null;
  if (item?.extra) {
    ({ url } = getLinkExtra(item?.extra) || {});
  }
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
