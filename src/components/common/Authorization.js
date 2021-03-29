import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buildSignInPath } from '../../api/routes';
import { FLAG_GETTING_CURRENT_MEMBER } from '../../types/member';
import { AUTHENTICATION_HOST } from '../../config/constants';
import { getCurrentMember } from '../../actions';

const Authorization = () => (ChildComponent) => {
  class ComposedComponent extends Component {
    static redirectToSignIn(props) {
      const { location: { pathname } = {} } = props;
      window.location.href = `${AUTHENTICATION_HOST}/${buildSignInPath(
        `${window.location.origin}${pathname}`,
      )}`;
    }

    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      match: PropTypes.shape({
        path: PropTypes.string,
      }).isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      activity: PropTypes.bool.isRequired,
      dispatchGetCurrentMember: PropTypes.func.isRequired,
    };

    componentDidMount() {
      const { dispatchGetCurrentMember } = this.props;
      dispatchGetCurrentMember();
    }

    componentDidUpdate() {
      this.checkAuthorization();
    }

    checkAuthorization = () => {
      const { isAuthenticated, activity } = this.props;

      if (!activity && !isAuthenticated) {
        ComposedComponent.redirectToSignIn(this.props);
      }
    };

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ member }) => ({
    isAuthenticated: !member.getIn(['current']).isEmpty(),
    activity: Boolean(
      member.getIn(['activity', FLAG_GETTING_CURRENT_MEMBER]).length,
    ),
  });

  const mapDispatchToProps = {
    dispatchGetCurrentMember: getCurrentMember,
  };

  return connect(mapStateToProps, mapDispatchToProps)(ComposedComponent);
};

export default Authorization;
