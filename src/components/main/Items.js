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
  };

  render() {
    const { items, mode, title } = this.props;
    return mode === MODES.CARD ? (
      <ItemsGrid title={title} items={items} />
    ) : (
      <ItemsTable tableTitle={title} items={items} />
    );
  }
}

const mapStateToProps = ({ layout }) => ({
  mode: layout.get('mode'),
});

const ConnectedComponent = connect(mapStateToProps)(Items);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
