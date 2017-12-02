import { combineReducers } from 'redux';
import EmployeeAvailabilitiesReducer from './reducer-employee-availabilities';
import UsersReducer from './reducer-users';
import DayPartsReducer from './reducer-day-parts';
import NeededEmployeesReducer from './reducer-needed-employees';
import ScheduleDatesReducer from './reducer-schedule-dates';
import ScheduleActual from './reducer-schedule-actual';
import SelectedWeekReducer from './reducer-selected-week';
import UserRoleReducer from './reducer-user-role';
import View from './reducer-view';
import FlashMessage from './reducer-flash-message';
import BusinessName from './reducer-business-name';

const rootReducer = combineReducers({
  flashMessage: FlashMessage,
  employeeAvailabilities: EmployeeAvailabilitiesReducer,
  scheduleActual: ScheduleActual,
  userRole: UserRoleReducer,
  users: UsersReducer,
  dayParts: DayPartsReducer,
  neededEmployees: NeededEmployeesReducer,
  scheduleDates: ScheduleDatesReducer,
  selectedWeek: SelectedWeekReducer,
  view: View,
  businessName: BusinessName,
});

export default rootReducer;
