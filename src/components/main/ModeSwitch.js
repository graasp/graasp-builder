import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListIcon from '@material-ui/icons/List';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import IconButton from '@material-ui/core/IconButton';
import { MODES } from '../../config/constants';
import { setMode } from '../../actions/layout';

const ModeButtons = ({ dispatchSetMode, mode }) => {
  const { t } = useTranslation();

  const handleOnClick = (value) => {
    dispatchSetMode(value);
  };

  return (
    <div>
      <Tooltip title={t('View as List')}>
        <span>
          <IconButton
            disabled={mode === MODES.LIST}
            onClick={() => {
              handleOnClick(MODES.LIST);
            }}
            color="primary"
          >
            <ListIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t('View as Card')}>
        <span>
          <IconButton
            color="primary"
            disabled={mode === MODES.CARD}
            onClick={() => {
              handleOnClick(MODES.CARD);
            }}
          >
            <ViewModuleIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

ModeButtons.propTypes = {
  dispatchSetMode: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(Object.values(MODES)).isRequired,
};

const mapStateToProps = ({ layout }) => ({
  mode: layout.get('mode'),
});

const mapDispatchToProps = {
  dispatchSetMode: setMode,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModeButtons);

export default ConnectedComponent;
