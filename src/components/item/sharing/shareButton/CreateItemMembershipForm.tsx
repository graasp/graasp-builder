import { useForm } from 'react-hook-form';

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { AccountType, DiscriminatedItem, PermissionLevel } from '@graasp/sdk';
import { COMMON } from '@graasp/translations';
import { Button } from '@graasp/ui';

import truncate from 'lodash.truncate';
import validator from 'validator';

import { ITEM_NAME_MAX_LENGTH } from '@/config/constants';

import {
  useBuilderTranslation,
  useCommonTranslation,
} from '../../../../config/i18n';
import { hooks, mutations } from '../../../../config/queryClient';
import {
  CREATE_MEMBERSHIP_FORM_ID,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import ItemMembershipSelect from '../ItemMembershipSelect';

type Props = {
  item: DiscriminatedItem;
  open: boolean;
  handleClose: () => void;
};

type Inputs = {
  email: string;
  permission: PermissionLevel;
};

const CreateItemMembershipForm = ({
  item,
  open,
  handleClose,
}: Props): JSX.Element => {
  const itemId = item.id;

  const { mutateAsync: shareItem } = mutations.useShareItem();
  const { data: memberships } = hooks.useItemMemberships(item.id);

  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { permission: PermissionLevel.Read } });
  const permission = watch('permission');

  const checkForInvitationError = (email: string): string | boolean => {
    // check mail validity
    if (!email) {
      return translateBuilder(
        BUILDER.SHARE_ITEM_FORM_INVITATION_EMPTY_EMAIL_MESSAGE,
      );
    }
    if (!validator.isEmail(email)) {
      return translateBuilder(
        BUILDER.SHARE_ITEM_FORM_INVITATION_INVALID_EMAIL_MESSAGE,
      );
    }
    // check mail does not already exist
    if (
      memberships?.find(
        ({ account }) =>
          account.type === AccountType.Individual && account.email === email,
      )
    ) {
      return translateBuilder(
        BUILDER.SHARE_ITEM_FORM_INVITATION_EMAIL_EXISTS_MESSAGE,
      );
    }
    return true;
  };

  const handleShare = async (data: Inputs) => {
    let returnedValue;
    try {
      await shareItem({
        itemId,
        invitations: [
          {
            email: data.email,
            permission: data.permission,
          },
        ],
      });

      // reset email input
      reset({ email: '', permission: PermissionLevel.Read });

      handleClose();
    } catch (e) {
      console.error(e);
    }
    return returnedValue;
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {translateBuilder(BUILDER.SHARE_ITEM_FORM_TITLE, {
          name: truncate(item.name, { length: ITEM_NAME_MAX_LENGTH }),
        })}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(handleShare)}>
        <DialogContent>
          <Typography variant="body1">
            {translateBuilder(BUILDER.SHARE_ITEM_FORM_INVITATION_TOOLTIP)}
          </Typography>
          <Stack
            id={CREATE_MEMBERSHIP_FORM_ID}
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <TextField
              id={SHARE_ITEM_EMAIL_INPUT_ID}
              variant="outlined"
              label={translateBuilder(BUILDER.SHARE_ITEM_FORM_EMAIL_LABEL)}
              helperText={errors.email?.message}
              {...register('email', {
                required: true,
                validate: checkForInvitationError,
              })}
              error={Boolean(errors.email)}
              sx={{ flexGrow: 1 }}
            />
            <ItemMembershipSelect
              value={permission}
              onChange={(event) => {
                if (event.target.value) {
                  setValue('permission', event.target.value as PermissionLevel);
                }
              }}
              size="medium"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            {translateCommon(COMMON.CANCEL_BUTTON)}
          </Button>
          <Button
            disabled={Boolean(errors.email)}
            id={SHARE_ITEM_SHARE_BUTTON_ID}
            type="submit"
          >
            {translateBuilder(BUILDER.SHARE_ITEM_FORM_CONFIRM_BUTTON)}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateItemMembershipForm;
