import React from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isValidURL } from '../../../utils/item';
import BaseForm from './BaseItemForm';
import { ITEM_FORM_LINK_INPUT_ID } from '../../../config/selectors';

function LinkForm({ onChange, item }) {
  const { t } = useTranslation();

  const handleLinkInput = (event) => {
    // todo: check url validity
    onChange({
      ...item,
      extra: { embeddedLinkItem: { url: event.target.value } },
    });
  };

  const { url } = item.extra?.embeddedLinkItem || {};
  const isLinkInvalid = url?.length && !isValidURL(url);

  return (
    <>
      <BaseForm onChange={onChange} item={item} />
      <TextField
        id={ITEM_FORM_LINK_INPUT_ID}
        error={isLinkInvalid}
        autoFocus
        margin="dense"
        label={t('Link')}
        value={url}
        onChange={handleLinkInput}
        helperText={Boolean(isLinkInvalid) && t('This link is not valid')}
      />
    </>
  );
}

LinkForm.propTypes = {
  onChange: PropTypes.string.isRequired,
  item: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    extra: PropTypes.shape({
      embeddedLinkItem: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default LinkForm;
