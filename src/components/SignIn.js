import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie'
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import { Alert } from '@material-ui/lab';
import { REGISTER_PATH } from '../config/paths';
import { createItem, getOwnItems, signIn } from '../api/authentication';

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
  };

  componentDidUpdate() {
    //this.isSignedIn()
  }

  async componentDidMount() {
    this.isSignedIn()
    console.log(await createItem())
  }

  async isSignedIn() {
    await fetch("http://ielsrv7.epfl.ch/auth?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4N2M0OTQwZS1mNzY0LTRkODYtODExNC0xZWRkOWVmZjJlZTAiLCJpYXQiOjE2MDU3NzYxMTEsImV4cCI6MTYwNTc3NzkxMX0.g9Kb2hauJyv25nX-Y-vtFHwsCglKXueo_Y-C4IvoG-M", {
      credentials: "include",

    })
   // getOwnItems()
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

  handleOnChange = (e) => {
    this.setState({ email: e.target.value });
  };

  renderMessage = () => {
    const { isSuccess } = this.state;
    if (isSuccess) {
      return (
        <Alert severity="success">An email was sent with the login link!</Alert>
      );
    }
    // is not triggered for null (initial case)
    if (isSuccess === false) {
      return <Alert severity="error">An error occured.</Alert>;
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    const { email } = this.state;

    return (
      <div className={classes.fullScreen}>
        {this.renderMessage()}
        <Typography variant="h2" component="h2">
          Sign In
        </Typography>
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
      </div>
    );
  }
}

const StyledComponent = withStyles(styles, { withTheme: true })(SignIn);

export default withRouter(StyledComponent);
