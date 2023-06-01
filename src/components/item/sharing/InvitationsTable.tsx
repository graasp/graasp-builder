import { ColDef } from 'ag-grid-community';
import { List } from 'immutable';

import { useMemo } from 'react';

import { Invitation, PermissionLevel } from '@graasp/sdk';
import { InvitationRecord, ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Table as GraaspTable } from '@graasp/ui/dist/table';

import {
  MEMBERSHIP_TABLE_HEIGHT,
  MEMBERSHIP_TABLE_ROW_HEIGHT,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { mutations } from '../../../config/queryClient';
import {
  buildInvitationTableRowId,
  buildItemInvitationRowDeleteButtonId,
} from '../../../config/selectors';
import ResendInvitationRenderer from './ResendInvitationRenderer';
import TableRowDeleteButtonRenderer, {
  TableRowDeleteButtonRendererProps,
} from './TableRowDeleteButtonRenderer';
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
  const { mutate: editInvitation } = mutations.usePatchInvitation();
  const { mutate: postInvitations } = mutations.usePostInvitations();
  const { mutate: deleteInvitation } = mutations.useDeleteInvitation();

  const getRowId = ({ data }: { data: Invitation }) =>
    buildInvitationTableRowId(data.id);

  const onDelete: TableRowDeleteButtonRendererProps<Invitation>['onDelete'] = ({
    instance,
  }) => {
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
    editFunction: ({
      instance,
      value,
    }: {
      instance: Invitation;
      value: PermissionLevel;
    }) => {
      editInvitation({
        id: instance.id,
        permission: value,
        itemId: item.id,
      });
    },
    createFunction: ({
      instance,
      value,
    }: {
      instance: Invitation;
      value: PermissionLevel;
    }) => {
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
  const columnDefs = useMemo<ColDef[]>(
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
        field: readOnly ? undefined : 'email',
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
          : undefined,
      },
      {
        field: readOnly ? undefined : 'actions',
        cellRenderer: readOnly ? null : ActionRenderer,
        headerName: readOnly
          ? undefined
          : translateBuilder(BUILDER.INVITATIONS_TABLE_ACTIONS_HEADER),
        colId: 'actions',
        type: 'rightAligned',
        sortable: false,
        // bug: force css
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        } as any,
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

  const countTextFunction = (selected: string[]) =>
    translateBuilder(BUILDER.ITEMS_TABLE_SELECTION_TEXT, {
      count: selected.length,
    });

  return (
    <GraaspTable
      columnDefs={columnDefs}
      tableHeight={MEMBERSHIP_TABLE_HEIGHT}
      rowData={invitations.toJS() as Invitation[]}
      emptyMessage={emptyMessage}
      getRowId={getRowId}
      rowHeight={MEMBERSHIP_TABLE_ROW_HEIGHT}
      isClickable={false}
      countTextFunction={countTextFunction}
    />
  );
};

export default InvitationsTable;
