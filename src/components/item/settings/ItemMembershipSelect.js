import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, makeStyles } from '@material-ui/core';
import { DEFAULT_PERMISSION_LEVEL } from '../../../config/constants';
import { PERMISSION_LEVELS } from '../../../enums';
import {
  buildPermissionOptionId,
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
} from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
}));

const ItemMembershipSelect = ({ value, inputRef, showLabel, onChange }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const labelId = 'permission-label';
  const labelProps = showLabel
    ? {
        labelId,
        label: t('Permission'),
      }
    : {};
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {showLabel && <InputLabel id={labelId}>{t('Permission')}</InputLabel>}
      <Select
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...labelProps}
        inputRef={inputRef}
        labelId={showLabel ? labelId : null}
        defaultValue={value || DEFAULT_PERMISSION_LEVEL}
        onChange={onChange}
        className={ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}
      >
        {Object.values(PERMISSION_LEVELS).map((p) => (
          <MenuItem
            key={buildPermissionOptionId(p)}
            id={buildPermissionOptionId(p)}
            value={p}
          >
            {p}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

ItemMembershipSelect.propTypes = {
  value: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
  inputRef: PropTypes.instanceOf(React.Ref).isRequired,
  showLabel: PropTypes.bool,
  onChange: PropTypes.func,
};

ItemMembershipSelect.defaultProps = {
  showLabel: true,
  onChange: null,
};

export default ItemMembershipSelect;
