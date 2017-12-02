import axios from 'axios';

/**
|--------------------------------------------------
|  START OF NEW ACTION CREATORS
|--------------------------------------------------
*/
const deleteShift = (shift, userId, scheduleId) => {
  const payload = {
    userId,
    shift,
    scheduleId,
  };
  return {
    type: 'DELETE_SHIFT',
    payload,
  };
};

const addShift = (shift, userId, scheduleId) => {
  const payload = {
    userId,
    shift,
    scheduleId,
  };
  return {
    type: 'ADD_SHIFT',
    payload,
  };
};

const savePreferences = (scheduleActual) => {
  const response = axios.post('/savePreferences', scheduleActual);
  return {
    type: 'SAVE_PREFERENCES',
    payload: response,
  };
};

/**
|--------------------------------------------------
| END OF NEW ACTION CREATORS
|--------------------------------------------------
*/

const getAllUsers = () => {
  const response = axios.get('/users');

  return {
    type: 'GET_USERS',
    payload: response,
  };
};

const getAllScheduleDates = () => {
  const response = axios.get('/schedule_dates');

  return {
    type: 'GET_SCHEDULE_DATES',
    payload: response,
  };
};

const getAllEmployeeAvailabilities = () => {
  const response = axios.get('/employee_availabilities');

  return {
    type: 'GET_EMPLOYEE_AVAILABILITIES',
    payload: response,
  };
};

const getAllDayParts = () => {
  const response = axios.get('/day_parts');

  return {
    type: 'GET_DAY_PARTS',
    payload: response,
  };
};


const getAllNeededEmployees = () => {
  const response = axios.get('/needed_employees');

  return {
    type: 'GET_NEEDED_EMPLOYEES',
    payload: response,
  };
};


const generateSchedule = (mondayDate) => {
  const response = axios.post('/generate_schedule', { mondayDate });

  return {
    type: 'GET_ACTUAL_SCHEDULE',
    payload: response,
  }
};

const addEmployee = (username, password, business) => {
  const response = axios.post('/add_employee', { username, password, business });
  return {
    type: 'ADD_EMPLOYEE',
    payload: response,
  };
};

const leaveAddEmployee = () => {
  return {
    type: 'LEAVE_ADD_EMPLOYEE',
  };
};

const updateEmployeeAvailability = (employee, newAvailabilities) => {
  const requestBody = Object.keys(newAvailabilities).map((dayPartId) => {
    return { 
      user_id: employee.id, 
      day_part_id: dayPartId, 
      is_available: newAvailabilities[dayPartId] 
    };
  });

  const response = axios.patch('/employee_availability', {
    employeeAvailabilities: requestBody,
  });

  return {
    type: 'UPDATE_EMPLOYEE_AVAILABILITY',
    payload: response,
  };
};

const updateNeededEmployees = (schedule, newAvailabilities) => {
  const requestBody = Object.keys(newAvailabilities).map((dayPartId) => {
    return { schedule_id: schedule.id, day_part_id: dayPartId, employees_needed: newAvailabilities[dayPartId] };
  });

  const response = axios.patch('/needed_employees', {
    scheduleAvailabilities: requestBody,
  });

  return {
    type: 'UPDATE_NEEDED_EMPLOYEES',
    payload: response,
  };
};

const createScheduleTemplate = (monDate, scheduleTemplate) => {
  const requestBody = Object.keys(scheduleTemplate).map((dayPartId) => {
    return { 
      monday_dates: monDate, day_part_id: dayPartId, 
      employees_needed: scheduleTemplate[dayPartId] };
  });

  const response = axios.post('/needed_employees', {
    scheduleTemplate: requestBody
  });

  return {
    type: 'CREATE_SCHEDULE_TEMPLATE',
    payload: response,
  };
};

const changeView = (newView) => {
  return {
    type: 'CHANGE_VIEW',
    view: newView,
  }
};

const login = (creds) => {
  const response = axios.post('/login', { creds })
  return {
    type: 'GET_ALL',
    payload: response,
  }
};

const signUp = (creds) => {
  const response = axios.post('/signup', { creds });
  return {
    type: 'GET_ALL',
    payload: response,
  }
};

const logout = () => {
const response = axios.post('/logout');

  return {
    type: 'REMOVE_LOGGED_IN_DETAILS',
    payload: response,
  }
};

const checkedIfLoggedIn = () => {
  const response = axios.get('/welcome_back');

  return {
    type: 'GET_ALL',
    payload: response,
  }
};

const selectWeek = (monDate) => {
  return {
    type: 'SELECT_WEEK',
    payload: monDate,
  };
};

module.exports = {
  savePreferences,
  deleteShift,
  addShift,
  logout,
  checkedIfLoggedIn,
  generateSchedule,
  updateEmployeeAvailability,
  getAllUsers,
  getAllEmployeeAvailabilities,
  getAllDayParts,
  getAllNeededEmployees,
  updateNeededEmployees,
  getAllScheduleDates,
  createScheduleTemplate,
  addEmployee,
  leaveAddEmployee,
  changeView,
  login,
  signUp,
  selectWeek,
};
