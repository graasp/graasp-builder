import React from 'react';
import { Typography, Container, makeStyles } from '@material-ui/core';
import { GraaspLogo } from '@graasp/ui';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { REDIRECTION_CONTENT_ID } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  logo: {
    fill: theme.palette.primary.main,
  },
  link: {
    textDecoration: 'none',
    fontStyle: 'italic',
    color: 'black',
  },
}));

const RedirectionContent = ({ link }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Container id={REDIRECTION_CONTENT_ID} className={classes.container}>
      <GraaspLogo height={100} className={classes.logo} />
      <div className={classes.text}>
        <Typography variant="h4" align="center">
          {t('You are being redirected…')}
        </Typography>
        <Link to={link} className={classes.link}>
          <Typography id={REDIRECTION_CONTENT_ID} align="center">
            {t('Click here if you are not automatically redirected')}
          </Typography>
        </Link>
      </div>
    </Container>
  );
};

RedirectionContent.propTypes = {
  link: PropTypes.string.isRequired,
};

export default RedirectionContent;
