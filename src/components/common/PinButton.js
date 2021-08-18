import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Map } from 'immutable';
import PushPinIcon from '@material-ui/icons/PushPin';
import PushPinOutlinedIcon from '@material-ui/icons/PushPinOutlined' 
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';

const PinButton = ({ item, member }) => {
  const { t } = useTranslation();
  // const mutation = useMutation(MUTATION_KEYS.PIN_ITEM);
  console.log(item, member);

  const isPinned = true; // isItemPinned(item, member);

  const handlePin = () => {

  };

  const handleUnpin = () => {

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
  item: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  member: PropTypes.instanceOf(Map).isRequired,
};

export default PinButton;
