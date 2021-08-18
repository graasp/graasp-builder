import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Map } from 'immutable';
import PushPinIcon from '@material-ui/icons/PushPin';
import PushPinOutlinedIcon from '@material-ui/icons/PushPinOutlined' 
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';

const PinButton = ({ item, member }) => {
  const { t } = useTranslation();
  const mutation = useMutation(MUTATION_KEYS.EDIT_ITEM);
  console.log(item, member);

  const isPinned = item?.isPinned ?? false; // isItemPinned(item, member);

  const handlePin = () => {
    mutation.mutate({
        ...item,
        isPinned: true
    });
  };

  const handleUnpin = () => {
    mutation.mutate({
        ...item,
        isPinned: false
    });
  };

  return (
    <Tooltip
      title={isPinned ? t('Unpin') : t('Pin')}
    >
      <IconButton
        aria-label="favorite"
        className={FAVORITE_ITEM_BUTTON_CLASS}
        onClick={isPinned ? handleUnpin : handlePin}
      >
        {isPinned ? (
          <PushPinIcon fontSize="small" />
        ) : (
          <PushPinOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

PinButton.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired, isPinned: PropTypes.bool }).isRequired,
  member: PropTypes.instanceOf(Map).isRequired,
};

export default PinButton;
