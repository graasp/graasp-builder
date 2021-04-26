import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { useParams } from 'react-router';
import { useMutation } from 'react-query';
import { FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import {
  useTags,
  useItem,
  useItemTags,
  useCurrentMember,
} from '../../../hooks';
import {
  SETTINGS,
  SETTINGS_ITEM_LOGIN_DEFAULT,
} from '../../../config/constants';
import {
  getItemLoginSchema,
  getItemLoginTagFromItem,
} from '../../../utils/itemExtra';
import {
  buildItemLoginSettingModeSelectOption,
  ITEM_LOGIN_SETTING_MODE_SELECT_ID,
  ITEM_LOGIN_SETTING_SWITCH_ID,
} from '../../../config/selectors';
import {
  DELETE_ITEM_TAG_MUTATION_KEY,
  POST_ITEM_TAG_MUTATION_KEY,
  PUT_ITEM_LOGIN_MUTATION_KEY,
} from '../../../config/keys';
import Loader from '../../common/Loader';
import { getItemLoginTag } from '../../../utils/itemTag';

const ItemLoginSwitch = () => {
  const { t } = useTranslation();

  // user
  const { data: user, isLoading: isMemberLoading } = useCurrentMember();

  // current item
  const { itemId } = useParams();
  const { data: item, isLoading: isItemLoading } = useItem(itemId);

  // mutations
  const { mutate: putItemLoginSchema } = useMutation(
    PUT_ITEM_LOGIN_MUTATION_KEY,
  );
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG_MUTATION_KEY);
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG_MUTATION_KEY);

  // item login tag and item extra value
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(itemId);
  const [isItemLoginEnabled, setIsItemLoginEnabled] = useState(false);
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);
  const [schema, setSchema] = useState(SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME);
  const [ItemLoginTagValueForItem, setItemLoginTagValueForItem] = useState();

  // update state variables depending on fetch values
  useEffect(() => {
    const tagValue = getItemLoginTagFromItem({ tags, itemTags });
    setItemLoginTagValueForItem(tagValue);
    setIsItemLoginEnabled(Boolean(tagValue));
    // disable setting if it is set on a parent
    setIsSwitchDisabled(tagValue && tagValue?.itemPath !== item?.get('path'));
    setSchema(
      getItemLoginSchema(item?.get('extra')) ||
        SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
    );
  }, [tags, itemTags, item]);

  if (isItemLoading || isTagsLoading || isItemTagsLoading || isMemberLoading) {
    return <Loader />;
  }

  const updateItemLoginSchema = (loginSchema) => {
    putItemLoginSchema({ itemId, loginSchema });
    setSchema(loginSchema);
  };

  const handleSwitchChange = () => {
    if (!isItemLoginEnabled) {
      postItemTag({
        id: itemId,
        // use item login tag id
        tagId: getItemLoginTag(tags)?.id,
        itemPath: item?.get('path'),
        creator: user?.get('id'),
      });
      updateItemLoginSchema(SETTINGS_ITEM_LOGIN_DEFAULT);
    } else {
      // use item tag id corresponding to item login
      deleteItemTag({ id: itemId, tagId: ItemLoginTagValueForItem?.id });
      updateItemLoginSchema();
    }
  };

  const handleOptionOnChange = (e) => {
    const { value } = e.target;
    updateItemLoginSchema(value);
  };

  const renderSelect = () => (
    <Select
      fullWidth
      value={schema}
      onChange={handleOptionOnChange}
      id={ITEM_LOGIN_SETTING_MODE_SELECT_ID}
    >
      {Object.values(SETTINGS.ITEM_LOGIN.OPTIONS).map((value) => (
        <MenuItem
          value={value}
          id={buildItemLoginSettingModeSelectOption(value)}
        >
          {value}
        </MenuItem>
      ))}
    </Select>
  );

  const control = (
    <Switch
      id={ITEM_LOGIN_SETTING_SWITCH_ID}
      color="primary"
      disabled={isSwitchDisabled}
      checked={isItemLoginEnabled}
      onChange={handleSwitchChange}
      name={t('Allow Item Login')}
    />
  );

  return (
    <>
      <FormControlLabel control={control} label={t('Allow Item Login')} />
      {!isSwitchDisabled && isItemLoginEnabled && renderSelect()}
    </>
  );
};

export default ItemLoginSwitch;
