import { List, RecordOf } from 'immutable';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Looks3Icon from '@mui/icons-material/Looks3';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Button, Typography } from '@mui/material';

import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DATA_KEYS, MUTATION_KEYS } from '@graasp/query-client';
import { Item } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import {
  ADMIN_CONTACT,
  VALIDATION_STATUS_NAMES,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, queryClient, useMutation } from '../../../config/queryClient';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
} from '../../../config/selectors';
import { getValidationStatusFromItemValidations } from '../../../utils/itemValidation';
import CategorySelection from './CategorySelection';
import CoEditorSettings from './CoEditorSettings';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import ItemPublishButton from './ItemPublishButton';

const { POST_ITEM_VALIDATION } = MUTATION_KEYS;
const { buildItemValidationAndReviewKey } = DATA_KEYS;
const {
  useItemValidationAndReview,
  useItemValidationGroups,
  useItemValidationStatuses,
  useItemValidationReviewStatuses,
} = hooks;

type Props = {
  item: RecordOf<Item>;
};

const ItemPublishConfiguration: FC<Props> = ({ item }) => {
  const { t: translateBuilder } = useBuilderTranslation();
  // current item
  const { itemId } = useParams();

  // item validation
  const { mutate: validateItem } = useMutation<any, any, any>(
    POST_ITEM_VALIDATION,
  );

  // get map of item validation and review statuses
  const { data: ivStatuses } = useItemValidationStatuses();
  const { data: ivrStatuses } = useItemValidationReviewStatuses();
  const validationStatusesMap = new Map(
    // todo: fix with query client
    (ivStatuses as List<any>)
      ?.concat(ivrStatuses)
      ?.map((entry) => [entry?.id, entry?.name]),
  );

  // get item validation data
  const { data: itemValidationData, isLoading } =
    useItemValidationAndReview(itemId);
  // todo: fix with query client
  const itemValidationDataTyped = itemValidationData as any;
  // check if validation is still valid
  const iVId =
    new Date(itemValidationDataTyped?.createdAt) >= new Date(item?.updatedAt)
      ? itemValidationDataTyped?.itemValidationId
      : null;
  // get item validation groups
  const { data: itemValidationGroups } = useItemValidationGroups(iVId);
  // todo: fix with query client
  const itemValidationGroupsTyped = itemValidationGroups as List<any>;
  // group iv records by item validation status
  const ivByStatus = itemValidationGroupsTyped?.groupBy(
    ({ statusId }) => validationStatusesMap[statusId],
  );

  const [itemValidationStatus, setItemValidationStatus] = useState<
    string | boolean
  >(VALIDATION_STATUS_NAMES.NOT_VALIDATED);

  useEffect(() => {
    // process when we fetch the item validation and review records
    if (ivByStatus) {
      setItemValidationStatus(
        getValidationStatusFromItemValidations(
          ivByStatus,
          validationStatusesMap,
          itemValidationDataTyped,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ivByStatus]);

  if (isLoading) {
    return <Loader />;
  }

  const handleValidate = () => {
    // prevent re-send request if the item is already successfully validated
    if (!(itemValidationStatus === VALIDATION_STATUS_NAMES.SUCCESS)) {
      validateItem({ itemId });
    }
    setItemValidationStatus(VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(buildItemValidationAndReviewKey(itemId));
  };

  // display icon indicating current status of given item
  const displayItemValidationIcon = () => {
    switch (itemValidationStatus) {
      case VALIDATION_STATUS_NAMES.SUCCESS:
        return <CheckCircleIcon color="primary" />;
      case VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC:
        return <UpdateIcon color="primary" />;
      case VALIDATION_STATUS_NAMES.PENDING_MANUAL:
        return <UpdateIcon color="primary" />;
      case VALIDATION_STATUS_NAMES.FAILURE:
        return <CancelIcon color="primary" />;
      default:
    }
    return null;
  };

  const displayItemValidationMessage = () => {
    switch (itemValidationStatus) {
      case VALIDATION_STATUS_NAMES.PENDING_AUTOMATIC:
        return (
          <Typography variant="body1">
            {translateBuilder(
              BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_AUTOMATIC,
            )}
          </Typography>
        );
      case VALIDATION_STATUS_NAMES.PENDING_MANUAL:
        return (
          <Typography variant="body1">
            {translateBuilder(
              BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_MANUAL,
            )}
          </Typography>
        );
      case VALIDATION_STATUS_NAMES.FAILURE:
        return (
          <Typography variant="body1">
            {translateBuilder(
              BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_FAILURE,
              {
                contact: ADMIN_CONTACT,
              },
            )}
          </Typography>
        );
      default:
    }
    return null;
  };

  return (
    <>
      <Typography variant="h6" mt={2} id={ITEM_PUBLISH_SECTION_TITLE_ID}>
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_TITLE)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_INFORMATION)}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1, mr: 2 }}>
        <LooksOneIcon color="primary" />
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_TITLE)}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_INFORMATIONS)}
      </Typography>
      <Button
        id={ITEM_VALIDATION_BUTTON_ID}
        variant="outlined"
        onClick={handleValidate}
        color="primary"
        endIcon={displayItemValidationIcon()}
      >
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_VALIDATE_BUTTON)}
      </Button>
      <Button variant="outlined" onClick={handleRefresh} color="primary">
        {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_REFRESH_BUTTON)}
      </Button>
      {displayItemValidationMessage()}
      <Typography variant="h6" mt={2} mr={2}>
        <LooksTwoIcon color="primary" />
        {translateBuilder(
          BUILDER.LIBRARY_SETTINGS_VALIDATION_PUBLICATION_TITLE,
        )}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(
          BUILDER.LIBRARY_SETTINGS_VALIDATION_PUBLICATION_INFORMATIONS,
        )}
      </Typography>
      <ItemPublishButton
        item={item}
        isValidated={itemValidationStatus === VALIDATION_STATUS_NAMES.SUCCESS}
      />
      <Typography variant="h6" mt={2}>
        <Looks3Icon color="primary" sx={{ mr: 2 }} />
        {translateBuilder(
          BUILDER.LIBRARY_SETTINGS_VALIDATION_CONFIGURATION_TITLE,
        )}
      </Typography>
      <Typography variant="body1">
        {translateBuilder(
          BUILDER.LIBRARY_SETTINGS_VALIDATION_CONFIGURATION_INFORMATIONS,
        )}
      </Typography>
      <Box mx={3}>
        <CoEditorSettings item={item} />
        <CategorySelection />
        <CustomizedTagsEdit item={item} />
      </Box>
    </>
  );
};

export default ItemPublishConfiguration;
