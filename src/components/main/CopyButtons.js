import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { FilterNone } from '@material-ui/icons';
import { ITEM_COPY_BUTTON_CLASS } from '../../config/selectors';
import { CopyItemModalContext } from '../context/CopyItemModalContext';

const CopyButton = ({ itemIds, color, id }) => {
  const { t } = useTranslation();

  const { openModal: openCopyModal } = useContext(CopyItemModalContext);

  const handleCopy = () => {
    openCopyModal(itemIds);
  };

  return (
    <>
      <Tooltip title={t('Copy')}>
        <IconButton
          id={id}
          color={color}
          className={ITEM_COPY_BUTTON_CLASS}
          aria-label="copy"
          onClick={handleCopy}
        >
          <FilterNone />
        </IconButton>
      </Tooltip>
    </>
  );
};

CopyButton.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string,
  id: PropTypes.string,
};

CopyButton.defaultProps = {
  color: 'default',
  id: '',
};

export default CopyButton