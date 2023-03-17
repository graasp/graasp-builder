import { List } from 'immutable';

import { useMemo } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
import { Invitation } from '@graasp/sdk';
import { InvitationRecord, ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Table as GraaspTable } from '@graasp/ui/dist/table';

import {
  MEMBERSHIP_TABLE_HEIGHT,
  MEMBERSHIP_TABLE_ROW_HEIGHT,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { useMutation } from '../../../config/queryClient';
import {
  buildInvitationTableRowId,
  buildItemInvitationRowDeleteButtonId,
} from '../../../config/selectors';
import ResendInvitationRenderer from './ResendInvitationRenderer';
import TableRowDeleteButtonRenderer from './TableRowDeleteButtonRenderer';
import TableRowPermissionRenderer from './TableRowPermissionRenderer';

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
};

type Props = {
  item: ItemRecord;
  invitations: List<InvitationRecord>;
  emptyMessage?: string;
  readOnly?: boolean;
};

const InvitationsTable = ({
  invitations,
  item,
  emptyMessage,
  readOnly = false,
}: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editInvitation } = useMutation<
    unknown,
    unknown,
    Partial<Invitation> & {
      itemId: string;
    }
  >(MUTATION_KEYS.PATCH_INVITATION);
  const { mutate: postInvitations } = useMutation<
    unknown,
    unknown,
    { itemId: string; invitations: Partial<Invitation>[] }
  >(MUTATION_KEYS.POST_INVITATIONS);
  const { mutate: deleteInvitation } = useMutation<
    unknown,
    unknown,
    { itemId: string; id: string }
  >(MUTATION_KEYS.DELETE_INVITATION);

  const getRowId = ({ data }) => buildInvitationTableRowId(data.id);

  const onDelete = ({ instance }) => {
    deleteInvitation({ itemId: item.id, id: instance.id });
  };

  const ActionRenderer = TableRowDeleteButtonRenderer({
    item,
    onDelete,
    buildIdFunction: buildItemInvitationRowDeleteButtonId,
    tooltip: translateBuilder(
      BUILDER.INVITATIONS_TABLE_CANNOT_DELETE_PARENT_TOOLTIP,
    ),
  });

  const PermissionRenderer = TableRowPermissionRenderer({
    item,
    editFunction: ({ instance, value }) => {
      editInvitation({
        id: instance.id,
        permission: value,
        itemId: item.id,
      });
    },
    createFunction: ({ instance, value }) => {
      postInvitations({
        itemId: item.id,
        invitations: [
          {
            email: instance.email,
            permission: value,
          },
        ],
      });
    },
    readOnly,
  });

  const InvitationRenderer = ResendInvitationRenderer(item.id);

  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: !readOnly,
        checkboxSelection: !readOnly,
        comparator: GraaspTable.textComparator,
        headerName: translateBuilder(BUILDER.INVITATIONS_TABLE_EMAIL_HEADER),
        field: 'email',
        cellStyle: rowStyle,
        flex: 1,
        tooltipField: 'email',
      },
      {
        headerName: translateBuilder(
          BUILDER.INVITATIONS_TABLE_INVITATION_HEADER,
        ),
        sortable: false,
        cellRenderer: readOnly ? null : InvitationRenderer,
        cellStyle: rowStyle,
        flex: 1,
        field: readOnly ? null : 'email',
      },
      {
        headerName: translateBuilder(
          BUILDER.INVITATIONS_TABLE_PERMISSION_HEADER,
        ),
        cellRenderer: PermissionRenderer,
        comparator: GraaspTable.textComparator,
        type: 'rightAligned',
        field: 'permission',
        cellStyle: readOnly
          ? {
              display: 'flex',
              justifyContent: 'right',
            }
          : null,
      },
      {
        field: readOnly ? null : 'actions',
        cellRenderer: readOnly ? null : ActionRenderer,
        headerName: readOnly
          ? null
          : translateBuilder(BUILDER.INVITATIONS_TABLE_ACTIONS_HEADER),
        colId: 'actions',
        type: 'rightAligned',
        sortable: false,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      translateBuilder,
      InvitationRenderer,
      PermissionRenderer,
      ActionRenderer,
      readOnly,
    ],
  );

  const countTextFunction = (selected) =>
    translateBuilder(BUILDER.ITEMS_TABLE_SELECTION_TEXT, {
      count: selected.length,
    });

  return (
    <GraaspTable
      columnDefs={columnDefs}
      tableHeight={MEMBERSHIP_TABLE_HEIGHT}
      rowData={invitations.toJS()}
      emptyMessage={emptyMessage}
      getRowId={getRowId}
      rowHeight={MEMBERSHIP_TABLE_ROW_HEIGHT}
      isClickable={false}
      countTextFunction={countTextFunction}
    />
  );
};

export default InvitationsTable;
