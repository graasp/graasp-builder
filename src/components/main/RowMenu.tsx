import React, { Dispatch, SetStateAction, useState } from 'react';

import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton } from '@mui/material';

import { DiscriminatedItem, FolderItemExtra } from '@graasp/sdk';

import {
  TREE_MODAL_MY_ITEMS_ID,
  buildItemRowArrowId,
} from '@/config/selectors';

interface MenuRowProps {
  ele: DiscriminatedItem;
  fetchSubItems: () => void;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  itemIds: string[];
  title: string;
  selfAndChildrenDisable?: boolean;
}

const isTreeItemDisabled = ({
  itemPath,
  itemIds,
}: {
  itemPath: string;
  itemIds: string[];
}) => {
  if (itemPath && itemIds.length) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < itemIds.length; i++) {
      const pathsSerious = itemPath
        ?.split('.')
        .map((ele) => ele.replaceAll('_', '-'));

      const isItemChild = pathsSerious.indexOf(itemIds[i]);
      if (isItemChild > -1) {
        return isItemChild > -1;
      }
    }
  }
  return false;
};
const MoveMenuRow = ({
  ele,
  fetchSubItems,
  setSelectedId,
  selectedId,
  itemIds,
  title,
  selfAndChildrenDisable = false,
}: MenuRowProps): JSX.Element => {
  const [isHoverActive, setIsHoverActive] = useState(false);

  const handleHover = () => {
    setIsHoverActive(true);
  };
  const handleUnhover = () => {
    setIsHoverActive(false);
  };

  return (
    <Button
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      onClick={() => {
        setSelectedId(ele?.id);
      }}
      id={`${TREE_MODAL_MY_ITEMS_ID}-${ele.id}`}
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
    >
      <Box display="flex" gap="4px">
        <FolderIcon />
        {ele.name}
      </Box>
      {(isHoverActive || selectedId === ele.id) && (
        <Box display="flex">
          <Button sx={{ padding: '0' }}>{title}</Button>
          {Boolean(
            (ele.extra as FolderItemExtra).folder.childrenOrder.length,
          ) && (
            <IconButton
              sx={{ padding: '0' }}
              onClick={(e) => {
                e.stopPropagation();
                fetchSubItems();
                setSelectedId('');
              }}
              id={buildItemRowArrowId(ele.id)}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Button>
  );
};

export default MoveMenuRow;
