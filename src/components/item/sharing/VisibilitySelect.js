import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import MenuItem from '@material-ui/core/MenuItem';
import { Map } from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation, hooks } from '../../../config/queryClient';
import { SETTINGS } from '../../../config/constants';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
} from '../../../utils/itemTag';

const { DELETE_ITEM_TAG, POST_ITEM_TAG, PUT_ITEM_LOGIN } = MUTATION_KEYS;

const { useTags, useItemTags, useCurrentMember, useItemLogin } = hooks;

const useStyles = makeStyles({
  loginSchemaText: {
    fontWeight: 'bold',
  },
});

function VisibilitySelect({ item, edit }) {
  const { t } = useTranslation();
  const classes = useStyles();
  // user
  const { data: user, isLoading: isMemberLoading } = useCurrentMember();

  // current item
  const { itemId } = useParams();

  // mutations
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);
  const { mutate: putItemLoginSchema } = useMutation(PUT_ITEM_LOGIN);

  // item login tag and item extra value
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(itemId);
  const { data: itemLogin } = useItemLogin(itemId);
  const [itemTagValue, setItemTagValue] = useState(false);
  const [tagValue, setTagValue] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // update state variables depending on fetch values
  useEffect(() => {
    if (tags && itemTags) {
      const { tag, itemTag } = getVisibilityTagAndItemTag({ tags, itemTags });
      setItemTagValue(itemTag);
      setTagValue(tag);

      // disable setting if any visiblity is set on any ancestor items
      setIsDisabled(
        tagValue &&
          itemTag?.itemPath &&
          itemTag?.itemPath !== item?.get('path'),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, itemTags, item]);

  if (isTagsLoading || isItemTagsLoading || isMemberLoading) {
    return <Loader />;
  }

  const handleChange = (event) => {
    const newTag = event.target.value;

    // remove previous tag if not private
    if (itemTagValue) {
      deleteItemTag({ id: itemId, tagId: itemTagValue?.id });
    }
    // delete public tag if the new visibility is not public
    if (tagValue?.name === SETTINGS.ITEM_PUBLISHED.name) {
      if (newTag !== SETTINGS.ITEM_PUBLIC.name) {
        const publicTag = getTagByName(tags, SETTINGS.ITEM_PUBLIC.name);
        const publicItemTag = itemTags.find(({ id }) => id === publicTag.id);
        deleteItemTag({ id: itemId, tagId: publicItemTag?.id });
      }
      // avoid adding tag if goes from published to public
      else {
        return;
      }
    }

    // add new tag if not private
    if (newTag !== SETTINGS.ITEM_PRIVATE.name) {
      postItemTag({
        id: itemId,
        // use item login tag id
        tagId: getTagByName(tags, newTag)?.id,
        itemPath: item?.get('path'),
        creator: user?.get('id'),
      });
    }

    // set default login schema if the visibility is pseudonymized and has no login schema set
    if (
      newTag?.name === SETTINGS.ITEM_LOGIN.name &&
      !itemLogin?.get('loginSchema')
    ) {
      putItemLoginSchema({
        id: itemId,
        loginSchema: SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
      });
    }
  };

  const handleLoginSchemaChange = (event) => {
    const newLoginSchema = event.target.value;
    putItemLoginSchema({
      itemId,
      loginSchema: newLoginSchema,
    });
  };

  const renderLoginSchemaSelect = () => {
    if (tagValue?.name !== SETTINGS.ITEM_LOGIN.name) {
      return null;
    }

    // do not show select if the user cannot edit the item
    if (!edit) {
      return (
        <span className={classes.loginSchemaText}>
          {itemLogin?.get('loginSchema') ===
          SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME
            ? t('username')
            : t('username and password')}
        </span>
      );
    }

    return (
      <Select
        value={
          itemLogin?.get('loginSchema') || SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME
        }
        onChange={handleLoginSchemaChange}
        disabled={isDisabled}
      >
        <MenuItem value={SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME}>
          {t('Username')}
        </MenuItem>
        <MenuItem value={SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD}>
          {t('Username and Password')}
        </MenuItem>
      </Select>
    );
  };

  const renderVisiblityIndication = () => {
    switch (tagValue?.name) {
      case SETTINGS.ITEM_LOGIN.name:
        return (
          <>
            {'This item is accessible if the visitor provides a '}
            {renderLoginSchemaSelect()}
          </>
        );
      case SETTINGS.ITEM_PUBLIC.name:
        return 'This item is public. Anyone can access it.';
      case SETTINGS.ITEM_PUBLISHED.name:
        return 'This element is published. Anyone can access it and is available on Graasp Explore, our public repository of learning ressources.';
      case SETTINGS.ITEM_PRIVATE.name:
      default:
        return 'This item is private. Only authorized members can access it.';
    }
  };
  return (
    <>
      <Typography variant="h6">{t('Visibility')}</Typography>
      {edit && (
        <Select
          value={tagValue?.name || SETTINGS.ITEM_PRIVATE.name}
          onChange={handleChange}
          disabled={isDisabled}
        >
          <MenuItem value={SETTINGS.ITEM_PRIVATE.name}>{t('Private')}</MenuItem>
          <MenuItem value={SETTINGS.ITEM_LOGIN.name}>
            {t('Pseudonymized')}
          </MenuItem>
          <MenuItem value={SETTINGS.ITEM_PUBLIC.name}>{t('Public')}</MenuItem>
          <MenuItem value={SETTINGS.ITEM_PUBLISHED.name}>
            {t('Published')}
          </MenuItem>
        </Select>
      )}
      {renderVisiblityIndication()}
    </>
  );
}

VisibilitySelect.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default VisibilitySelect;
