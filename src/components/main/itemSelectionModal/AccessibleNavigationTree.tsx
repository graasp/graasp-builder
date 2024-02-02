import { useState } from 'react';

import { Pagination, Stack } from '@mui/material';

import { ItemType, PermissionLevel } from '@graasp/sdk';

import { hooks } from '@/config/queryClient';

import RowMenu, { RowMenuProps } from './RowMenu';

interface AccessibleNavigationTreeProps {
  isDisabled?: RowMenuProps['isDisabled'];
  onClick: RowMenuProps['onClick'];
  onNavigate: RowMenuProps['onNavigate'];
  selectedId?: string;
}

const PAGE_SIZE = 10;

const AccessibleNavigationTree = ({
  isDisabled,
  onClick,
  onNavigate,
  selectedId,
}: AccessibleNavigationTreeProps): JSX.Element => {
  // todo: to change with real recent items (most used)
  const [page, setPage] = useState(1);
  // todo: show only items with admin rights
  const { data: accessibleItems } = hooks.useAccessibleItems(
    {
      permissions: [PermissionLevel.Write, PermissionLevel.Admin],
      types: [ItemType.FOLDER],
    },
    { page },
  );

  const nbPages = accessibleItems
    ? Math.ceil(accessibleItems.totalCount / PAGE_SIZE)
    : 0;

  return (
    <Stack
      height="100%"
      flex={1}
      direction="column"
      justifyContent="space-between"
    >
      <Stack>
        {accessibleItems?.data?.map((ele) => (
          <RowMenu
            key={ele.id}
            item={ele}
            onNavigate={onNavigate}
            selectedId={selectedId}
            onClick={onClick}
            isDisabled={isDisabled}
          />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="end">
        {nbPages > 1 && (
          <Pagination
            sx={{ justifyContent: 'end' }}
            size="small"
            count={nbPages}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default AccessibleNavigationTree;
