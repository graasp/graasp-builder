import { useState } from 'react';
import { Trans } from 'react-i18next';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button, EditButton } from '@graasp/ui';

import useModalStatus from '@/components/hooks/useModalStatus';
import { BUILDER } from '@/langs/constants';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../../config/i18n';
import ItemMembershipSelect from '../ItemMembershipSelect';

type Props = {
  email?: string;
  name?: string;
  allowDowngrade?: boolean;
  permission: PermissionLevel;
  handleUpdate: (p: PermissionLevel) => void;
  id?: string;
};

const EditPermissionButton = ({
  email,
  name,
  permission,
  allowDowngrade = true,
  handleUpdate,
  id,
}: Props): JSX.Element | null => {
  const { isOpen, openModal, closeModal } = useModalStatus();

  const [currentPermission, setCurrentPermission] = useState(permission);

  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  if (!allowDowngrade && permission === PermissionLevel.Admin) {
    return null;
  }

  return (
    <>
      <EditButton id={id} onClick={() => openModal()} />
      <Dialog onClose={closeModal} open={isOpen}>
        <DialogTitle>
          <Trans
            t={translateBuilder}
            i18nKey={BUILDER.EDIT_PERMISSION_DIALOG_TITLE}
            values={{
              name: name || email,
            }}
            components={{ 1: <strong /> }}
          />
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <Typography variant="body1">
              {translateBuilder(
                BUILDER.EDIT_PERMISSION_CANNOT_DOWNGRADE_FROM_PARENT,
              )}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <div>
                <Typography noWrap fontWeight="bold">
                  {name}
                </Typography>
                <Typography noWrap variant="subtitle2">
                  {email}
                </Typography>
              </div>
              <ItemMembershipSelect
                value={currentPermission}
                onChange={(e) =>
                  setCurrentPermission(e.target.value as PermissionLevel)
                }
                size="medium"
                allowDowngrade={allowDowngrade}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={closeModal}>
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button
            type="submit"
            onClick={() => {
              handleUpdate(currentPermission);
              closeModal();
            }}
          >
            {translateBuilder(BUILDER.EDIT_PERMISSION_DIALOG_SUBMIT_BUTTON)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditPermissionButton;
