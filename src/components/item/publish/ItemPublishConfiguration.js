import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Loader } from '@graasp/ui';
import { Button, Divider, makeStyles, Typography } from '@material-ui/core';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import Looks3Icon from '@material-ui/icons/Looks3';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import { MUTATION_KEYS, DATA_KEYS } from '@graasp/query-client';
import { useMutation, hooks, queryClient } from '../../../config/queryClient';
import CategorySelection from './CategorySelection';
import CustomizedTagsEdit from './CustomizedTagsEdit';
import {
  ADMIN_CONTACT,
  VALIDATION_STATUS_NAMES,
} from '../../../config/constants';
import {
  ITEM_PUBLISH_SECTION_TITLE_ID,
  ITEM_VALIDATION_BUTTON_ID,
} from '../../../config/selectors';
import { getValidationStatusFromItemValidations } from '../../../utils/itemValidation';
import ItemPublishButton from './ItemPublishButton';
import CoEditorSettings from './CoEditorSettings';

const { POST_ITEM_VALIDATION } = MUTATION_KEYS;
const { buildItemValidationAndReviewKey } = DATA_KEYS;
const {
  useItemValidationAndReview,
  useItemValidationGroups,
  useItemValidationStatuses,
  useItemValidationReviewStatuses,
} = hooks;

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  subtitle: {
    marginTop: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  config: {
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(1),
    width: 'auto',
    marginRight: theme.spacing(2),
  },
}));

const ItemPublishConfiguration = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // current item
  const { itemId } = useParams();

  // item validation
  const { mutate: validateItem } = useMutation(POST_ITEM_VALIDATION);

  // get map of item validation and review statuses
  const { data: ivStatuses } = useItemValidationStatuses();
  const { data: ivrStatuses } = useItemValidationReviewStatuses();
  const validationStatusesMap = new Map(
    ivStatuses?.concat(ivrStatuses)?.map((entry) => [entry?.id, entry?.name]),
  );

  // get item validation data
  const { data: itemValidationData, isLoading } =
    useItemValidationAndReview(itemId);
  // check if validation is still valid
  const iVId =
    new Date(itemValidationData?.createdAt) >= new Date(item?.updatedAt)
      ? itemValidationData?.itemValidationId
      : null;
  // get item validation groups
  const { data: itemValidationGroups } = useItemValidationGroups(iVId);

  // group iv records by item validation status
  const ivByStatus = itemValidationGroups?.groupBy(
    ({ statusId }) => validationStatusesMap[statusId],
  );

  const [itemValidationStatus, setItemValidationStatus] = useState(
    VALIDATION_STATUS_NAMES.NOT_VALIDATED,
  );

  useEffect(() => {
    // process when we fetch the item validation and review records
    if (ivByStatus) {
      setItemValidationStatus(
        getValidationStatusFromItemValidations(
          ivByStatus,
          validationStatusesMap,
          itemValidationData,
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
            {t(
              'Your item is pending automatic validation. Once the validation succeeds, you will be able to publish your item.',
            )}
          </Typography>
        );
      case VALIDATION_STATUS_NAMES.PENDING_MANUAL:
        return (
          <Typography variant="body1">
            {t(
              'Your item failed the automatic validation. A member of our team will manually check your collection, please wait for the result.',
            )}
          </Typography>
        );
      case VALIDATION_STATUS_NAMES.FAILURE:
        return (
          <Typography variant="body1">
            {t('itemValidationFailureMessage', { contact: ADMIN_CONTACT })}
          </Typography>
        );
      default:
    }
    return null;
  };

  return (
    <>
      <Divider className={classes.divider} />
      <Typography
        variant="h6"
        className={classes.heading}
        id={ITEM_PUBLISH_SECTION_TITLE_ID}
      >
        {t('Publication On Graasp Library')}
      </Typography>
      <Typography variant="body1">
        {t(
          'You can publish your collection to Graasp Library, our open educational resource library.',
        )}
        <br />
        {t('Published collections are accessible by the public.')}
        <br />
        {t('To publish your collection, please follow the three steps below.')}
      </Typography>
      <Typography variant="h6" className={classes.subtitle}>
        <LooksOneIcon color="primary" className={classes.icon} />
        {t('Validation')}
      </Typography>
      <Typography variant="body1">
        {t(
          'You need to validate your item before publish it. Please allow some time for the validation to finish.',
        )}
      </Typography>
      <Button
        id={ITEM_VALIDATION_BUTTON_ID}
        variant="outlined"
        onClick={handleValidate}
        color="primary"
        className={classes.button}
        endIcon={displayItemValidationIcon()}
      >
        {t('Validate')}
      </Button>
      <Button
        variant="outlined"
        onClick={handleRefresh}
        color="primary"
        className={classes.button}
      >
        {t('Refresh')}
      </Button>
      {displayItemValidationMessage()}
      <Typography variant="h6" className={classes.subtitle}>
        <LooksTwoIcon color="primary" className={classes.icon} />
        {t('Publication')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Once your item is validated, you can set your item to published by clicking the button.',
        )}
      </Typography>
      <ItemPublishButton
        item={item}
        isValidated={itemValidationStatus === VALIDATION_STATUS_NAMES.SUCCESS}
      />
      <Typography variant="h6" className={classes.subtitle}>
        <Looks3Icon color="primary" className={classes.icon} />
        {t('Configuration')}
      </Typography>
      <Typography variant="body1">
        {t(
          'Set the options for your resource to make it easily accessible by the public.',
        )}
      </Typography>
      <div className={classes.config}>
        <CoEditorSettings item={item} />
        <CategorySelection item={item} />
        <CustomizedTagsEdit item={item} />
      </div>
    </>
  );
};

ItemPublishConfiguration.propTypes = {
  item: PropTypes.instanceOf(Record).isRequired,
};

export default ItemPublishConfiguration;
