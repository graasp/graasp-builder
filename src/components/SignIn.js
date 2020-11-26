import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import { Alert } from '@material-ui/lab';
import { REGISTER_PATH } from '../config/paths';
import { signIn, signOut } from '../api/authentication';
import { isSignedIn } from '../utils/common';

const styles = (theme) => ({
  fullScreen: {
    margin: 'auto',
    textAlign: 'center',
  },
  input: {
    margin: theme.spacing(1),
  },
  form: {
    width: '50%',
    minWidth: '200px',
    margin: 'auto',
  },
  divider: {
    margin: theme.spacing(2),
  },
});

class SignIn extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      fullScreen: PropTypes.string.isRequired,
      divider: PropTypes.string.isRequired,
      form: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    isSuccess: null,
    email: '',
    isAuthenticated: false,
  };

  componentDidMount() {
    const isAuthenticated = isSignedIn();
    this.setState({ isAuthenticated });
  }

  handleOnRegister = () => {
    const {
      history: { push },
    } = this.props;
    push(REGISTER_PATH);
  };

  signIn = async () => {
    const { email } = this.state;
    const isSuccess = await signIn({ email });
    this.setState({ isSuccess });
  };

  signOut = async () => {
    const isSuccess = await signOut();
    this.setState({ isSuccess });
  };

  handleOnChange = (e) => {
    this.setState({ email: e.target.value });
  };

  renderMessage = () => {
    const { isSuccess } = this.state;
    if (isSuccess) {
      return <Alert severity="success">Success!</Alert>;
    }
    // is not triggered for null (initial case)
    if (isSuccess === false) {
      return <Alert severity="error">An error occured.</Alert>;
    }
    return null;
  };

  renderSignOutButton = () => {
    return (
      <>
        <Typography variant="subtitle1">You are already signed in.</Typography>
        <Button variant="text" color="primary" onClick={this.signOut}>
          Click here to sign out
        </Button>
      </>
    );
  };

  renderSignInForm = () => {
    const { email } = this.state;
    const { classes } = this.props;
    return (
      <>
        <FormControl>
          <TextField
            className={classes.input}
            required
            label="email"
            variant="outlined"
            value={email}
            onChange={this.handleOnChange}
          />
          <Button variant="contained" color="primary" onClick={this.signIn}>
            Sign In
          </Button>
        </FormControl>

        <Divider variant="middle" className={classes.divider} />
        <Button variant="text" color="primary" onClick={this.handleOnRegister}>
          Not registered? Click here to register
        </Button>
      </>
    );
  };

  render() {
    const { classes } = this.props;
    const { isAuthenticated } = this.state;

    return (
      <div className={classes.fullScreen}>
        {this.renderMessage()}
        <Typography variant="h2" component="h2">
          Sign In
        </Typography>
        {!isAuthenticated && this.renderSignInForm()}
        {isAuthenticated && this.renderSignOutButton()}
      </div>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(SignIn);

export default withRouter(StyledComponent);
