import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PushPinIcon from '@material-ui/icons/PushPin';
import PushPinOutlinedIcon from '@material-ui/icons/PushPinOutlined';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../config/queryClient';
import { PIN_ITEM_BUTTON_CLASS } from '../../config/selectors';

const PinButton = ({ item }) => {
  const { t } = useTranslation();

  const editItem = useMutation(MUTATION_KEYS.EDIT_ITEM);
  const [isPinned, setPinned] = useState(item?.settings?.isPinned);

  const handlePin = () => {
    const newState = !isPinned;

    setPinned(newState);

    const { settings } = item;
    settings.isPinned = newState;

    editItem.mutate({
      id: item.id,
      name: item.name,
      settings: item.settings,
    });
  };

  return (
    <Tooltip title={isPinned ? t('Unpin') : t('Pin')}>
      <IconButton
        aria-label={isPinned ? t('Unpin') : t('Pin')}
        className={PIN_ITEM_BUTTON_CLASS}
        onClick={handlePin}
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
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    settings: PropTypes.shape({
      isPinned: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PinButton;
