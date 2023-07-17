import {
  AutoStories,
  Delete,
  Folder,
  FolderShared,
  Star,
} from '@mui/icons-material';
import { Typography } from '@mui/material';

import { Step } from 'react-joyride';

import { BuildIcon } from '@graasp/ui';

import {
  TOUR_NAVIGATION_SIDEBAR_CLOSE_BUTTON_ID,
  TOUR_NAVIGATION_SIDEBAR_ID,
  TOUR_TUTORIALS_LINK_ID,
} from '../../config/selectors';

const iconInTextStyle = {
  width: 20,
  height: 20,
  marginBottom: '-4px',
};

// eslint-disable-next-line import/prefer-default-export
export const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    content: 'Welcome',
    locale: { skip: 'Skip' },
  },
  {
    content: (
      <Typography>
        This is the <BuildIcon sx={iconInTextStyle} /> Builder, it allows you to{' '}
        <strong>create</strong> content and <strong>build</strong> interactive
        capsules.
      </Typography>
    ),
    target: 'body',
  },
  {
    content: (
      <Typography align="left">
        This is the navigation bar, you can use it to go to:
        <ul>
          <li>
            <Folder sx={iconInTextStyle} /> <strong>My Graasp</strong>: Your own
            items
          </li>
          <li>
            <FolderShared sx={iconInTextStyle} /> <strong>Shared Items</strong>:
            Items shared with you
          </li>
          <li>
            <Star sx={iconInTextStyle} /> <strong>Favorite Items</strong>: Your
            favorite items
          </li>
          <li>
            <Delete sx={iconInTextStyle} /> <strong>Trash</strong>: Items you
            deleted
          </li>
        </ul>
      </Typography>
    ),
    target: `#${TOUR_NAVIGATION_SIDEBAR_ID}`,
  },
  {
    content: (
      <Typography>
        If you need help, here are some <AutoStories sx={iconInTextStyle} />{' '}
        Tutorials to get you started !
      </Typography>
    ),
    target: `#${TOUR_TUTORIALS_LINK_ID}`,
  },
  {
    content:
      'With this button, you can close the side bar to free some screen space.',
    target: `#${TOUR_NAVIGATION_SIDEBAR_CLOSE_BUTTON_ID}`,
  },
];
