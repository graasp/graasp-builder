import { DiscriminatedItem } from '@graasp/sdk';
import { ActionButtonVariant, ChatboxButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';

type Props = {
  type?: ActionButtonVariant;
  item: DiscriminatedItem;
  showChatTextKey?: string;
  hideChatTextKey?: string;
};

const ShowChatboxButton = ({
  item,
  type,
  showChatTextKey = 'Show Chat',
  hideChatTextKey = 'Hide Chat',
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  const editItem = mutations.useEditItem();
  const showChatbox = item?.settings?.showChatbox;

  const onClick = () => {
    editItem.mutate({
      id: item.id,
      name: item.name,
      settings: {
        showChatbox: !showChatbox,
      },
    });
  };

  return (
    <ChatboxButton
      color={showChatbox ? 'primary' : 'inherit'}
      showChat={showChatbox ?? false}
      type={type}
      onClick={onClick}
      showChatText={translateBuilder(showChatTextKey)}
      hideChatText={translateBuilder(hideChatTextKey)}
    />
  );
};

export default ShowChatboxButton;
