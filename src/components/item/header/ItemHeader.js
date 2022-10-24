import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useMatch } from 'react-router';

import { Loader } from '@graasp/ui';

import { buildItemPath } from '../../../config/paths';
import { hooks } from '../../../config/queryClient';
import { ITEM_HEADER_ID } from '../../../config/selectors';
import Navigation from '../../layout/Navigation';
import ItemHeaderActions from './ItemHeaderActions';

const { useItem } = hooks;

const ItemHeader = ({ onClickMetadata, onClickChatbox, showNavigation }) => {
  const match = useMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { data: item, isLoading: isItemLoading } = useItem(itemId);

  if (isItemLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      mb={1}
      id={ITEM_HEADER_ID}
    >
      {/* display empty div to render actions on the right */}
      {showNavigation ? <Navigation /> : <div />}
      <ItemHeaderActions
        item={item}
        onClickChatbox={onClickChatbox}
        onClickMetadata={onClickMetadata}
      />
    </Box>
  );
};

ItemHeader.propTypes = {
  onClickMetadata: PropTypes.func,
  onClickChatbox: PropTypes.func,
  showNavigation: PropTypes.bool,
};

ItemHeader.defaultProps = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClickMetadata: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClickChatbox: () => {},
  showNavigation: true,
};

export default ItemHeader;
