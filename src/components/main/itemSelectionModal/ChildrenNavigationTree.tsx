import { Alert, Box, Skeleton } from '@mui/material';

import { ItemType } from '@graasp/sdk';

import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';

import { NavigationElement } from './Breadcrumbs';
import RowMenu, { RowMenuProps } from './RowMenu';

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
  );
  // TODO: use hook's filter when available
  const folders = children?.filter((f) => f.type === ItemType.FOLDER);

  if (children) {
    return (
      <>
        {folders?.map((ele) => (
          <RowMenu
            key={ele.id}
            item={ele}
            onNavigate={onNavigate}
            selectedId={selectedId}
            onClick={onClick}
            isDisabled={isDisabled}
          />
        ))}
        {!folders?.length && (
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
