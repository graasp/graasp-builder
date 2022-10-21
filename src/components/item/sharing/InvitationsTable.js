import { List, Record } from 'immutable';
import PropTypes from 'prop-types';

import { useMemo } from 'react';

import { MUTATION_KEYS } from '@graasp/query-client';
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

const InvitationsTable = ({ invitations, item, emptyMessage }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: editInvitation } = useMutation(
    MUTATION_KEYS.PATCH_INVITATION,
  );
  const { mutate: postInvitations } = useMutation(
    MUTATION_KEYS.POST_INVITATIONS,
  );
  const { mutate: deleteInvitation } = useMutation(
    MUTATION_KEYS.DELETE_INVITATION,
  );

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
  });

  const InvitationRenderer = ResendInvitationRenderer(item);

  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
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
        cellRenderer: InvitationRenderer,
        cellStyle: rowStyle,
        flex: 1,
        field: 'email',
      },
      {
        headerName: translateBuilder(
          BUILDER.INVITATIONS_TABLE_PERMISSION_HEADER,
        ),
        cellRenderer: PermissionRenderer,
        comparator: GraaspTable.textComparator,
        type: 'rightAligned',
        field: 'permission',
      },
      {
        field: 'actions',
        cellRenderer: ActionRenderer,
        headerName: translateBuilder(BUILDER.INVITATIONS_TABLE_ACTIONS_HEADER),
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
    [translateBuilder, InvitationRenderer, PermissionRenderer, ActionRenderer],
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

InvitationsTable.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
  invitations: PropTypes.instanceOf(List).isRequired,
  emptyMessage: PropTypes.string,
};

InvitationsTable.defaultProps = {
  emptyMessage: null,
};

export default InvitationsTable;
