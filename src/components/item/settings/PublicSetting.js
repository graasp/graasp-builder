import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import { useParams } from 'react-router';
import InfoIcon from '@material-ui/icons/Info';
import { MUTATION_KEYS } from '@graasp/query-client';
import { FormControlLabel, IconButton, Tooltip } from '@material-ui/core';
import { useMutation, hooks } from '../../../config/queryClient';
import { getItemPublicTagFromItem } from '../../../utils/itemExtra';
import Loader from '../../common/Loader';
import { getItemPublicTag } from '../../../utils/itemTag';
import { PUBLIC_SETTING_SWITCH_ID } from '../../../config/selectors';

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
      id={PUBLIC_SETTING_SWITCH_ID}
      color="primary"
      disabled={isSwitchDisabled}
      checked={isItemPublic}
      onChange={handleSwitchChange}
      name={t('public setting')}
    />
  );

  const label = (
    <>
      {t('Item is public')}
      {/* display more information if switch is disabled */}
      {isSwitchDisabled && (
        <Tooltip
          title={t(
            'This item is public because its parent is public. To set this item as private, you need to set its parent as private.',
          )}
          placement="right"
        >
          <IconButton fontSize="small" aria-label="access information">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <>
      <FormControlLabel control={control} label={label} />
    </>
  );
};

PublicSwitch.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default PublicSwitch;
