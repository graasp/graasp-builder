import { Typography } from '@mui/material';

import { DiscriminatedItem, ItemType, PermissionLevel } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import { NavigationElement } from './Breadcrumbs';
import RowMenu, { RowMenuProps } from './RowMenu';

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
}: RootNavigationTreeProps): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();

  // todo: to change with real recent items (most used)
  const { data: recentItems } = hooks.useAccessibleItems(
    // you can move into an item you have at least write permission
    { permissions: [PermissionLevel.Admin, PermissionLevel.Write] },
    { pageSize: 5 },
  );
  const recentFolders = recentItems?.data?.filter(
    ({ type }) => type === ItemType.FOLDER,
  );

  const { data: parents } = hooks.useParents({
    id: items[0].id,
    path: items[0].path,
  });

  return (
    <>
      <Typography color="darkgrey" variant="subtitle2">
        {translateBuilder(BUILDER.HOME_TITLE)}
      </Typography>
      {rootMenuItems.map((mi) => (
        <RowMenu
          key={mi.name}
          item={mi}
          onNavigate={onNavigate}
          selectedId={selectedId}
          onClick={onClick}
          //   root items cannot be disabled - but they are disabled by the button
        />
      ))}
      {recentFolders && (
        <>
          <Typography color="darkgrey" variant="subtitle2">
            {translateBuilder(BUILDER.ITEM_SELECTION_NAVIGATION_RECENT_ITEMS)}
          </Typography>
          {recentFolders.map((item) => (
            <RowMenu
              key={item.name}
              item={item}
              onNavigate={onNavigate}
              selectedId={selectedId}
              onClick={onClick}
              isDisabled={isDisabled}
            />
          ))}
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
};

export default RootNavigationTree;
