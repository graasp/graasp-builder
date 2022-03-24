import PropTypes from 'prop-types';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import { DownloadButton } from '@graasp/ui';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useTranslation } from 'react-i18next';
import EditButton from '../common/EditButton';
import ItemMenu from '../main/ItemMenu';
import FavoriteButton from '../common/FavoriteButton';
import PinButton from '../common/PinButton';
import {
  getMembershipsForItem,
  isItemUpdateAllowedForUser,
} from '../../utils/membership';
import HideButton from '../common/HideButton';
import { useMutation } from '../../config/queryClient';

// items and memberships match by index
const ActionsCellRenderer = ({ memberships, items, member }) => {
  const { t } = useTranslation();
  const ChildComponent = ({ data: item }) => {
    const [canEdit, setCanEdit] = useState(false);

    const {
      mutate: downloadItem,
      content,
      isSuccess,
      isLoading: isDownloading,
    } = useMutation(MUTATION_KEYS.EXPORT_ZIP);

    useEffect(() => {
      if (isSuccess) {
        const url = window.URL.createObjectURL(new Blob([content]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${item.id}.zip`);
        document.body.appendChild(link);
        link.click();
      }
    }, [content, isSuccess, item]);

    useEffect(() => {
      if (items && memberships && !memberships.isEmpty() && !items.isEmpty()) {
        setCanEdit(
          isItemUpdateAllowedForUser({
            memberships: getMembershipsForItem({ item, items, memberships }),
            memberId: member?.get('id'),
          }),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, memberships, item, member]);

    const renderAnyoneActions = () => (
      <ItemMenu item={item} canEdit={canEdit} />
    );

    const renderAuthenticatedActions = () => {
      if (!member || member.isEmpty()) {
        return null;
      }

      return <FavoriteButton item={item} />;
    };

    const handleDownload = () => {
      downloadItem(item.id);
    };

    const renderEditorActions = () => {
      if (!canEdit) {
        return null;
      }

      return (
        <>
          <EditButton item={item} />
          <PinButton item={item} />
          <HideButton item={item} />
          <DownloadButton
            handleDownload={handleDownload}
            isLoading={isDownloading}
            title={t('Download')}
          />
        </>
      );
    };

    return (
      <>
        {renderAuthenticatedActions()}
        {renderEditorActions()}
        {renderAnyoneActions()}
      </>
    );
  };
  ChildComponent.propTypes = {
    data: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  };
  return ChildComponent;
};

ActionsCellRenderer.propTypes = {
  memberships: PropTypes.instanceOf(List).isRequired,
  member: PropTypes.instanceOf(Map).isRequired,
};

export default ActionsCellRenderer;
