import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from 'react-query';
import { hooks } from '../../config/queryClient';
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

  return (
    <Tooltip title={hiddenTag ? t('Show Item') : t('Hide Item')}>
      <IconButton
        aria-label={hiddenTag ? t('Show Item') : t('Hide Item')}
        className={HIDDEN_ITEM_BUTTON_CLASS}
        onClick={handlePin}
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
    itemPath: PropTypes.string.isRequired,
  }).isRequired,
};

export default HideButton;
