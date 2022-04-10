import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Loader } from '@graasp/ui';
import { makeStyles } from '@material-ui/core';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import { LayoutContext } from '../../context/LayoutContext';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import ItemPublishConfiguration from './ItemPublishConfiguration';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
}));

const ItemPublishTab = ({ item, memberships }) => {
  const classes = useStyles();
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentUserContext);
  const { setIsItemPublishOpen } = useContext(LayoutContext);

  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.get('id'),
  });

  useEffect(
    () => () => {
      setIsItemPublishOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (isLoadingCurrentMember) {
    return <Loader />;
  }

  return (
    <Container disableGutters className={classes.wrapper}>
      <ItemPublishConfiguration item={item} edit={canEdit} />
    </Container>
  );
};
ItemPublishTab.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  memberships: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
export default ItemPublishTab;
