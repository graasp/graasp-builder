import React from 'react';
import { Skeleton } from '@material-ui/lab';
import { Avatar, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { hooks } from '../../config/queryClient';
import { getMemberAvatar } from '../../utils/member';
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

  // broken link to display the first letter when avatar does not exist
  const brokenLink = 'broken image to display';

  return (
    <Avatar
      className={clsx(classes.avatar, buildMemberAvatarClass(id))}
      alt={member?.get('name')}
      src={getMemberAvatar(member?.get('extra')) || brokenLink}
    />
  );
};

MemberAvatar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MemberAvatar;
