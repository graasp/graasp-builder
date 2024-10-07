import { Alert, Skeleton, Typography } from '@mui/material';

import { DiscriminatedItem, ItemType, PermissionLevel } from '@graasp/sdk';
import {
  type NavigationElement,
  RowMenu,
  type RowMenuProps,
  RowMenus,
} from '@graasp/ui';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import {
  buildItemRowArrowId,
  buildNavigationModalItemId,
} from '@/config/selectors';
import { BUILDER } from '@/langs/constants';

interface RootNavigationTreeProps {
  isDisabled?: RowMenuProps['isDisabled'];
  items: DiscriminatedItem[];
  onClick: RowMenuProps['onClick'];
  onNavigate: RowMenuProps['onNavigate'];
  rootMenuItems: NavigationElement[];
  selectedId?: string;
}

const RootNavigationTree = ({
  isDisabled,
  items,
  onClick,
  onNavigate,
  rootMenuItems,
  selectedId,
}: RootNavigationTreeProps): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();

  // TODO: to change with real recent items (most used)
  const {
    data: recentItems,
    isLoading,
    isSuccess,
  } = hooks.useAccessibleItems(
    // you can move into an item you have at least write permission
    {
      permissions: [PermissionLevel.Admin, PermissionLevel.Write],
      types: [ItemType.FOLDER],
    },
    { pageSize: 5 },
  );

  const { data: parents } = hooks.useParents({
    id: items[0]?.id,
    enabled: Boolean(items[0]),
  });

  if (isSuccess) {
    return (
      <>
        <Typography color="darkgrey" variant="subtitle2">
          {translateBuilder(BUILDER.HOME_TITLE)}
        </Typography>
        <RowMenus
          elements={rootMenuItems}
          onNavigate={onNavigate}
          selectedId={selectedId}
          onClick={onClick}
          buildRowMenuId={buildNavigationModalItemId}
          buildRowMenuArrowId={buildItemRowArrowId}
        />
        {Boolean(recentItems.data.length) && (
          <>
            <Typography color="darkgrey" variant="subtitle2">
              {translateBuilder(BUILDER.ITEM_SELECTION_NAVIGATION_RECENT_ITEMS)}
            </Typography>
            <RowMenus
              elements={recentItems.data}
              onNavigate={onNavigate}
              selectedId={selectedId}
              onClick={onClick}
              isDisabled={isDisabled}
              buildRowMenuId={buildNavigationModalItemId}
              buildRowMenuArrowId={buildItemRowArrowId}
            />
          </>
        )}
        {/* show second parent to allow moving a level above */}
        {parents && parents.length > 1 && (
          <>
            <Typography color="darkgrey" variant="subtitle2">
              {translateBuilder(BUILDER.ITEM_SELECTION_NAVIGATION_PARENT)}
            </Typography>
            <RowMenu
              item={parents[parents.length - 2]}
              onNavigate={onNavigate}
              selectedId={selectedId}
              onClick={onClick}
              isDisabled={isDisabled}
            />
          </>
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

export default RootNavigationTree;
