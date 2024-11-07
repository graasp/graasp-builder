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
  SHARE_ITEM_CANCEL_BUTTON_CY,
  SHARE_ITEM_EMAIL_INPUT_ID,
  SHARE_ITEM_SHARE_BUTTON_ID,
} from '../../../../config/selectors';
import { BUILDER } from '../../../../langs/constants';
import ItemMembershipSelect from '../ItemMembershipSelect';

type ContentProps = {
  item: DiscriminatedItem;
  handleClose: () => void;
};

type Inputs = {
  email: string;
  permission: PermissionLevel;
};

const Content = ({ handleClose, item }: ContentProps) => {
  const itemId = item.id;

  const { mutateAsync: shareItem } = mutations.useShareItem();
  const { data: memberships } = hooks.useItemMemberships(item.id);
  const { data: invitations } = hooks.useItemInvitations(item.id);

  const { t: translateCommon } = useCommonTranslation();
  const { t: translateBuilder } = useBuilderTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { permission: PermissionLevel.Read } });
  const permission = watch('permission');

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

      handleClose();
    } catch (e) {
      console.error(e);
    }
    return returnedValue;
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleShare)}>
      <DialogContent>
        <Stack gap={3}>
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
                validate: {
                  isEmail: (email) =>
                    validator.isEmail(email) ||
                    translateBuilder(
                      BUILDER.SHARE_ITEM_FORM_INVITATION_INVALID_EMAIL_MESSAGE,
                    ),
                  noMembership: (email) =>
                    !memberships?.some(
                      ({ account }) =>
                        account.type === AccountType.Individual &&
                        account.email === email,
                    ) ||
                    translateBuilder(
                      BUILDER.SHARE_ITEM_FORM_ALREADY_HAVE_MEMBERSHIP_MESSAGE,
                    ),
                  noInvitation: (email) =>
                    !invitations?.some((inv) => inv.email === email) ||
                    translateBuilder(
                      BUILDER.SHARE_ITEM_FORM_INVITATION_EMAIL_EXISTS_MESSAGE,
                    ),
                },
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={handleClose}
          dataCy={SHARE_ITEM_CANCEL_BUTTON_CY}
        >
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
  );
};

type CreateItemMembershipFormProps = {
  item: ContentProps['item'];
  open: boolean;
  handleClose: ContentProps['handleClose'];
};

const CreateItemMembershipForm = ({
  item,
  open,
  handleClose,
}: CreateItemMembershipFormProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {translateBuilder(BUILDER.SHARE_ITEM_FORM_TITLE, {
          name: truncate(item.name, { length: ITEM_NAME_MAX_LENGTH }),
        })}
      </DialogTitle>
      <Content item={item} handleClose={handleClose} />
    </Dialog>
  );
};

export default CreateItemMembershipForm;
