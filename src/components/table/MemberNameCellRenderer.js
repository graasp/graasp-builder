import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const MemberNameCellRenderer = (users) => {
  const ChildComponent = ({ data: item }) => {
    const user = users?.find(({ id }) => id === item.creator);

    return <Typography noWrap>{user?.name ?? ''}</Typography>;
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      creator: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};

export default MemberNameCellRenderer;
