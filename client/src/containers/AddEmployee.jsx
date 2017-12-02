import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { addEmployee, leaveAddEmployee } from '../actions/index';

class AddEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEmployeeName: '',
      newEmployeePassword: '',
      // TODO: will need to delete the below because business id will come from state
      newEmployeeBusiness: 'Hack Reactor',
    };
  }

  componentWillUnmount() {
    this.props.leaveAddEmployee();
  }

  render() {
    return (
      <div>
        <h4>Create a new employee</h4>
        <p>Please create a username and a temporary password for your employee's account.</p>
        <label className="credentials-label">Username:</label>
        <input
          className="credentials-input"
          type="text"
          value={this.state.newEmployeeName}
          onChange={e => this.setState({ newEmployeeName: e.target.value })}
        />
        <br></br>
        <label className="credentials-label">Password:</label>
        <input
          className="credentials-input"
          type="text"
          value={this.state.newEmployeePassword}
          onChange={e => this.setState({ newEmployeePassword: e.target.value })}
        />
        <div className="btn-credentials">
          <button
            className="btn-main clickable"
            onClick={() => {
              this.props.addEmployee(
                this.state.newEmployeeName, this.state.newEmployeePassword,
              // will need to change the below to pull employee businessID from application state
                this.state.newEmployeeBusiness,
              );
              this.setState({
                newEmployeeName: '',
                newEmployeePassword: '',
              });
            }}
          >Add
          </button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addEmployee,
    leaveAddEmployee,
  }, dispatch);
}

AddEmployee.propTypes = {
  addEmployee: PropTypes.func.isRequired,
  leaveAddEmployee: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(AddEmployee);
