/* eslint-disable no-alert */
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

import { Item, Member, PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { useBuilderTranslation } from '@/config/i18n';
import {
  DOWNGRADE_OWN_PERMISSION_DIALOG_DESC_ID,
  DOWNGRADE_OWN_PERMISSION_DIALOG_TITLE_ID,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

import { useIsParentInstance } from '../../../utils/item';
import ItemMembershipSelect from './ItemMembershipSelect';
import type { ItemMembershipSelectProps } from './ItemMembershipSelect';

type TableRowPermissionRendererProps<T> = {
  item: ItemRecord;
  editFunction: (args: { value: PermissionLevel; instance: T }) => void;
  createFunction: (args: { value: PermissionLevel; instance: T }) => void;
  readOnly?: boolean;
  currentMember?: Member;
};

function TableRowPermissionRenderer<
  T extends { permission: PermissionLevel; item: Item; member?: Member },
>({
  item,
  editFunction,
  createFunction,
  readOnly = false,
  currentMember,
}: TableRowPermissionRendererProps<T>): ({ data }: { data: T }) => JSX.Element {
  const ChildComponent = ({ data: instance }: { data: T }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
    };
    const isParentMembership = useIsParentInstance({
      instance,
      item,
    });
    const onChangePermission: ItemMembershipSelectProps['onChange'] = (e) => {
      const value = e.target.value as PermissionLevel;
      // editing a parent's instance from a child should create a new instance
      console.log({
        value,
        instancePer: instance.permission,
        instanceMem: instance?.member?.id,
        currentMember: currentMember?.id,
      });
      if (
        (value === PermissionLevel.Read || value === PermissionLevel.Write) &&
        instance.permission === PermissionLevel.Admin &&
        instance?.member &&
        instance?.member?.id === currentMember?.id
      ) {
        setOpen(true);
        return;
      }
      if (
        value === PermissionLevel.Read &&
        instance.permission === PermissionLevel.Write &&
        instance?.member &&
        instance?.member?.id === currentMember?.id
      ) {
        setOpen(true);
        return;
      }
      if (isParentMembership) {
        createFunction({ value, instance });
      } else {
        editFunction({ value, instance });
      }
    };
    const { t: translateBuilder } = useBuilderTranslation();

    return readOnly ? (
      <Typography noWrap>{instance.permission}</Typography>
    ) : (
      <>
        <ItemMembershipSelect
          value={instance.permission}
          showLabel={false}
          onChange={onChangePermission}
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
            <Alert severity="error">
              {translateBuilder(BUILDER.DOWNGRADE_PERMISSION_DESCRIPTION)}
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus variant="text">
              {translateBuilder(BUILDER.APPROVE_BUTTON_TEXT)}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return ChildComponent;
}
export default TableRowPermissionRenderer;
