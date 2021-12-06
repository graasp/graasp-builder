import React, { useContext, useState, useEffect } from 'react';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import { Typography, TextField, Button, makeStyles } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router';
import { MUTATION_KEYS } from '@graasp/query-client';
import { hooks, useMutation } from '../../../config/queryClient';
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

const { useCustomizedTags } = hooks;

const { POST_CUSTOMIZED_TAGS } = MUTATION_KEYS;

function CustomizedTagsEdit(item, edit) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { mutate: updateCustomizedTags } = useMutation(POST_CUSTOMIZED_TAGS);

  // user
  const { isLoading: isMemberLoading } = useContext(CurrentUserContext);

  // current item
  const { itemId } = useParams();

  // get tags for item
  const {
    data: customizedTags,
    isLoading: isCustomizedTagsLoading,
  } = useCustomizedTags(itemId);

  const [displayValues, setDisplayValues] = useState(false);

  useEffect(() => {
    if (customizedTags) {
      setDisplayValues(customizedTags.toArray());
    }
  }, [customizedTags, item]);

  if (isMemberLoading || isCustomizedTagsLoading) return <Loader />;

  const handleChange = (event) => {
    setDisplayValues(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const tagsList = displayValues?.split(',') || [];
    updateCustomizedTags({
      itemId,
      values: tagsList,
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
