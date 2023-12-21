import React, { Dispatch, SetStateAction, useState } from 'react';

import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton } from '@mui/material';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { HOME_MODAL_ITEM_ID, buildItemRowArrowId } from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

interface MenuRowProps {
  ele: DiscriminatedItem;
  fetchSubItems: () => void;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  itemIds: string[];
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
    <Button
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      onClick={() => {
        setSelectedId(ele?.id);
      }}
      id={`${HOME_MODAL_ITEM_ID}-${ele.id}`}
      sx={{
        display: 'flex',
        color: 'black',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '12px',
        background: selectedId === ele.id ? 'rgba(80, 80, 210, 0.08)' : 'none',
      }}
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
          {true && (
            <IconButton
              sx={{ padding: '0' }}
              onClick={(e) => {
                e.stopPropagation();
                fetchSubItems();
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
