import React, { Dispatch, SetStateAction, useState } from 'react';

import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, styled } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { buildHomeModalItemID, buildItemRowArrowId } from '@/config/selectors';

interface MenuRowProps {
  ele: DiscriminatedItem;
  onNavigate: () => void;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  itemIds: string[];
  selfAndChildrenDisable?: boolean;
}

const StyledButton = styled(Button)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => ({
    display: 'flex',
    color: theme.palette.text.primary,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    background: isSelected ? theme.palette.grey[200] : 'none',
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

  return itemPaths.some((path) => path.includes(itemPath));
};
const TreeMenuRow = ({
  ele,
  onNavigate,
  setSelectedId,
  selectedId,
  itemIds,
  selfAndChildrenDisable = false,
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
      sx={{
        display: 'flex',
        color: 'black',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '12px',
        background: selectedId === ele.id ? 'rgba(80, 80, 210, 0.08)' : 'none',
      }}
      disabled={
        selfAndChildrenDisable &&
        isTreeItemDisabled({
          itemPath: ele.path,
          itemIds,
        })
      }
      id={buildHomeModalItemID(ele.id)}
      isSelected={selectedId === ele.id}
    >
      <Box
        display="flex"
        gap="4px"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '180px',
          whiteSpace: 'nowrap',
        }}
      >
        <FolderIcon />
        {ele.name}
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

export default TreeMenuRow;
