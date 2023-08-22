import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { LibraryIcon } from '@graasp/ui';

import { useBuilderTranslation } from '../../config/i18n';
import {
  PUBLISH_ITEM_BUTTON_CLASS,
  buildPublishButtonId,
} from '../../config/selectors';
import { ItemActionTabs } from '../../enums';
import { BUILDER } from '../../langs/constants';
import { useLayoutContext } from '../context/LayoutContext';

type Props = {
  itemId: string;
};

const PublishButton = ({ itemId }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { openedActionTabId, setOpenedActionTabId } = useLayoutContext();

  const onClick = () => {
    setOpenedActionTabId(
      openedActionTabId === ItemActionTabs.Library
        ? null
        : ItemActionTabs.Library,
    );
  };

  const title = translateBuilder(BUILDER.LIBRARY_SETTINGS_BUTTON_TITLE);

  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          aria-label={title}
          className={PUBLISH_ITEM_BUTTON_CLASS}
          onClick={onClick}
          id={buildPublishButtonId(itemId)}
        >
          {openedActionTabId === ItemActionTabs.Library ? (
            <CloseIcon />
          ) : (
            <LibraryIcon size={24} showSetting primaryColor="#777" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default PublishButton;
