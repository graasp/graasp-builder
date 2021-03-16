import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListIcon from '@material-ui/icons/List';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import IconButton from '@material-ui/core/IconButton';
import { MODES } from '../../../config/constants';
import { setMode } from '../../../actions/layout';
import {
  MODE_GRID_BUTTON_ID,
  MODE_LIST_BUTTON_ID,
} from '../../../config/selectors';

const ModeButton = ({ dispatchSetMode, mode }) => {
  const { t } = useTranslation();

  const handleOnClick = (value) => {
    dispatchSetMode(value);
  };

  switch (mode) {
    case MODES.GRID:
      return (
        <div>
          <Tooltip title={t('View as List')}>
            <span>
              <IconButton
                id={MODE_LIST_BUTTON_ID}
                onClick={() => {
                  handleOnClick(MODES.LIST);
                }}
                color="primary"
              >
                <ListIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    case MODES.LIST:
      return (
        <div>
          <Tooltip title={t('View as Card')}>
            <span>
              <IconButton
                id={MODE_GRID_BUTTON_ID}
                color="primary"
                onClick={() => {
                  handleOnClick(MODES.GRID);
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      );
    default:
      return null;
  }
};

ModeButton.propTypes = {
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
)(ModeButton);

export default ConnectedComponent;
