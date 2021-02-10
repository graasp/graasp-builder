import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { MODES } from '../../config/constants';
import ItemsTable from './ItemsTable';
import ItemsGrid from './ItemsGrid';

// eslint-disable-next-line react/prefer-stateless-function
class Items extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    mode: PropTypes.oneOf(Object.values(MODES)).isRequired,
    title: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.string,
  };

  static defaultProps = {
    id: null,
  };

  render() {
    const { items, mode, title, id } = this.props;
    switch (mode) {
      case MODES.GRID:
        return <ItemsGrid id={id} title={title} items={items} />;
      case MODES.LIST:
      default:
        return <ItemsTable id={id} tableTitle={title} items={items} />;
    }
  }
}

const mapStateToProps = ({ layout }) => ({
  mode: layout.get('mode'),
});

const ConnectedComponent = connect(mapStateToProps)(Items);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
