import React, { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, makeStyles } from '@material-ui/core';
import { PERMISSION_LEVELS } from '../../../enums';
import {
  buildPermissionOptionId,
  ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS,
} from '../../../config/selectors';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 'auto',

    // apply secondary color
    '& .MuiFormLabel-root': {
      color: (prop) =>
        prop.color === 'secondary' ? theme.palette.secondary.main : 'default',
    },
    '& .MuiInputBase-root': {
      color: (prop) =>
        prop.color === 'secondary' ? theme.palette.secondary.main : 'default',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: (prop) =>
        prop.color === 'secondary' ? theme.palette.secondary.main : 'default',
    },
  },
}));

const ItemMembershipSelect = ({
  value,
  showLabel,
  onChange,
  displayEmpty,
  color,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ color });
  const [permission, setPermission] = useState(value);
  const labelId = 'permission-label';
  const labelProps = showLabel
    ? {
        labelId,
        label: t('Permission'),
      }
    : {};
  const label = t('Permission');

  useEffect(() => {
    if (permission !== value) {
      setPermission(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      {showLabel && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...labelProps}
        labelId={showLabel ? labelId : null}
        defaultValue={permission}
        onChange={onChange}
        displayEmpty={displayEmpty}
        className={ITEM_MEMBERSHIP_PERMISSION_SELECT_CLASS}
        renderValue={(v) => v ?? label}
        color={color}
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
  value: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)),
  showLabel: PropTypes.bool,
  onChange: PropTypes.func,
  displayEmpty: PropTypes.bool,
  color: PropTypes.string,
};

ItemMembershipSelect.defaultProps = {
  showLabel: true,
  onChange: null,
  color: 'default',
  displayEmpty: false,
  value: undefined,
};

export default ItemMembershipSelect;
