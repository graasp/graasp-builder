import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { useMutation, hooks } from '../../../config/queryClient';
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
import Loader from '../../common/Loader';
import { getItemLoginTag } from '../../../utils/itemTag';

const { DELETE_ITEM_TAG, POST_ITEM_TAG, PUT_ITEM_LOGIN } = MUTATION_KEYS;

const { useTags, useItemTags, useCurrentMember } = hooks;

const ItemLoginSwitch = ({ item }) => {
  const { t } = useTranslation();

  // user
  const { data: user, isLoading: isMemberLoading } = useCurrentMember();

  // current item
  const { itemId } = useParams();

  // mutations
  const { mutate: putItemLoginSchema } = useMutation(PUT_ITEM_LOGIN);
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);

  // item login tag and item extra value
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(itemId);
  const [isItemLoginEnabled, setIsItemLoginEnabled] = useState(false);
  const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);
  const [schema, setSchema] = useState(SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME);
  const [ItemLoginTagValueForItem, setItemLoginTagValueForItem] = useState();

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const tagValue = getItemLoginTagFromItem({ tags, itemTags });
      setItemLoginTagValueForItem(tagValue);
      setIsItemLoginEnabled(Boolean(tagValue));
      // disable setting if it is set on a parent
      setIsSwitchDisabled(tagValue && tagValue?.itemPath !== item?.get('path'));
      setSchema(
        getItemLoginSchema(item?.get('extra')) ||
          SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
      );
    }
  }, [tags, itemTags, item]);

  if (isTagsLoading || isItemTagsLoading || isMemberLoading) {
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
          key={value}
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

ItemLoginSwitch.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};

export default ItemLoginSwitch;
