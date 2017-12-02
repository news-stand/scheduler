import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeView, login, setBusiness } from '../actions/index';
import PropTypes from 'prop-types';

const Login = props => (
  <div className="credentials clear-fix">
    <h4>Login</h4>
    <form >
      <div>
        <label className="credentials-label">Username:</label>
        <input className="credentials-input" id="username" type="text" name="username" />
      </div>
      <div>
        <label className="credentials-label">Password:</label>
        <input className="credentials-input" id="password" type="password" name="password" />
      </div>
      <div className="btn-credentials">
        <input 
          className="btn-main clickable" 
          type="button" 
          value="Login" 
          onClick={
            () => {
              let username = document.getElementById('username').value;
              let password = document.getElementById('password').value;
              props.login({ username, password });
              document.getElementById('username').value = '';
              document.getElementById('password').value = '';
            }
          }
          // NEED TO SOMEHOW BIND COMPANY NAME ON LOGIN
        />
      </div>
    </form>
  </div>
);

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ login, setBusiness }, dispatch);
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
