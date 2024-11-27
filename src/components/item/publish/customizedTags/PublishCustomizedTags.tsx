import { useEffect } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip } from '@mui/material';

import { DiscriminatedItem } from '@graasp/sdk';

import { useDataSyncContext } from '@/components/context/DataSyncContext';
import { WARNING_COLOR } from '@/config/constants';
import { useBuilderTranslation } from '@/config/i18n';
import { BUILDER } from '@/langs/constants';

import CustomizedTags from './CustomizedTags';
import { useTagsManager } from './useTagsManager';

type Props = {
  item: DiscriminatedItem;
  onChange?: (args: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  }) => void;
};

const SYNC_STATUS_KEY = 'CustomizedTags';
export const PublishCustomizedTags = ({
  item,
  onChange,
}: Props): JSX.Element => {
  const { t } = useBuilderTranslation();
  const { tags, isLoading, isSuccess, isError } = useTagsManager({
    itemId: item.id,
  });
  const { computeStatusFor } = useDataSyncContext();
  const showWarning = !tags?.length;

  useEffect(
    () => computeStatusFor(SYNC_STATUS_KEY, { isLoading, isSuccess, isError }),
    [isLoading, isSuccess, isError, onChange, computeStatusFor],
  );

  return (
    <>
      <CustomizedTags item={item} />

      {showWarning && (
        <Tooltip title={t(BUILDER.ITEM_TAGS_MISSING_WARNING)}>
          <WarningIcon htmlColor={WARNING_COLOR} />
        </Tooltip>
      )}
    </>
  );
};
