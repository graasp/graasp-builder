/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useLocation, useHistory } from 'react-router';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactTooltip from 'react-tooltip';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import {
  buildGraaspGroupViewSelector,
  combinedSelectors,
  HOME_PATH,
} from '../../config/paths';
import groupMenuStyle from './groupMenuStyle';

const useStyles = makeStyles(() => ({
  avatar: {
    background: 'grey',
  },
  toolTip: {
    zIndex: 1000,
  },
}));

const useGroupStyle = makeStyles(() => ({ ...groupMenuStyle() }));
const MainGroupMenu = ({ groups }) => {
  const classes = useStyles();
  const { push } = useHistory();
  const { pathname } = useLocation();
  const groupClasses = useGroupStyle();

  const goTo = (path) => {
    push(path);
  };

  return (
    <Box minWidth="100%">
      <ListItem
        button
        classes={groupClasses}
        onClick={() => goTo(HOME_PATH)}
        selected={pathname.indexOf('group') !== 1}
      >
        <ListItemIcon data-tip data-for="registerTip">
          <Avatar
            imgProps={{
              style: {
                width: 'auto',
                height: '80%',
              },
            }}
            variant="circular"
            className={classes.avatar}
            src="https://d15r9r12e2oqn3.cloudfront.net/logo/main_logo_landing_page.svg"
          />
        </ListItemIcon>
      </ListItem>

      <ReactTooltip
        className={classes.toolTip}
        id="registerTip"
        place="right"
        effect="solid"
      >
        Your Own Place
      </ReactTooltip>

      {groups.map((group) => (
        <>
          <ListItem
            button
            classes={groupClasses}
            onClick={() =>
              goTo(
                combinedSelectors(
                  buildGraaspGroupViewSelector(group.id),
                  HOME_PATH,
                ),
              )
            }
            selected={pathname.startsWith(
              buildGraaspGroupViewSelector(group.id),
            )}
          >
            <ListItemIcon data-tip data-for={group.name}>
              <Avatar />
            </ListItemIcon>
          </ListItem>

          <ReactTooltip
            className={classes.toolTip}
            id={group.name}
            place="right"
            effect="solid"
          >
            {group.name}
          </ReactTooltip>
        </>
      ))}
      <ListItem button>
        <ListItemIcon data-tip data-for="registerTip">
          <Avatar>
            <AddIcon />
          </Avatar>
        </ListItemIcon>
      </ListItem>
    </Box>
  );
};

MainGroupMenu.propTypes = {
  groups: PropTypes.arrayOf(List()),
};

MainGroupMenu.defaultProps = {
  groups: List(),
};

export default MainGroupMenu;
