import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { MODES } from '../../config/constants';
import ItemsTable from './ItemsTable';
import NewItemButton from './NewItemButton';
import ItemsGrid from './ItemsGrid';

const styles = (theme) => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class Items extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    mode: PropTypes.oneOf(Object.values(MODES)).isRequired,
    title: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { items, mode, title, classes } = this.props;
    return mode === MODES.CARD ? (
      <>
        <Typography className={classes.title} variant="h4">
          {title}
          <NewItemButton />
        </Typography>
        <ItemsGrid items={items} />
      </>
    ) : (
      <ItemsTable tableTitle={title} items={items} />
    );
  }
}

const mapStateToProps = ({ layout }) => ({
  mode: layout.get('mode'),
});

const ConnectedComponent = connect(mapStateToProps)(Items);
const StyledComponent = withStyles(styles)(ConnectedComponent);
const TranslatedComponent = withTranslation()(StyledComponent);
export default withRouter(TranslatedComponent);
