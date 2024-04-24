import { DiscriminatedItem, PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import { hooks } from '../../../config/queryClient';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import ClearChatButton from './ClearChatButton';
import ItemSettingProperty from './ItemSettingProperty';

type Props = {
  item: DiscriminatedItem;
};

const AdminChatSettings = ({ item }: Props): JSX.Element | null => {
  const itemId = item.id;
  const { t } = useBuilderTranslation();
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    hooks.useItemMemberships(item.id);
  const { data: currentMember } = useCurrentUserContext();
  // only show export chat when user has admin right on the item
  const isAdmin = currentMember
    ? itemPermissions?.find((perms) => perms.member.id === currentMember.id)
        ?.permission === PermissionLevel.Admin
    : false;

  if (!isAdmin || isLoadingItemPermissions) {
    return null;
  }

  return (
    <ItemSettingProperty
      title={t(BUILDER.ITEM_SETTINGS_CHAT_SETTINGS_TITLE)}
      valueText={t(BUILDER.ITEM_SETTINGS_CLEAR_CHAT_EXPLANATION)}
      inputSetting={<ClearChatButton chatId={itemId} />}
    />
  );
};

export default AdminChatSettings;
