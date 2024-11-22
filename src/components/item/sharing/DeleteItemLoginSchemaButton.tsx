import { Trans } from 'react-i18next';

import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { DiscriminatedItem, ItemLoginSchemaStatus } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import { useGuestMemberships } from '@/components/hooks/useGuestMemberships';
import useModalStatus from '@/components/hooks/useModalStatus';
import { useBuilderTranslation, useCommonTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

function DeleteItemLoginSchemaButton({
  itemId,
}: {
  itemId: DiscriminatedItem['id'];
}): JSX.Element | null {
  const { data: itemLoginSchema } = hooks.useItemLoginSchema({ itemId });
  const { mutate: deleteItemLoginSchema } =
    mutations.useDeleteItemLoginSchema();
  const { data: guestMemberships } = useGuestMemberships(itemId);

  const { isOpen, closeModal, openModal } = useModalStatus();
  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const onSubmit = () => {
    deleteItemLoginSchema({ itemId });
  };

  // immediately delete item login schema if does not contain any guests
  // this case can happen if all guests has been manually deleted
  const onClick = () => {
    if (guestMemberships?.length) {
      openModal();
    } else {
      onSubmit();
    }
  };

  if (
    itemLoginSchema &&
    itemLoginSchema.status !== ItemLoginSchemaStatus.Active &&
    guestMemberships // memberships are fetched
  ) {
    return (
      <>
        <Alert
          severity="info"
          action={
            <Button
              color="error"
              size="small"
              variant="outlined"
              onClick={onClick}
            >
              {translateBuilder(BUILDER.DELETE_BTN)}
            </Button>
          }
        >
          {guestMemberships.length
            ? translateBuilder(BUILDER.DELETE_GUESTS_ALERT_TEXT)
            : translateBuilder(BUILDER.DELETE_ITEM_LOGIN_SCHEMA_ALERT_TEXT)}
        </Alert>

        <Dialog onClose={closeModal} open={isOpen}>
          <DialogTitle>
            {translateBuilder(BUILDER.DELETE_GUESTS_MODAL_TITLE, {
              count: guestMemberships.length,
            })}
          </DialogTitle>
          <DialogContent>
            <Typography>
              <Trans
                t={translateBuilder}
                i18nKey={BUILDER.DELETE_GUESTS_MODAL_CONTENT}
                components={{ 1: <strong /> }}
              />
            </Typography>
            <ul>
              {guestMemberships.map(({ account }) => (
                <li>{account.name}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button size="small" variant="text" onClick={closeModal}>
              {translateCommon(COMMON.CANCEL_BUTTON)}
            </Button>
            <Button
              dataCy="delete"
              color="error"
              size="small"
              onClick={onSubmit}
            >
              {translateBuilder(BUILDER.DELETE_GUESTS_MODAL_DELETE_BUTTON)}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return null;
}

export default DeleteItemLoginSchemaButton;
