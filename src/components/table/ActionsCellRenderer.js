import PropTypes from 'prop-types';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import EditButton from '../common/EditButton';
import ItemMenu from '../main/ItemMenu';
import {
  getMembershipsForItem,
  isItemUpdateAllowedForUser,
} from '../../utils/membership';
import DownloadButton from '../main/DownloadButton';

// items and memberships match by index
const ActionsCellRenderer = ({ memberships, items, member }) => {
  const ChildComponent = ({ data: item }) => {
    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
      if (items && memberships && !memberships.isEmpty() && !items.isEmpty()) {
        setCanEdit(
          isItemUpdateAllowedForUser({
            memberships: getMembershipsForItem({ item, items, memberships }),
            memberId: member?.id,
          }),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, memberships, item, member]);

    const renderAnyoneActions = () => (
      <ItemMenu item={item} canEdit={canEdit} />
    );

    const renderEditorActions = () => {
      if (!canEdit) {
        return null;
      }

      return (
        <>
          <EditButton item={item} />
          <DownloadButton id={item?.id} name={item?.name} />
        </>
      );
    };

    return (
      <>
        {renderEditorActions()}
        {renderAnyoneActions()}
      </>
    );
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};

ActionsCellRenderer.propTypes = {
  memberships: PropTypes.instanceOf(List).isRequired,
  member: PropTypes.instanceOf(Map).isRequired,
};

export default ActionsCellRenderer;
