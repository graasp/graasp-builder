import { Record } from 'immutable';
import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { SETTINGS } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, useMutation } from '../../../config/queryClient';
import {
  SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID,
  SHARE_ITEM_VISIBILITY_SELECT_ID,
} from '../../../config/selectors';
import { getItemLoginSchema } from '../../../utils/itemExtra';
import {
  getTagByName,
  getVisibilityTagAndItemTag,
} from '../../../utils/itemTag';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const { DELETE_ITEM_TAG, POST_ITEM_TAG, PUT_ITEM_LOGIN } = MUTATION_KEYS;

const { useTags, useItemTags, useItemLogin } = hooks;

const VisibilitySelect = ({ item, edit }) => {
  const { t } = useBuilderTranslation();
  // user
  const { data: user, isLoading: isMemberLoading } =
    useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  // mutations
  const { mutate: deleteItemTag } = useMutation(DELETE_ITEM_TAG);
  const { mutate: postItemTag } = useMutation(POST_ITEM_TAG);
  const { mutate: putItemLoginSchema } = useMutation(PUT_ITEM_LOGIN);

  // item login tag and item extra value
  const { data: tags, isLoading: isTagsLoading } = useTags();
  const {
    data: itemTags,
    isLoading: isItemTagsLoading,
    isError,
  } = useItemTags(itemId);
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
        tag && itemTag?.itemPath && itemTag?.itemPath !== item?.path,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, itemTags, item]);

  if (isTagsLoading || isItemTagsLoading || isMemberLoading) {
    return <Loader />;
  }

  // hide visibility select if cannot access item tags
  // this happens when accessing a public item
  if (isError) {
    return null;
  }

  const handleChange = (event) => {
    const newTag = event.target.value;
    const prevTagName = tagValue?.name;
    const publicTag = getTagByName(tags, SETTINGS.ITEM_PUBLIC.name);

    // deletes both public and published tags if they exists
    const deletePublishedAndPublicTags = () => {
      const publicItemTag = itemTags.find(
        ({ tagId }) => tagId === publicTag.id,
      );
      const publishedTag = getTagByName(tags, SETTINGS.ITEM_PUBLISHED.name);
      const publishedItemTag = itemTags.find(
        ({ tagId }) => tagId === publishedTag.id,
      );
      if (publishedItemTag) {
        deleteItemTag({ id: itemId, tagId: publishedItemTag.id });
      }
      if (publicItemTag) {
        deleteItemTag({ id: itemId, tagId: publicItemTag.id });
      }
    };

    // post new visibility tag
    const newTagId = getTagByName(tags, newTag)?.id;
    const postNewTag = () =>
      postItemTag({
        id: itemId,
        tagId: newTagId,
        itemPath: item?.path,
        creator: user?.id,
      });

    // delete previous visibility tag
    // it deletes the less restrictive visibility
    const deletePreviousTag = () => {
      if (prevTagName && prevTagName !== SETTINGS.ITEM_PRIVATE.name) {
        deleteItemTag({ id: itemId, tagId: itemTagValue?.id });
      }
    };

    switch (newTag) {
      case SETTINGS.ITEM_PRIVATE.name: {
        deletePreviousTag();
        deletePublishedAndPublicTags();
        break;
      }
      case SETTINGS.ITEM_LOGIN.name: {
        deletePublishedAndPublicTags();
        postNewTag();
        // post login schema if it does not exist
        if (!getItemLoginSchema(item?.extra)) {
          putItemLoginSchema({
            itemId,
            loginSchema: SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME,
          });
        }
        break;
      }
      case SETTINGS.ITEM_PUBLIC.name: {
        postNewTag();
        deletePreviousTag();
        break;
      }
      default:
        break;
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
        <span style={{ fontWeight: 'bold' }}>
          {itemLogin?.loginSchema === SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME
            ? t(
                BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_LABEL,
              )
            : t(
                BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_AND_PASSWORD_LABEL,
              )}
        </span>
      );
    }

    return (
      <Select
        value={itemLogin?.loginSchema || SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME}
        onChange={handleLoginSchemaChange}
        disabled={isDisabled}
        id={SHARE_ITEM_PSEUDONYMIZED_SCHEMA_ID}
      >
        <MenuItem value={SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME}>
          {t(
            BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_LABEL,
          )}
        </MenuItem>
        <MenuItem value={SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME_AND_PASSWORD}>
          {t(
            BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_PSEUDONYM_AND_PASSWORD_LABEL,
          )}
        </MenuItem>
      </Select>
    );
  };

  const renderVisiblityIndication = () => {
    switch (tagValue?.name) {
      case SETTINGS.ITEM_LOGIN.name:
        return (
          <>
            {t(
              BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_SCHEMA_SELECT_MESSSAGE,
            )}
            {renderLoginSchemaSelect()}
          </>
        );
      case SETTINGS.ITEM_PUBLIC.name:
        return t(BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_INFORMATIONS);
      case SETTINGS.ITEM_PRIVATE.name:
      default:
        return t(BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_INFORMATION);
    }
  };

  return (
    <>
      <Typography variant="h6">
        {t(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
      </Typography>
      {edit && (
        <Select
          value={tagValue?.name || SETTINGS.ITEM_PRIVATE.name}
          onChange={handleChange}
          disabled={isDisabled}
          id={SHARE_ITEM_VISIBILITY_SELECT_ID}
          sx={{ mr: 1 }}
        >
          <MenuItem value={SETTINGS.ITEM_PRIVATE.name}>
            {t(BUILDER.ITEM_SETTINGS_VISIBILITY_PRIVATE_LABEL)}
          </MenuItem>
          <MenuItem value={SETTINGS.ITEM_LOGIN.name}>
            {t(BUILDER.ITEM_SETTINGS_VISIBILITY_PSEUDONYMIZED_LABEL)}
          </MenuItem>
          <MenuItem value={SETTINGS.ITEM_PUBLIC.name}>
            {t(BUILDER.ITEM_SETTINGS_VISIBILITY_PUBLIC_LABEL)}
          </MenuItem>
        </Select>
      )}
      {renderVisiblityIndication()}
      {isDisabled && (
        <Typography variant="body2">
          {t(BUILDER.ITEM_SETTINGS_VISIBILITY_CANNOT_EDIT_PARENT_MESSAGE)}
        </Typography>
      )}
    </>
  );
};

VisibilitySelect.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default VisibilitySelect;
