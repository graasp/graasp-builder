import { useOutletContext } from 'react-router';

import { Box, Typography } from '@mui/material';

import { DiscriminatedItem, isPseudoMember } from '@graasp/sdk';

import { OutletType } from '@/components/pages/item/type';
import { useBuilderTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { BUILDER } from '@/langs/constants';
import { selectHighestMemberships } from '@/utils/membership';

import ItemMembershipsTable from './ItemMembershipsTable';

type Props = { item: DiscriminatedItem };

const ItemLoginMembershipsTable = ({ item }: Props): JSX.Element | false => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { canAdmin } = useOutletContext<OutletType>();
  const { data: itemLoginSchema } = hooks.useItemLoginSchema({
    itemId: item.id,
  });
  const { data: memberships } = hooks.useItemMemberships(item?.id);

  if (itemLoginSchema && memberships) {
    //   show authenticated members if login schema is defined
    // todo: show only if item is pseudonymised
    return (
      <Box>
        <Typography variant="h6" m={0} p={0}>
          {translateBuilder(BUILDER.SHARING_AUTHENTICATED_MEMBERS_TITLE)}
        </Typography>
        <ItemMembershipsTable
          item={item}
          memberships={selectHighestMemberships(memberships)
            .filter((m) => isPseudoMember(m.account))
            .sort((im1, im2) => (im1.account.name > im2.account.name ? 1 : -1))}
          emptyMessage={translateBuilder(
            BUILDER.SHARING_AUTHENTICATED_MEMBERS_EMPTY_MESSAGE,
          )}
          showEmail={false}
          readOnly={!canAdmin}
        />
      </Box>
    );
  }

  return false;
};

export default ItemLoginMembershipsTable;
