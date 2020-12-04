import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Alert } from '@material-ui/lab';
import { SIGN_IN_PATH } from '../config/paths';
import { signUp } from '../api/authentication';
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

class SignUp extends Component {
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
    email: '',
    name: '',
    isSuccess: null,
    isAuthenticated: false,
  };

  componentDidMount() {
    const isAuthenticated = isSignedIn();
    this.setState({ isAuthenticated });
  }

  handleOnSignIn = () => {
    const {
      history: { push },
    } = this.props;
    push(SIGN_IN_PATH);
  };

  handleEmailOnChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleNameOnChange = (e) => {
    this.setState({ name: e.target.value });
  };

  register = async () => {
    const { email, name } = this.state;
    const isSuccess = await signUp({ name, email });
    this.setState({ isSuccess });
  };

  renderMessage = () => {
    const { isSuccess } = this.state;
    if (isSuccess) {
      return (
        <Alert severity="success">
          An email was sent with the register link!
        </Alert>
      );
    }
    // is not triggered for null (initial case)
    if (isSuccess === false) {
      return <Alert severity="error">An error occured.</Alert>;
    }
    return null;
  };

  renderForm = () => {
    const { classes } = this.props;
    const { email, name } = this.state;

    return (
      <>
        <Grid item xs={12}>
          <TextField
            className={classes.input}
            required
            label="Name"
            variant="outlined"
            value={name}
            onChange={this.handleNameOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className={classes.input}
            required
            label="email"
            variant="outlined"
            value={email}
            onChange={this.handleEmailOnChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={this.register}>
            Sign Up
          </Button>
        </Grid>
        <Divider variant="middle" className={classes.divider} />
        <Button variant="text" color="primary" onClick={this.handleOnSignIn}>
          Already have an account? Click here to sign in
        </Button>
      </>
    );
  };

  renderIsAuthenticatedMessage = () => {
    return (
      <Grid item xs={12}>
        <Typography variant="subtitle1">You are already signed in.</Typography>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;
    const { isRequestSent, isAuthenticated } = this.state;

    if (isRequestSent) {
      return <div>You will receive a email with your cookie!</div>;
    }

    return (
      <div className={classes.fullScreen}>
        {this.renderMessage()}
        <Typography variant="h2" component="h2">
          Sign Up
        </Typography>
        <Grid container className={classes.form}>
          {isAuthenticated && this.renderIsAuthenticatedMessage()}
          {!isAuthenticated && this.renderForm()}
        </Grid>
      </div>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(SignUp);

export default withRouter(StyledComponent);
