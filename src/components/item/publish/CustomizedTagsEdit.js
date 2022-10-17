import { Record } from 'immutable';
import PropTypes from 'prop-types';

import { Chip, TextField, Typography } from '@mui/material';

import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { MUTATION_KEYS } from '@graasp/query-client';
import { BUILDER, COMMON, namespaces } from '@graasp/translations';
import { Loader, SaveButton } from '@graasp/ui';

import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  ITEM_TAGS_EDIT_INPUT_ID,
  ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID,
  buildCustomizedTagsSelector,
} from '../../../config/selectors';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const { EDIT_ITEM } = MUTATION_KEYS;

const CustomizedTagsEdit = ({ item }) => {
  const { t } = useBuilderTranslation();
  const { t: commonT } = useTranslation(namespaces.common);
  const { mutate: updateCustomizedTags } = useMutation(EDIT_ITEM);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  const settings = item?.settings;
  const itemName = item?.name;

  const [displayValues, setDisplayValues] = useState(null);

  useEffect(() => {
    if (settings) {
      setDisplayValues(settings.tags?.join(', ') || '');
    }
  }, [settings]);

  if (isMemberLoading) return <Loader />;

  const handleChange = (event) => {
    setDisplayValues(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const tagsList =
      displayValues
        ?.split(',')
        ?.map((entry) => entry.trim())
        ?.filter(Boolean) || [];
    updateCustomizedTags({
      id: itemId,
      name: itemName,
      settings: { tags: tagsList },
    });
  };

  return (
    <>
      <Typography variant="h6" mt={2}>
        {t(BUILDER.ITEM_TAGS_TITLE)}
      </Typography>
      <Typography variant="body1">
        {t(BUILDER.ITEM_TAGS_INFORMATION)}
      </Typography>
      <TextField
        variant="outlined"
        multiline
        maxRows={5}
        defaultValue={displayValues}
        onChange={handleChange}
        id={ITEM_TAGS_EDIT_INPUT_ID}
        sx={{ mt: 1, mb: 1 }}
      />
      <SaveButton
        onClick={handleSubmit}
        sx={{ marginTop: 1, marginLeft: 2 }}
        id={ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID}
        text={commonT(COMMON.SAVE_BUTTON)}
        hasChanges
      />
      {settings?.tags?.size && (
        <>
          <Typography variant="subtitle1">
            {t(BUILDER.ITEM_TAGS_PREVIEW_TITLE)}
          </Typography>
          {settings?.tags?.map((tag, index) => (
            <Chip
              key={tag}
              label={tag}
              id={buildCustomizedTagsSelector(index)}
            />
          ))}
        </>
      )}
    </>
  );
};

CustomizedTagsEdit.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default CustomizedTagsEdit;
