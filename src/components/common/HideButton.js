import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { hooks, useMutation } from '../../config/queryClient';
import { HIDDEN_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { BUTTON_TYPES, HIDDEN_ITEM_TAG_ID } from '../../config/constants';

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

  let text = hiddenTag ? t('Show') : t('Hide');
  if (hiddenTag && !isOriginalHiddenItem) {
    text = t('This item is hidden because its parent item is hidden.');
  }

  const icon = hiddenTag ? <VisibilityOff /> : <Visibility />;

  switch (type) {
    case BUTTON_TYPES.MENU_ITEM:
      return (
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
    default:
    case BUTTON_TYPES.ICON_BUTTON:
      return (
        <Tooltip title={text}>
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
