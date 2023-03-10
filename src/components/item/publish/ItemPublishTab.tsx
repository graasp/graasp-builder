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

import { FC, useEffect, useState } from 'react';

import { DATA_KEYS } from '@graasp/query-client';
import {
  ItemTagType,
  ItemValidationStatus,
  PermissionLevel,
  redirect,
} from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';
import { BUILDER } from '@graasp/translations';
import { Loader } from '@graasp/ui';

import { ADMIN_CONTACT, CC_LICENSE_ABOUT_URL } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations, queryClient } from '../../../config/queryClient';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
  ITEM_VALIDATION_REFRESH_BUTTON_ID,
} from '../../../config/selectors';
import { isItemUpdateAllowedForUser } from '../../../utils/membership';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import VisibilitySelect from '../sharing/VisibilitySelect';
import CCLicenseSelection from './CCLicenseSelection';
import CategorySelection from './CategorySelection';
import CoEditorSettings from './CoEditorSettings';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import ItemPublishButton from './ItemPublishButton';

const { useItemTags, useLastItemValidationGroup } = hooks;

const { usePostItemValidation } = mutations;

type Props = {
  item: ItemRecord;
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

  const { data: itemTags, isLoading: isItemTagsLoading } = useItemTags(
    item?.id,
  );

  const { data: memberships, isLoading: isMembershipsLoading } =
    hooks.useItemMemberships(item?.id);
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentUserContext();

  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.id,
  });

  const [validationStatus, setValidationStatus] = useState(null);

  const isPublic = itemTags?.find(({ type }) => type === ItemTagType.PUBLIC);

  const canAdmin = permission === PermissionLevel.Admin;

  // item validation
  const { mutate: validateItem } = usePostItemValidation();

  // get item validation data
  // const { data: itemValidationData, isLoading } = useItemValidationAndReview(
  //   item?.id,
  // );
  // console.log('itemValidationData', itemValidationData);
  // todo: fix with query client
  // const itemValidationDataTyped = itemValidationData as any;
  // // check if validation is still valid
  // const iVId =
  //   new Date(itemValidationDataTyped?.createdAt) >=
  //   new Date(item?.updatedAt as unknown as string)
  //     ? itemValidationDataTyped?.itemValidationId
  //     : null;
  // console.log('iVId', iVId);
  // get item validation data
  const { data: lastItemValidationGroup } = useLastItemValidationGroup(
    item?.id,
  );

  useEffect(() => {
    // TODO check if validation is still valid
    console.log('lastItemValidationGroup', lastItemValidationGroup);
    const mapByStatus = (
      lastItemValidationGroup as any
    )?.itemValidations?.groupBy(({ status }) => status);
    console.log(mapByStatus);
    let status;
    if (mapByStatus?.get(ItemValidationStatus.Failure)) {
      status = ItemValidationStatus.Failure;
    } else if (mapByStatus?.get(ItemValidationStatus.Pending)) {
      status = ItemValidationStatus.Pending;
    } else if (mapByStatus?.get(ItemValidationStatus.Success)) {
      status = ItemValidationStatus.Success;
    }
    console.log(status);
    setValidationStatus(status);
  }, [lastItemValidationGroup]);

  const step = (() => {
    if (!isPublic) {
      return PublishFlow.SET_ITEM_VISIBILITY_PUBLIC_STEP;
    }
    if (validationStatus !== ItemValidationStatus.Success) {
      return PublishFlow.VALIDATE_ITEM_STEP;
    }
    return PublishFlow.PUBLISH_STEP;
  })();

  if (
    // isLoading ||
    isMembershipsLoading ||
    isLoadingCurrentMember ||
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
    if (!(validationStatus === ItemValidationStatus.Success)) {
      validateItem({ itemId: item.id });
    }
    setValidationStatus(ItemValidationStatus.Pending);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(
      DATA_KEYS.buildLastItemValidationGroupKey(item.id),
    );
  };

  // display icon indicating current status of given item
  const displayItemValidationIcon = () => {
    switch (validationStatus) {
      case ItemValidationStatus.Success:
        return <CheckCircleIcon color="primary" />;
      case ItemValidationStatus.Pending:
        return <UpdateIcon color="primary" />;
      case ItemValidationStatus.PendingManual:
        return <UpdateIcon color="primary" />;
      case ItemValidationStatus.Failure:
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
    switch (validationStatus) {
      case ItemValidationStatus.Pending:
        return (
          <Typography variant="body1">
            {translateBuilder(
              BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_AUTOMATIC,
            )}
          </Typography>
        );
      case ItemValidationStatus.PendingManual:
        return (
          <Typography variant="body1">
            {translateBuilder(
              BUILDER.LIBRARY_SETTINGS_VALIDATION_STATUS_PENDING_MANUAL,
            )}
          </Typography>
        );
      case ItemValidationStatus.Failure:
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
          id={ITEM_VALIDATION_REFRESH_BUTTON_ID}
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
          isValidated={validationStatus === ItemValidationStatus.Success}
          disabled={step < PublishFlow.PUBLISH_STEP}
        />
      </>
    </Box>
  );
};

export default ItemPublishTab;
