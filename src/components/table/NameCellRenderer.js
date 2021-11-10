import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ItemIcon from '../main/ItemIcon';

const useStyles = makeStyles((theme) => ({
  nameCell: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: theme.spacing(1),
  },
}));

const NameCellRenderer = ({ data: item }) => {
  const classes = useStyles();

  return (
    <div className={classes.nameCell}>
      <ItemIcon type={item.type} extra={item.extra} name={item.name} />
      <div className={classes.name}>{item.name}</div>
    </div>
  );
};

NameCellRenderer.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    extra: PropTypes.shape({}),
  }).isRequired,
};

export default NameCellRenderer;
