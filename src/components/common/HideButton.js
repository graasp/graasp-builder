import PropTypes from 'prop-types';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import { useTranslation } from 'react-i18next';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';

import { BUTTON_TYPES, HIDDEN_ITEM_TAG_ID } from '../../config/constants';
import { hooks, useMutation } from '../../config/queryClient';
import { HIDDEN_ITEM_BUTTON_CLASS } from '../../config/selectors';

const HideButton = ({ item, type, onClick }) => {
  const { t } = useTranslation();

  const { data: tags } = hooks.useItemTags(item.id);
  const addTag = useMutation(MUTATION_KEYS.POST_ITEM_TAG);
  const removeTag = useMutation(MUTATION_KEYS.DELETE_ITEM_TAG);
  const hiddenTag = tags
    ?.filter(({ tagId }) => tagId === HIDDEN_ITEM_TAG_ID)
    ?.first();
  // since children items are hidden because parent is hidden, the hidden tag should be removed from the root item
  // if hiddenTag is undefined -> the item is not hidden
  const isOriginalHiddenItem = !hiddenTag || hiddenTag?.itemPath === item.path;

  const handleToggleHide = () => {
    if (hiddenTag) {
      removeTag.mutate({
        id: item.id,
        tagId: hiddenTag.id,
      });
    } else {
      addTag.mutate({
        id: item.id,
        tagId: HIDDEN_ITEM_TAG_ID,
      });
    }
    onClick?.();
  };

  const text = hiddenTag
    ? t(BUILDER.HIDE_ITEM_SHOW_TEXT)
    : t(BUILDER.HIDE_ITEM_HIDE_TEXT);
  let tooltip = text;
  if (hiddenTag && !isOriginalHiddenItem) {
    tooltip = t(BUILDER.HIDE_ITEM_HIDDEN_PARENT_INFORMATION);
  }

  const icon = hiddenTag ? <VisibilityOff /> : <Visibility />;

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM: {
      const menuItem = (
        <MenuItem
          key={text}
          onClick={handleToggleHide}
          className={HIDDEN_ITEM_BUTTON_CLASS}
          disabled={!isOriginalHiddenItem}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          {text}
        </MenuItem>
      );

      // show tooltip only on disabled
      if (isOriginalHiddenItem) {
        return menuItem;
      }
      return (
        <Tooltip title={tooltip} placement="left">
          <span>{menuItem}</span>
        </Tooltip>
      );
    }
    default:
    case BUTTON_TYPES.ICON_BUTTON:
      return (
        <Tooltip title={tooltip}>
          <span>
            <IconButton
              aria-label={text}
              className={HIDDEN_ITEM_BUTTON_CLASS}
              onClick={handleToggleHide}
              disabled={!isOriginalHiddenItem}
            >
              {icon}
            </IconButton>
          </span>
        </Tooltip>
      );
  }
};

HideButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

HideButton.defaultProps = {
  type: BUTTON_TYPES.ICON_BUTTON,
  onClick: null,
};

export default HideButton;
