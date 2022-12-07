import { List, RecordOf } from 'immutable';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';

import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DATA_KEYS, MUTATION_KEYS } from '@graasp/query-client';
import { Item, PermissionLevel, redirect } from '@graasp/sdk';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import {
  ADMIN_CONTACT,
  CC_LICENSE_ABOUT_URL,
  VALIDATION_STATUS_NAMES,
} from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, queryClient, useMutation } from '../../../config/queryClient';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
} from '../../../config/selectors';
import { isItemPublic } from '../../../utils/itemTag';
import { getValidationStatusFromItemValidations } from '../../../utils/itemValidation';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import VisibilitySelect from '../sharing/VisibilitySelect';
import CCLicenseSelection from './CCLicenseSelection';
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

const { useTags, useItemTags } = hooks;

type Props = {
  item: RecordOf<Item>;
  permission?: PermissionLevel;
};

// https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
// eslint-disable-next-line no-shadow
const enum PublishFlow {
  SET_ITEM_VISIBILITY_PUBLIC_STEP,
  VALIDATE_ITEM_STEP,
  PUBLISH_STEP,
}

const ItemPublishTab: FC<Props> = ({
  item,
  permission = PermissionLevel.Read,
}) => {
  const { t: translateBuilder } = useBuilderTranslation();

  const { data: tags, isLoading: isTagsLoading } = useTags();
  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(
    item?.id,
  );

  const { data: memberships, isLoading: isMembershipsLoading } =
    hooks.useItemMemberships(item?.id);
  const { data: currentMember, isLoadingCurrentMember } =
    useContext(CurrentUserContext);

  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  const isPublic = isItemPublic({ tags, itemTags });

  const canAdmin = permission === PermissionLevel.Admin;

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

  const step = (() => {
    if (!isPublic) {
      return PublishFlow.SET_ITEM_VISIBILITY_PUBLIC_STEP;
    }
    if (itemValidationStatus !== VALIDATION_STATUS_NAMES.SUCCESS) {
      return PublishFlow.VALIDATE_ITEM_STEP;
    }
    return PublishFlow.PUBLISH_STEP;
  })();

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

  if (
    isLoading ||
    isMembershipsLoading ||
    isLoadingCurrentMember ||
    isTagsLoading ||
    isItemTagsLoading
  ) {
    return <Loader />;
  }

  if (!canEdit || !canAdmin) {
    return (
      <Typography variant="body1">
        {translateBuilder(
          BUILDER.LIBRARY_SETTINGS_VALIDATION_CONFIGURATION_INFORMATIONS,
        )}
      </Typography>
    );
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

  const handleClick = () => {
    const url = CC_LICENSE_ABOUT_URL;
    redirect(url, { openInNewTab: true });
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
    <Box m={2}>
      <>
        <Typography variant="h6" mt={2} id={ITEM_PUBLISH_SECTION_TITLE_ID}>
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_INFORMATION)}
        </Typography>
        <Typography variant="h6" mt={2} mr={2}>
          <LooksOneIcon color="primary" />
          {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VISIBILITY_INFORMATIONS)}
        </Typography>
        <VisibilitySelect item={item} edit={canEdit} />
        <Typography variant="h6" mt={2} mr={2}>
          <LooksTwoIcon color="primary" />
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_INFORMATIONS)}
        </Typography>
        <Button
          id={ITEM_VALIDATION_BUTTON_ID}
          disabled={step < PublishFlow.VALIDATE_ITEM_STEP}
          variant="outlined"
          onClick={handleValidate}
          color="primary"
          endIcon={displayItemValidationIcon()}
        >
          {translateBuilder(
            BUILDER.LIBRARY_SETTINGS_VALIDATION_VALIDATE_BUTTON,
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          color="primary"
          disabled={step < PublishFlow.VALIDATE_ITEM_STEP}
        >
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_REFRESH_BUTTON)}
        </Button>
        {displayItemValidationMessage()}
        <Typography variant="h6" mt={2} mr={2}>
          <Looks3Icon color="primary" />
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
          <CoEditorSettings
            item={item}
            disabled={step < PublishFlow.PUBLISH_STEP}
          />
          <CategorySelection disabled={step < PublishFlow.PUBLISH_STEP} />
          <CustomizedTagsEdit
            item={item}
            disabled={step < PublishFlow.PUBLISH_STEP}
          />
        </Box>

        <Typography variant="h6" mt={2}>
          <Looks4Icon color="primary" />
          {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_TITLE)}
          <Tooltip
            title={translateBuilder(
              BUILDER.ITEM_SETTINGS_CC_LICENSE_MORE_INFORMATIONS,
            )}
            arrow
          >
            <IconButton aria-label="info" onClick={handleClick}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        <CCLicenseSelection
          disabled={step < PublishFlow.PUBLISH_STEP}
          item={item}
        />

        <Typography variant="h6" mt={2} mr={2}>
          <Looks5Icon color="primary" />
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
          disabled={step < PublishFlow.PUBLISH_STEP}
        />
      </>
    </Box>
  );
};

export default ItemPublishTab;
