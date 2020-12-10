import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Item from './Item';
import { ITEMS_GRID_NO_ITEM_ID } from '../../config/selectors';

class ItemsGrid extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
  };

  renderItems = () => {
    const { items, t } = this.props;

    if (!items || !items.size) {
      return (
        <Typography
          id={ITEMS_GRID_NO_ITEM_ID}
          variant="h3"
          align="center"
          display="block"
        >
          {t('No Item Here')}
        </Typography>
      );
    }

    return items.map((item) => (
      <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Item item={item} />
      </Grid>
    ));
  };

  render() {
    return (
      <>
        <Grid container spacing={1}>
          {this.renderItems()}
        </Grid>
      </>
    );
  }
}
const TranslatedComponent = withTranslation()(ItemsGrid);
export default withRouter(TranslatedComponent);
