import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import NewItemButton from './NewItemButton';
import Item from './Item';
import EmptyItem from './EmptyItem';

const styles = (theme) => ({
  title: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
});
class ItemsGrid extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(List).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ itemId: PropTypes.string }).isRequired,
    }).isRequired,
    classes: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
  };

  renderItems = () => {
    const { items } = this.props;

    if (!items || !items.size) {
      return <EmptyItem />;
    }

    return items.map((item) => (
      <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Item item={item} />
      </Grid>
    ));
  };

  render() {
    const { classes, title } = this.props;
    return (
      <>
        <Typography className={classes.title} variant="h4">
          {title}
          <NewItemButton />
        </Typography>
        <Grid container spacing={1}>
          {this.renderItems()}
        </Grid>
      </>
    );
  }
}
const StyledComponent = withStyles(styles)(ItemsGrid);
export default withRouter(StyledComponent);
