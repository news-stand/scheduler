import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';

import EmployeeEditor from '../containers/EmployeeEditor.jsx';
import ScheduleEditor from '../containers/ScheduleEditor.jsx';
import ScheduleGenerator from '../containers/ScheduleGenerator.jsx';
import WeekSelector from '../containers/WeekSelector.jsx';
import ScheduleActual from './ScheduleActual.jsx';
import ShiftTradeEditor from '../containers/ShiftTradeEditor.jsx';
import ShiftTradeSelector from '../containers/ShiftTradeSelector.jsx';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 'employeeEditor',
    };
  }


  renderTab(title, viewType) {
    const selectedStyle = 'ratio-col-2 editor-tab selected-tab';
    const clickableStyle = 'ratio-col-2 editor-tab clickable'

    return (
      <div
        className={this.state.currentView === viewType ? selectedStyle : clickableStyle}
        onClick={() => { 
          this.setState({ currentView: viewType });
        }}
      >
        {title}
      </div>
    );
  }

  renderManagerHeader() {
    return (
      <div className="container clear-fix">
        {this.renderTab('Employees', 'employeeEditor')}
        {this.renderTab('Schedules', 'scheduleEditor')}
      </div>
    );
  }

  renderEmployeeHeader() {
    return (
      <div className="container clear-fix">
        {this.renderTab('Employee', 'employeeEditor')}
        {this.renderTab('Trades', 'scheduleEditor')}
      </div>
    );
  }

  renderScheduleActual() {
    return (
      <ScheduleActual
        selectedWeek={this.props.selectedWeek}
        weekHasActualSchedule={this.props.weekHasActualSchedule}
        weekHasAtLeastOneNeededEmployee={this.props.weekHasAtLeastOneNeededEmployee}
        selectedWeekActualSchedule={this.props.selectedWeekActualSchedule}
        selectedWeekScheduleId={this.props.selectedWeekScheduleId}
        userRole={this.props.userRole}
      />
    );
  }

  renderManagerMain() {
    return (
      <div className="component-block">
        <ScheduleGenerator
          selectedWeek={this.props.selectedWeek}
          weekHasActualSchedule={this.props.weekHasActualSchedule}
          weekHasAtLeastOneNeededEmployee={this.props.weekHasAtLeastOneNeededEmployee}
        />
        {this.renderScheduleActual()}
      </div>
    );
  }

  renderEmployeeMain() {
    return (
      <div className="component-block">
        <div className="schedule-generator clear-fix overlay">
          <div>
            <div>Week of <span className="schedule-generator-date">{moment(this.props.selectedWeek).format('MMMM Do YYYY')}</span></div>
          </div>
        </div>
        {this.renderScheduleActual()}
      </div>
    );
  }

  renderEmployeeEditor() {
    let editorView = (
      <div>
        <WeekSelector />
        <EmployeeEditor />
      </div>
    );

    if (this.state.currentView === 'scheduleEditor') {
      editorView = (
        <div>
          <ShiftTradeSelector />
          <ShiftTradeEditor />
        </div>
      );
    } 

    return editorView;
  }

  renderManagerEditor() {
    let editorView = <EmployeeEditor />;

    if (this.state.currentView === 'scheduleEditor') {
      editorView = <ScheduleEditor />;
    } 
    return editorView;
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className="ratio-col-4 major-component">
          <div className="component-block">
            <div className="editor-header">
              {this.props.userRole === 'manager' ? this.renderManagerHeader() : this.renderEmployeeHeader()}
            </div>
            {this.props.userRole === 'manager' ? this.renderManagerEditor() : this.renderEmployeeEditor()}
          </div>
        </div>
        <div className="ratio-col-4-3 major-component">
          {this.props.userRole === 'manager' ? this.renderManagerMain() : this.renderEmployeeMain()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let scheduleId = null;
  let weekHasActualSchedule = false;
  let weekHasAtLeastOneNeededEmployee = false;
  let actualSchedule = null;

  // check to see if any schedules have been generated
  if (state.scheduleDates) {
    // if any have been, iterate through them and attempt to return
    // the one that matches state.selectedWeek (currently selected week from dropdown menu)
    const selectedWeekObj = state.scheduleDates.find((el) => {
      return el.monday_dates.toString().substr(0, 10) === state.selectedWeek;
    });
    // if a match was found (i.e. the current week has a generated schedule),
    // pass the schedule's id, otherwise pass null
    scheduleId = selectedWeekObj ? selectedWeekObj.id : null;
  }

  // Check to see if a week was found (logic from above)
  if (scheduleId) {
    // if it was, go find that weeks actual schedule from state
    const scheduleFound = state.scheduleActual.find((el) => {
      return el.schedule_id === scheduleId;
    });

    // check to see if an actual schedule was found
    if (scheduleFound) {
      // if it was, find it and assign it to actualSchedule
      weekHasActualSchedule = true;
      actualSchedule = state.scheduleActual.filter((el) => {
        return el.schedule_id === scheduleId;
      });
    }

    // check if there are any needed employees (for any week)
    if (state.neededEmployees) {
      // find numner of needed employees for current week (filter + reduce)
      const countOfNeededEmployees = state.neededEmployees.filter((el) => {
        return el.schedule_id === scheduleId;
      }).reduce((acc, el) => {
        return acc + el.employees_needed;
      }, 0);
      // check if any employees are needed for current week
      if (countOfNeededEmployees > 0) {
        weekHasAtLeastOneNeededEmployee = true;
      }
    }
  }


  const schedules = {};
  let scheduleArr = [];

  // check if there is an actual schedule set for the week
  if (actualSchedule) {
    // loop over schedules for the week (each schedule is specific to a person's shift)
    actualSchedule.forEach((e) => {
      if (e.user_id === null) {
        // if user id is null, it is a house shift
        schedules['HOUSE'] = schedules['HOUSE'] || [];
        // push the shift identifier into array (specifies AM vs PM and day of week [1-14])
        schedules['HOUSE'].push(e.day_part_id);
      } else {
        // push the shift identifier into an array of the specific employee
        schedules[e.user_id] = schedules[e.user_id] || [];
        schedules[e.user_id].push(e.day_part_id);
      }
    });

    const keys = Object.keys(schedules);
    for (let i = 0; i < keys.length; i += 1) {
      const schedObj = {};
      if (keys[i] === 'HOUSE') {
        schedObj.name = 'HOUSE';
        schedObj.schedule = schedules[keys[i]];
      } else {
        schedObj.name = state.users.filter((user) => {
          // user.id is an integer and keys[i] is a string
          return user.id == keys[i];
        })[0].name;
        schedObj.userId = keys[i];
        schedObj.schedule = schedules[keys[i]];
      }

      scheduleArr.push(schedObj);
    }
  }

  state.users.forEach((user) => {
    if (!scheduleArr.some(person => person.name === user.name)) {
      scheduleArr.push({ name: user.name, userId: user.id.toString(), schedule: [] });
    }
  });

  scheduleArr = scheduleArr.sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  });

  return {
    userRole: state.userRole,
    selectedWeek: state.selectedWeek,
    selectedWeekScheduleId: scheduleId,
    weekHasActualSchedule: weekHasActualSchedule,
    weekHasAtLeastOneNeededEmployee: weekHasAtLeastOneNeededEmployee,
    selectedWeekActualSchedule: scheduleArr,
  };
}

  Dashboard.propTypes = {
  userRole: PropTypes.string.isRequired,
  selectedWeekScheduleId: PropTypes.number,
  weekHasActualSchedule: PropTypes.bool.isRequired,
  weekHasAtLeastOneNeededEmployee: PropTypes.bool.isRequired,
  selectedWeekActualSchedule: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedWeek: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Dashboard);
