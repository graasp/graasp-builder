import React from 'react';
import PropTypes from 'prop-types';
import { useIsParentInstance } from '../../../utils/item';
import ItemMembershipSelect from './ItemMembershipSelect';
import { PERMISSION_LEVELS } from '../../../enums';

const TableRowPermission = ({ item, editFunction, createFunction }) => {
  const ChildComponent = ({ data: instance }) => {
    const isParentMembership = useIsParentInstance({
      instance,
      item,
    });

    const onChangePermission = (e) => {
      const { value } = e.target;
      // editing a parent's instance from a child should create a new instance
      if (isParentMembership) {
        createFunction({ value, instance });
      } else {
        editFunction({ value, instance });
      }
    };

    return (
      <ItemMembershipSelect
        value={instance.permission}
        showLabel={false}
        onChange={onChangePermission}
      />
    );
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      permission: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
      itemPath: PropTypes.string.isRequired,
    }).isRequired,
  };
  return ChildComponent;
};
export default TableRowPermission;
