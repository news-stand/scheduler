import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { savePreferences } from '../actions/index';
import EmployeeScheduleManager from './EmployeeScheduleManager.jsx';
import EmployeeSchedule from './EmployeeSchedule.jsx';

const ScheduleActual = (props) => {
  let calendarBody;

  const morningEvenings = [<div key='block' className="ratio-col-8 schedule-block schedule-hours" />];

  for (let i = 0; i < 14; i++) {
    morningEvenings.push(<div key={`${i}shift`} className="ratio-col-16 schedule-block  schedule-hours">{i % 2 === 0 ? 'AM' : 'PM'}</div>);
  }
  // check to see if anyone is assigned a shift
  if (props.selectedWeekActualSchedule.some(user => user.schedule.length > 0)) {
    // map over each employees schedule and return their row of shifts
    calendarBody = props.selectedWeekActualSchedule.map((sched, idx) => {
      return props.userRole === 'manager' ?
        <EmployeeScheduleManager key={`${sched.name}${idx}`} schedule={sched} scheduleId={props.selectedWeekScheduleId} /> :
        <EmployeeSchedule key={`${sched.name}${idx}`} schedule={sched} />;
    });
  } else if (props.weekHasAtLeastOneNeededEmployee) {
    calendarBody = <div className='schedule-prompt'>Generate a schedule for this week when you have finalized your shifts.</div>;
  } else {
    calendarBody = <div className='schedule-prompt'>You have not saved any shifts for this week.</div>;
  }
  return (
    <div className="container clear-fix schedule-actual">
      <div className="schedule-date-header">
        <div className="ratio-col-8 schedule-block " />
        <div className="ratio-col-8 schedule-block ">Mon</div>
        <div className="ratio-col-8 schedule-block ">Tue</div>
        <div className="ratio-col-8 schedule-block ">Wed</div>
        <div className="ratio-col-8 schedule-block ">Thur</div>
        <div className="ratio-col-8 schedule-block ">Fri</div>
        <div className="ratio-col-8 schedule-block ">Sat</div>
        <div className="ratio-col-8 schedule-block ">Sun</div>
        {morningEvenings}
      </div>
      {calendarBody}
      {props.userRole === 'manager' ? <button className="btn-save clickable" onClick={() => props.savePreferences(props.scheduleActual)} >Save Schedule</button> : null }
    </div>
  );
}

ScheduleActual.propTypes = {
  weekHasAtLeastOneNeededEmployee: PropTypes.bool,
  selectedWeekActualSchedule: PropTypes.arrayOf(PropTypes.object).isRequired,
  userRole: PropTypes.string.isRequired,
  savePreferences: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    savePreferences,
  }, dispatch);
}

const mapStateToProps = ({ scheduleActual }) => {
  return { scheduleActual };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleActual);
