import { useOutletContext } from 'react-router';

import { Typography } from '@mui/material';

import { DiscriminatedItem, ItemMembership } from '@graasp/sdk';

import { OutletType } from '@/components/pages/item/type';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';
import { selectHighestMemberships } from '@/utils/membership';

import ItemMembershipsTable from './ItemMembershipsTable';

type Props = { item: DiscriminatedItem; memberships: ItemMembership[] };

const ItemLoginMembershipsTable = ({
  item,
  memberships,
}: Props): JSX.Element | null => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { canAdmin } = useOutletContext<OutletType>();
  const { data: itemLoginSchema } = hooks.useItemLoginSchema({
    itemId: item.id,
  });

  if (itemLoginSchema) {
    //   show authenticated members if login schema is defined
    // todo: show only if item is pseudomized
    return (
      <>
        <Typography variant="h6" m={0} p={0}>
          {translateBuilder(BUILDER.SHARING_AUTHENTICATED_MEMBERS_TITLE)}
        </Typography>
        <ItemMembershipsTable
          item={item}
          memberships={selectHighestMemberships(memberships)}
          emptyMessage={translateBuilder(
            BUILDER.SHARING_AUTHENTICATED_MEMBERS_EMPTY_MESSAGE,
          )}
          showEmail={false}
          readOnly={!canAdmin}
        />
      </>
    );
  }

  return null;
};

export default ItemLoginMembershipsTable;
