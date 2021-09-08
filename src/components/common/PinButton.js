import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Map } from 'immutable';
import PushPinIcon from '@material-ui/icons/PushPin';
import PushPinOutlinedIcon from '@material-ui/icons/PushPinOutlined' 
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation, hooks } from '../../config/queryClient';
import { FAVORITE_ITEM_BUTTON_CLASS } from '../../config/selectors';
import { getItemPinnedTag, isItemPinned } from '../../utils/itemTag';
import { getItemPinnedTagFromItem } from '../../utils/itemExtra'

const { useTags, useItemTags } = hooks;

const PinButton = ({ item, member }) => {
  const { t } = useTranslation();
  const { data: tags } = useTags();

  const addPinned = useMutation(MUTATION_KEYS.POST_ITEM_TAG);
  const deletePinned = useMutation(MUTATION_KEYS.DELETE_ITEM_TAG);
  const { data: itemTags } = useItemTags(item.id);
  const [isPinned, setPinned] = useState(false);
  const [ItemPinnedTagValueForItem, setItemPinnedTagValueForItem] = useState();

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const tagValue = getItemPinnedTagFromItem({ tags, itemTags });
      setItemPinnedTagValueForItem(tagValue);
      setPinned(isItemPinned({ tags, itemTags }));
    }
  }, [tags, itemTags, item]);

  console.log(member);

  const handlePin = () => {
    addPinned.mutate({
      id: item.id,
      // use item login tag id
      tagId: getItemPinnedTag(tags).id,
    }); 

    setPinned(isItemPinned({ tags, itemTags }));
  };

  const handleUnpin = () => {
    deletePinned.mutate({
      id: item.id,
      // use item login tag id
      tagId: ItemPinnedTagValueForItem.id,
    });

    setPinned(isItemPinned({ tags, itemTags }));
  };

  return (
    <Tooltip
      title={isPinned ? t('Unpin') : t('Pin')}
    >
      <IconButton
        aria-label="favorite"
        className={FAVORITE_ITEM_BUTTON_CLASS}
        onClick={isPinned ? handleUnpin : handlePin}
      >
        {isPinned ? (
          <PushPinIcon fontSize="small" />
        ) : (
          <PushPinOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

PinButton.propTypes = {
  item: PropTypes.shape({ id: PropTypes.string.isRequired, isPinned: PropTypes.bool }).isRequired,
  member: PropTypes.instanceOf(Map).isRequired,
};

export default PinButton;
