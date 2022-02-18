import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { hooks, useMutation } from '../../config/queryClient';
import { HIDDEN_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { HIDDEN_ITEM_TAG_ID } from '../../config/constants';

const HideButton = ({ item }) => {
  const { t } = useTranslation();

  const { data: tags } = hooks.useItemTags(item.id);
  const addTag = useMutation(MUTATION_KEYS.POST_ITEM_TAG);
  const removeTag = useMutation(MUTATION_KEYS.DELETE_ITEM_TAG);

  const hiddenTag = tags
    ?.filter(({ tagId }) => tagId === HIDDEN_ITEM_TAG_ID)
    ?.first();

  // since children items are hidden because parent is hidden, the hidden tag should be removed from the root item
  const isOriginalHiddenItem = hiddenTag?.itemPath === item.path;

  const handlePin = () => {
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
  };

  let tooltip = hiddenTag ? t('Show Item') : t('Hide Item');
  if (hiddenTag && !isOriginalHiddenItem) {
    tooltip = t('This item is hidden because its parent item is hidden.');
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton
        aria-label={tooltip}
        className={HIDDEN_ITEM_BUTTON_CLASS}
        onClick={handlePin}
        disable={!isOriginalHiddenItem}
      >
        {hiddenTag ? (
          <VisibilityOff fontSize="small" />
        ) : (
          <Visibility fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

HideButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default HideButton;
