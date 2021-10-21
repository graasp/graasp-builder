import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { OpenWith } from '@material-ui/icons';
import { ITEM_MOVE_BUTTON_CLASS } from '../../config/selectors';
import { MoveItemModalContext } from '../context/MoveItemModalContext';

const MoveButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();

  const { openModal: openMoveModal } = useContext(MoveItemModalContext);

  const handleMove = () => {
    openMoveModal(itemIds);
  };

  return (
    <>
      <Tooltip title={t('Move')}>
        <IconButton
          id={id}
          color={color}
          className={ITEM_MOVE_BUTTON_CLASS}
          aria-label="move"
          onClick={handleMove}
        >
          <OpenWith />
        </IconButton>
      </Tooltip>
    </>
  );
};

MoveButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};

MoveButton.defaultProps = {
  color: 'default',
  id: '',
};

export default MoveButton;
