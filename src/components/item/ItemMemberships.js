import PropTypes from 'prop-types';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { hooks } from '../../config/queryClient';
import { ITEM_MEMBERSHIPS_CONTENT_ID } from '../../config/selectors';
import { PERMISSION_LEVELS } from '../../enums';
import { membershipsWithoutUser } from '../../utils/membership';
import MemberAvatar from '../common/MemberAvatar';
import { CurrentUserContext } from '../context/CurrentUserContext';

const ItemMemberships = ({ id, maxAvatar, onClick }) => {
  const { t } = useTranslation();
  const { data: memberships, isError } = hooks.useItemMemberships(id);
  const { data: currentUser } = useContext(CurrentUserContext);

  if (!id) {
    return null;
  }

  if (!memberships || memberships.isEmpty() || isError) {
    return null;
  }

  const filteredMemberships = membershipsWithoutUser(
    memberships,
    currentUser?.id,
  );

  // display only if has more than 2 memberships
  if (!filteredMemberships?.size) {
    return null;
  }

  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      id={ITEM_MEMBERSHIPS_CONTENT_ID}
    >
      <Grid item>
        <Tooltip
          title={t('sharedWithMembers', {
            count: filteredMemberships.length,
          })}
          aria-label="shared users"
        >
          <AvatarGroup max={maxAvatar} spacing={3} onClick={onClick}>
            {filteredMemberships.map(({ memberId, permission }) => {
              const badgeContent =
                permission === PERMISSION_LEVELS.READ ? (
                  <VisibilityIcon fontSize="small" />
                ) : (
                  <EditIcon fontSize="small" />
                );

              return (
                <Badge
                  key={memberId}
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={badgeContent}
                  sx={{ border: 'none' }}
                >
                  <MemberAvatar id={memberId} />
                </Badge>
              );
            })}
          </AvatarGroup>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

ItemMemberships.propTypes = {
  maxAvatar: PropTypes.number,
  id: PropTypes.string,
  onClick: PropTypes.func,
};

ItemMemberships.defaultProps = {
  maxAvatar: 2,
  id: null,
  onClick: null,
};

export default ItemMemberships;
