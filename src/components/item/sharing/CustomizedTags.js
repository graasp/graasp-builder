import React, { useContext, useState, useEffect } from 'react';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import { Typography, TextField, Button, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { CurrentUserContext } from '../../context/CurrentUserContext';

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

function CustomizedTagsEdit(item, edit) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: updateCustomizedTags } = useMutation(EDIT_ITEM);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  const { item: itemObj } = item;
  const settings = itemObj.get('settings');
  const itemName = itemObj.get('name');

  const [displayValues, setDisplayValues] = useState(false);

  useEffect(() => {
    if (settings) {
      setDisplayValues(settings.tags || []);
    }
  }, [settings, item]);

  if (isMemberLoading) return <Loader />;

  const handleChange = (event) => {
    setDisplayValues(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const tagsList = displayValues?.split(',') || [];
    console.log(displayValues);
    updateCustomizedTags({
      id: itemId,
      name: itemName,
      settings: { tags: tagsList },
    });
  };

  return (
    <>
      <Typography variant="h6" className={classes.title}>
        {t('Customized Tags')}
      </Typography>
      <Typography variant="body1">
        {t('Please seperate tags by comma. ')}
        {t('Eg. Tag1,Tag2,Tag3,...,TagN')}
      </Typography>
      <form className={classes.container} onSubmit={handleSubmit}>
        <TextField
          disabled={!edit}
          id="customized-tags-input-box"
          variant="outlined"
          label="Input"
          multiline
          maxRows={5}
          defaultValue={displayValues}
          onChange={handleChange}
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon />}
        >
          {t('Submit')}
        </Button>
      </form>
    </>
  );
}

export default CustomizedTagsEdit;
