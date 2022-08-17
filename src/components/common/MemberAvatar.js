import React from 'react';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { Avatar } from '@graasp/ui';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { hooks } from '../../config/queryClient';
import { buildMemberAvatarClass } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(0, 0.3),
  },
}));

const MemberAvatar = ({ id }) => {
  const classes = useStyles();
  const { data: member, isLoading } = hooks.useMember(id);
  if (isLoading) {
    return <Skeleton variant="circle" width={40} height={40} />;
  }

  return (
    <Avatar
      className={clsx(classes.avatar, buildMemberAvatarClass(id))}
      alt={member?.name}
      id={member?.id}
      extra={member?.extra}
      useAvatar={hooks.useAvatar}
      variant="circle"
      component="avatar"
      maxWidth={30}
      maxHeight={30}
    />
  );
};

MemberAvatar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MemberAvatar;
