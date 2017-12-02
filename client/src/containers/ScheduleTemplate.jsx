import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateNeededEmployees } from '../actions/index';
import { createScheduleTemplate } from '../actions/index';
import { createScheduleDate } from '../actions/index';
import _ from 'underscore';
import moment from 'moment';
import PropTypes from 'prop-types';

class ScheduleTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newSchedule: {},
      newDate: null,
      scheduleTempExist: false,
    }
  }

  componentWillMount() {
    this.setState({
      newDate: this.props.selectedWeek,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.schedule != this.props.schedule) {
      const newSchedule = _.clone(nextProps.schedule.neededEmployees);
      this.setState({
        newSchedule: newSchedule,
      })
    }
    if (nextProps.selectedWeek != this.props.selectedWeek) {
      this.setState({
        newDate: nextProps.selectedWeek,
      })
    }
  }

  alterDay = (e, dayPart) => {   
    let schedule = this.state.newSchedule;
    schedule[dayPart] = e.target.value ? parseInt(e.target.value) : e.target.value;
    this.setState({
      newSchedule: schedule
    })
  }

  mapDayPartsAsInputs = (dayPart, idx) => {
    return (
      <td
      key={`${this.props.monDate}${dayPart}`}>
        <input onChange={(e) => this.alterDay(e, dayPart)} name={dayPart} className="schedule-input-box" type="text" value={this.state.newSchedule[dayPart]}/>
      </td>
    );
  }

  handleSaveClick(mode) {
    if (mode === 'create') {
      this.props.createScheduleTemplate(this.state.newDate, this.state.newSchedule, this.props.businessId)
        .then(() => {
          this.setState({
            scheduleTempExist: true,
          })
        });
    } else {
      this.props.updateNeededEmployees(this.props.schedule, this.state.newSchedule);
    }
  }

  render() {
    let renderBody;
    if(!this.props.schedule) {
      renderBody = (
        <h4>Please select a schedule</h4>
      );
    } else {

      let morningParts = Object.keys(this.state.newSchedule).filter((dayPart) => {
        return dayPart % 2 !== 0;
      }).map(this.mapDayPartsAsInputs);

      let afternoonParts = Object.keys(this.state.newSchedule).filter((dayPart) => {
        return dayPart % 2 === 0;
      }).map(this.mapDayPartsAsInputs);

      if (this.props.schedule.id) {
        renderBody = (
          <div>
            <table className="select-days-table">
              <tbody>
                <tr>
                  <th scope="row"></th>
                  <th scope="col">Mon</th>
                  <th scope="col">Tue</th>
                  <th scope="col">Wed</th>
                  <th scope="col">Thu</th>
                  <th scope="col">Fri</th>
                  <th scope="col">Sat</th>
                  <th scope="col">Sun</th>
                </tr>
                <tr>
                  <th scope="row">AM</th>
                  {morningParts}  
                </tr>
                <tr>
                  <th scope="row">PM</th>
                  {afternoonParts}
                </tr>
              </tbody>
            </table>
            <div className="employee-editor-save-btn">
              <button 
              className="btn-main clickable"
              onClick={() => this.handleSaveClick('update')}
              >
                Save
              </button>
            </div>
          </div>
        );
      } else {
        renderBody = (
          <div>
            <table className="select-days-table">
              <tbody>
                <tr>
                  <th scope="row"></th>
                  <th scope="col">Mon</th>
                  <th scope="col">Tue</th>
                  <th scope="col">Wed</th>
                  <th scope="col">Thu</th>
                  <th scope="col">Fri</th>
                  <th scope="col">Sat</th>
                  <th scope="col">Sun</th>
                </tr>
                <tr>
                  <th scope="row">AM</th>
                  {morningParts}  
                </tr>
                <tr>
                  <th scope="row">PM</th>
                  {afternoonParts}
                </tr>
              </tbody>
            </table>
            <div className="employee-editor-save-btn">
              <button 
              className="btn-main clickable"
              onClick={() => this.handleSaveClick('create')}
              >
                Save
              </button>
            </div>
          </div>
        );   
      }
    }
    return (
      <div>
        {renderBody}
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    businessId: state.businessId,
    selectedWeek: state.selectedWeek,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateNeededEmployees: updateNeededEmployees,
    createScheduleDate: createScheduleDate,
    createScheduleTemplate: createScheduleTemplate,
  }, dispatch);
}

ScheduleTemplate.propTypes = {
  updateNeededEmployees: PropTypes.func.isRequired,
  createScheduleDate: PropTypes.func,
  createScheduleTemplate: PropTypes.func.isRequired,
  selectedWeek: PropTypes.string.isRequired,
  schedule: PropTypes.object,
  monDate: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleTemplate);
