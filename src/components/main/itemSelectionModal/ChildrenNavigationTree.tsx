import { Alert, Box, Skeleton } from '@mui/material';

import { ItemType } from '@graasp/sdk';
import { NavigationElement, type RowMenuProps, RowMenus } from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  buildItemRowArrowId,
  buildNavigationModalItemId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

interface ChildrenNavigationTreeProps {
  isDisabled?: RowMenuProps['isDisabled'];
  selectedId?: string;
  selectedNavigationItem: NavigationElement;
  onClick: RowMenuProps['onClick'];
  onNavigate: RowMenuProps['onNavigate'];
}

const ChildrenNavigationTree = ({
  onClick,
  selectedId,
  selectedNavigationItem,
  onNavigate,
  isDisabled,
}: ChildrenNavigationTreeProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { data: children, isLoading } = hooks.useChildren(
    selectedNavigationItem.id,
    { types: [ItemType.FOLDER] },
  );

  if (children) {
    return (
      <>
        <RowMenus
          elements={children}
          onNavigate={onNavigate}
          selectedId={selectedId}
          onClick={onClick}
          isDisabled={isDisabled}
          buildRowMenuId={buildNavigationModalItemId}
          buildRowMenuArrowId={buildItemRowArrowId}
        />
        {!children?.length && (
          <Box sx={{ color: 'darkgrey', pt: 1 }}>
            {translateBuilder(BUILDER.EMPTY_FOLDER_CHILDREN_FOR_THIS_ITEM)}
          </Box>
        )}
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Skeleton height={50} />
      </>
    );
  }
  return <Alert severity="error">An unexpected error happened</Alert>;
};

export default ChildrenNavigationTree;
