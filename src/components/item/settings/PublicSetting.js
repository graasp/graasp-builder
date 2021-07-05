import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { FormControlLabel } from '@material-ui/core';
import { useMutation, hooks } from '../../../config/queryClient';
import { getItemPublicTagFromItem } from '../../../utils/itemExtra';
import Loader from '../../common/Loader';
import { getItemPublicTag } from '../../../utils/itemTag';

const { DELETE_ITEM_TAG, POST_ITEM_TAG } = MUTATION_KEYS;

const { useTags, useItemTags, useCurrentMember } = hooks;

const PublicSwitch = ({ item }) => {
  const { t } = useTranslation();

  // user
  const { data: user, isLoading: isMemberLoading } = useCurrentMember();

  // current item
  const { itemId } = useParams();

  // mutations
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);

  // item login tag and item extra value
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(itemId);
  const [isItemPublic, setIsItemPublic] = useState(false);
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);
  const [itemPublicTagForItem, setItemPublicTagForItem] = useState();

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const tagValue = getItemPublicTagFromItem({ tags, itemTags });
      setItemPublicTagForItem(tagValue);
      setIsItemPublic(Boolean(tagValue));
      // disable setting if it is set on a parent
      setIsSwitchDisabled(tagValue && tagValue?.itemPath !== item?.get('path'));
    }
  }, [tags, itemTags, item]);

  if (isTagsLoading || isItemTagsLoading || isMemberLoading) {
    return <Loader />;
  }

  const handleSwitchChange = () => {
    if (!isItemPublic) {
      postItemTag({
        id: itemId,
        // use item login tag id
        tagId: getItemPublicTag(tags)?.id,
        itemPath: item?.get('path'),
        creator: user?.get('id'),
      });
    } else {
      // use item tag id corresponding to item login
      deleteItemTag({ id: itemId, tagId: itemPublicTagForItem?.id });
    }
  };

  const control = (
    <Switch
      color="primary"
      disabled={isSwitchDisabled}
      checked={isItemPublic}
      onChange={handleSwitchChange}
      name={t('public setting')}
    />
  );

  return <FormControlLabel control={control} label={t('Item is public')} />;
};

PublicSwitch.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default PublicSwitch;
