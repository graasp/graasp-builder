import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

import {
  Cancel,
  CheckCircle,
  Help,
  Looks3,
  Looks4,
  Looks5,
  LooksOne,
  LooksTwo,
  Update,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { ItemValidationStatus, redirect } from '@graasp/sdk';

import groupBy from 'lodash.groupby';

import { OutletType } from '@/components/pages/item/type';

import { ADMIN_CONTACT, CC_LICENSE_ABOUT_URL } from '../../../config/constants';
import { useBuilderTranslation } from '../../../config/i18n';
import { hooks, mutations } from '../../../config/queryClient';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
  ITEM_VALIDATION_REFRESH_BUTTON_ID,
} from '../../../config/selectors';
import { BUILDER } from '../../../langs/constants';
import VisibilitySelect from '../sharing/VisibilitySelect';
import CCLicenseSelection from './CCLicenseSelection';
import CategorySelection from './CategorySelection';
import CoEditorSettings from './CoEditorSettings';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import ItemPublishButton from './ItemPublishButton';

const { useLastItemValidationGroup } = hooks;

const { usePostItemValidation } = mutations;

const enum PublishFlow {
  SET_ITEM_VISIBILITY_PUBLIC_STEP,
  VALIDATE_ITEM_STEP,
  PUBLISH_STEP,
}

const ItemPublishTab = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { item, canWrite, canAdmin } = useOutletContext<OutletType>();

  const [validationStatus, setValidationStatus] =
    useState<ItemValidationStatus | null>(null);

  const isPublic = item.public;

  // item validation
  const { mutate: validateItem } = usePostItemValidation();

  const { data: lastItemValidationGroup, refetch } = useLastItemValidationGroup(
    item?.id,
  );

  useEffect(() => {
    // check if validation is still valid
    const isOutdated =
      Boolean(!lastItemValidationGroup) ||
      Boolean(!lastItemValidationGroup?.createdAt) ||
      (lastItemValidationGroup?.createdAt
        ? lastItemValidationGroup.createdAt <= item?.updatedAt
        : true);
    // QUESTION: should this be null instead?
    if (isOutdated) {
      setValidationStatus(ItemValidationStatus.Failure);
    }

    const mapByStatus = groupBy(
      lastItemValidationGroup?.itemValidations,
      ({ status }) => status,
    );
    let status = null;
    if (mapByStatus[ItemValidationStatus.Failure]) {
      status = ItemValidationStatus.Failure;
    } else if (mapByStatus[ItemValidationStatus.Pending]) {
      status = ItemValidationStatus.Pending;
    } else if (mapByStatus[ItemValidationStatus.Success]) {
      status = ItemValidationStatus.Success;
    }
    setValidationStatus(status);
  }, [lastItemValidationGroup, item?.updatedAt]);

  const step = (() => {
    if (!isPublic) {
      return PublishFlow.SET_ITEM_VISIBILITY_PUBLIC_STEP;
    }
    if (validationStatus !== ItemValidationStatus.Success) {
      return PublishFlow.VALIDATE_ITEM_STEP;
    }
    return PublishFlow.PUBLISH_STEP;
  })();

  if (!canWrite || !canAdmin) {
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

  // display icon indicating current status of given item
  const displayItemValidationIcon = () => {
    switch (validationStatus) {
      case ItemValidationStatus.Success:
        return <CheckCircle color="primary" />;
      case ItemValidationStatus.Pending:
        return <Update color="primary" />;
      case ItemValidationStatus.PendingManual:
        return <Update color="primary" />;
      case ItemValidationStatus.Failure:
        return <Cancel color="primary" />;
      default:
    }
    return null;
  };

  const handleClick = () => {
    const url = CC_LICENSE_ABOUT_URL;
    redirect(window, url, { openInNewTab: true });
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
        <Typography variant="h5" mt={2} id={ITEM_PUBLISH_SECTION_TITLE_ID}>
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_INFORMATION)}
        </Typography>
        <Typography variant="h6" mt={2} mr={2}>
          <LooksOne color="primary" />
          {translateBuilder(BUILDER.ITEM_SETTINGS_VISIBILITY_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VISIBILITY_INFORMATIONS)}
        </Typography>
        <VisibilitySelect item={item} edit={canWrite} />
        <Typography variant="h6" mt={2} mr={2}>
          <LooksTwo color="primary" />
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_TITLE)}
        </Typography>
        <Typography variant="body1">
          {translateBuilder(BUILDER.LIBRARY_SETTINGS_VALIDATION_INFORMATIONS)}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
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
            onClick={() => refetch()}
            color="primary"
            disabled={step < PublishFlow.VALIDATE_ITEM_STEP}
          >
            {translateBuilder(
              BUILDER.LIBRARY_SETTINGS_VALIDATION_REFRESH_BUTTON,
            )}
          </Button>
        </Stack>
        {displayItemValidationMessage()}
        <Typography variant="h6" mt={2} mr={2}>
          <Looks3 color="primary" />
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
          <Looks4 color="primary" />
          {translateBuilder(BUILDER.ITEM_SETTINGS_CC_LICENSE_TITLE)}
          <Tooltip
            title={translateBuilder(
              BUILDER.ITEM_SETTINGS_CC_LICENSE_MORE_INFORMATIONS,
            )}
            arrow
          >
            <span>
              <IconButton aria-label="info" onClick={handleClick}>
                <Help />
              </IconButton>
            </span>
          </Tooltip>
        </Typography>
        <CCLicenseSelection
          disabled={step < PublishFlow.PUBLISH_STEP}
          item={item}
        />

        <Typography variant="h6" mt={2} mr={2}>
          <Looks5 color="primary" />
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
