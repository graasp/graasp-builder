import { useState } from 'react';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { DiscriminatedItem, Item, Member, PermissionLevel } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';

import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  DOWNGRADE_OWN_PERMISSION_DIALOG_DESC_ID,
  DOWNGRADE_OWN_PERMISSION_DIALOG_TITLE_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { useIsParentInstance } from '../../../utils/item';
import ItemMembershipSelect from './ItemMembershipSelect';
import type { ItemMembershipSelectProps } from './ItemMembershipSelect';

type TableRowPermissionRendererProps<T> = {
  item: DiscriminatedItem;
  editFunction: (args: { value: PermissionLevel; instance: T }) => void;
  createFunction: (args: { value: PermissionLevel; instance: T }) => void;
  readOnly?: boolean;
  hasOnlyOneAdmin?: boolean;
};

function TableRowPermissionRenderer<
  T extends { permission: PermissionLevel; item: Item; member?: Member },
>({
  item,
  editFunction,
  createFunction,
  readOnly = false,
  hasOnlyOneAdmin,
}: TableRowPermissionRendererProps<T>): ({ data }: { data: T }) => JSX.Element {
  const ChildComponent = ({ data: instance }: { data: T }) => {
    const [open, setOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(
      instance.permission,
    );

    const { t: translateBuilder } = useBuilderTranslation();
    const { t: translateCommon } = useCommonTranslation();
    const { data: currentMember } = hooks.useCurrentMember();

    const handleClose = () => {
      setOpen(false);
    };
    const isEditingOwnPermission =
      instance?.member && instance?.member?.id === currentMember?.id;

    const isEditingTheOnlyAdmin = Boolean(
      hasOnlyOneAdmin && instance.permission === PermissionLevel.Admin,
    );
    const isParentMembership = useIsParentInstance({
      instance,
      item,
    });
    const changePermission = (value: PermissionLevel) => {
      // editing a parent's instance from a child should create a new instance
      if (isParentMembership) {
        createFunction({ value, instance });
      } else {
        editFunction({ value, instance });
      }
    };
    const onChangePermission: ItemMembershipSelectProps['onChange'] = (e) => {
      const value = e.target.value as PermissionLevel;
      setSelectedPermission(value);
      if (
        (value === PermissionLevel.Read || value === PermissionLevel.Write) &&
        instance.permission === PermissionLevel.Admin &&
        isEditingOwnPermission
      ) {
        setOpen(true);
      } else {
        changePermission(value);
      }
    };

    // permissions will be disabled when trying to change permission for the only admin
    const permissionDisabledMap = {
      admin: isEditingTheOnlyAdmin,
      read: isEditingTheOnlyAdmin,
      write: isEditingTheOnlyAdmin,
    };

    return readOnly ? (
      <Typography noWrap>{instance.permission}</Typography>
    ) : (
      <>
        <ItemMembershipSelect
          value={instance.permission}
          showLabel={false}
          onChange={onChangePermission}
          disabledMap={permissionDisabledMap}
        />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby={DOWNGRADE_OWN_PERMISSION_DIALOG_TITLE_ID}
          aria-describedby={DOWNGRADE_OWN_PERMISSION_DIALOG_DESC_ID}
        >
          <DialogTitle id={DOWNGRADE_OWN_PERMISSION_DIALOG_TITLE_ID}>
            {translateBuilder(BUILDER.DOWNGRADE_PERMISSION_TITLE)}
          </DialogTitle>
          <DialogContent>
            {hasOnlyOneAdmin ? (
              <Alert severity="error">
                {translateBuilder(BUILDER.DELETE_LAST_ADMIN_ALERT_MESSAGE)}
              </Alert>
            ) : (
              translateBuilder(BUILDER.DOWNGRADE_PERMISSION_DESCRIPTION)
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus variant="text">
              {translateCommon(COMMON.CLOSE_BUTTON)}
            </Button>
            {!hasOnlyOneAdmin && (
              <Button
                onClick={() => changePermission(selectedPermission)}
                autoFocus
                variant="text"
              >
                {translateBuilder(BUILDER.APPROVE_BUTTON_TEXT)}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return ChildComponent;
}
export default TableRowPermissionRenderer;
