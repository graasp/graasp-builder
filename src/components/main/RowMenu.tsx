import React, { Dispatch, SetStateAction, useState } from 'react';

import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, styled } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { buildHomeModalItemID, buildItemRowArrowId } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

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
const MoveMenuRow = ({
  ele,
  onNavigate,
  setSelectedId,
  selectedId,
  itemIds,
}: MenuRowProps): JSX.Element | null => {
  const [isHoverActive, setIsHoverActive] = useState(false);

  const { t: translateBuilder } = useBuilderTranslation();

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
      <Box display="flex" gap="4px">
        <FolderIcon />
        {ele.name}
      </Box>
      {(isHoverActive || selectedId === ele.id) && (
        <Box display="flex">
          <Button sx={{ padding: '0' }}>
            {translateBuilder(BUILDER.MOVE_BUTTON)}
          </Button>

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
