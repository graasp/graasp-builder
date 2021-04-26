import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';

function MemberIdTextField(props) {
  const { showMask, ...other } = props;

  return (
    <MaskedInput
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      mask={[
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        '-',
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        '-',
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        '-',
        /[89ab]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        '-',
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
        /[0-9a-f]/,
      ]}
      placeholderChar="_"
      showMask={showMask}
      placeholder=" "
    />
  );
}

/**
 * <MaskedInput
        autoFocus
        error={memberId?.length && !isMemberIdValid(memberId)}
        onChange={onMemberIdChange}
        label={t('Member Id')}
        showMask
        mask={[
          /[1-9]/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        type="text"
        color="primary"
        variant="outlined"
        fullWidth
        className={classes.input}
        id={ITEM_LOGIN_SIGN_IN_MEMBER_ID_ID}
        value={memberId}
      />
 */

MemberIdTextField.propTypes = {
  showMask: PropTypes.bool,
};

MemberIdTextField.defaultProps = {
  showMask: true,
};

export default MemberIdTextField;
