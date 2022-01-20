import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  TextField,
  Button,
  Chip,
  makeStyles,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { buildCustomizedTagsSelector, ITEM_TAGS_EDIT_INPUT_ID, ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID } from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
}));

const { EDIT_ITEM } = MUTATION_KEYS;

const CustomizedTagsEdit = ({ item, edit }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: updateCustomizedTags } = useMutation(EDIT_ITEM);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  const settings = item?.get('settings');
  const itemName = item?.get('name');

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
      displayValues?.split(',').map((entry) => entry.trim()) || [];
    updateCustomizedTags({
      id: itemId,
      name: itemName,
      settings: { tags: tagsList },
    });
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        {t('Tags')}
      </Typography>
      <Typography variant="body1">
        {t('Please seperate tags by comma. ')}
        {t('Eg. English, Biology, Lab, Plants, ..., Demo')}
      </Typography>
      <form className={classes.container} onSubmit={handleSubmit}>
        <TextField
          disabled={!edit}
          variant="outlined"
          label={t('Tags')}
          multiline
          maxRows={5}
          defaultValue={displayValues}
          onChange={handleChange}
          id={ITEM_TAGS_EDIT_INPUT_ID}
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          className={classes.button}
          endIcon={<SaveIcon />}
          disabled={!edit}
          id={ITEM_TAGS_EDIT_SUBMIT_BUTTON_ID}
        >
          {t('Save')}
        </Button>
      </form>
      <Typography variant="subtitle1">{t('Tags Preview')}</Typography>
      {settings?.tags?.map((tag, index) => (
        <Chip label={tag} id={buildCustomizedTagsSelector(index)} />
      ))}
    </>
  );
};

CustomizedTagsEdit.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
  edit: PropTypes.bool.isRequired,
};

export default CustomizedTagsEdit;
