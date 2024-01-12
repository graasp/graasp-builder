import React, { Dispatch, SetStateAction, useState } from 'react';

import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, Typography, styled } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import {
  HOME_MODAL_ITEM_ID,
  buildHomeModalItemID,
  buildItemRowArrowId,
} from '@/config/selectors';

interface MenuRowProps {
  ele: DiscriminatedItem;
  onNavigate: () => void;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  itemIds: string[];
}

const StyledButton = styled(Button)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => ({
    display: 'flex',
    color: theme.palette.text.primary,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    background: isSelected ? theme.palette.grey[200] : 'none',
    textTransform: 'none',
  }),
);

const isTreeItemDisabled = ({
  itemPath,
  itemIds,
}: {
  itemPath: string;
  itemIds: string[];
}) => {
  const itemPaths = itemIds.map((ele) => ele.replaceAll('-', '_'));

  return itemPaths.some((path) => itemPath.includes(path));
};
const MoveMenuRow = ({
  ele,
  onNavigate,
  setSelectedId,
  selectedId,
  itemIds,
}: MenuRowProps): JSX.Element | null => {
  const [isHoverActive, setIsHoverActive] = useState(false);

  const handleHover = () => {
    setIsHoverActive(true);
  };
  const handleUnhover = () => {
    setIsHoverActive(false);
  };

  if (ele.type !== ItemType.FOLDER) {
    return null;
  }
  return (
    <StyledButton
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      onClick={() => {
        setSelectedId(ele?.id);
      }}
      id={buildHomeModalItemID(ele.id)}
      isSelected={selectedId === ele.id}
      disabled={isTreeItemDisabled({
        itemPath: ele.path,
        itemIds,
      })}
    >
      <Box display="flex" gap="4px" alignItems="center">
        {ele.id === HOME_MODAL_ITEM_ID ? <HomeIcon /> : <FolderIcon />}
        <Typography
          sx={{
            maxWidth: { sm: '250px', md: '300px', lg: '400px' },
            overflowWrap: 'break-word',
            textAlign: 'start',
            fontWeight: 450,
          }}
          variant="body2"
        >
          {ele.name}
        </Typography>
      </Box>
      {(isHoverActive || selectedId === ele.id) && (
        <Box display="flex">
          <IconButton
            sx={{ padding: '0' }}
            onClick={onNavigate}
            id={buildItemRowArrowId(ele.id)}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}
    </StyledButton>
  );
};

export default MoveMenuRow;
