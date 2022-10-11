import PropTypes from 'prop-types';

import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'react-i18next';

import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';
import { ITEM_TYPES } from '../../../enums';
import { isUrlValid } from '../../../utils/item';
import {
  buildEmbeddedLinkExtra,
  getEmbeddedLinkExtra,
} from '../../../utils/itemExtra';

const LinkForm = ({ onChange, item }) => {
  const { t } = useTranslation();

  const handleLinkInput = (event) => {
    onChange({
      ...item,
      name: 'a random name for link', // todo: this is replaced by iframely
      extra: buildEmbeddedLinkExtra({ url: event.target.value }),
    });
  };

  const { url } = getEmbeddedLinkExtra(item.extra) || {};
  const isLinkInvalid = url?.length && !isUrlValid(url);

  return (
    <>
      <Typography variant="h6">{t('Create a Link')}</Typography>
      <TextField
        id={ITEM_FORM_LINK_INPUT_ID}
        error={isLinkInvalid}
        autoFocus
        margin="dense"
        label={t('Link')}
        value={url}
        onChange={handleLinkInput}
        helperText={Boolean(isLinkInvalid) && t('This link is not valid')}
        fullWidth
      />
    </>
  );
};

LinkForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    extra: PropTypes.shape({
      [ITEM_TYPES.LINK]: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default LinkForm;
