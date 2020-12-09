import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { buildItemPath } from '../../config/paths';
import ItemMenu from './ItemMenu';
import { buildItemLink } from '../../config/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  header: {
    display: 'flex',
  },
  avatar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  subtitle: {
    fontSize: '0.72rem',
  },
}));

const CustomCardHeader = ({ id, creator, title, type }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Avatar src={creator.avatar} className={classes.avatar} />
        <div>
          <Link to={buildItemPath(id)} className={classes.link}>
            <Typography id={buildItemLink(id)} className={classes.title}>
              {title}
            </Typography>
          </Link>
          <Typography className={classes.subtitle}>
            {t('Type by author', {
              type,
              author: creator.name || t('Unknown'),
            })}
          </Typography>
        </div>
      </div>
      <ItemMenu itemId={id} />
    </div>
  );
};

CustomCardHeader.propTypes = {
  id: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default CustomCardHeader;
