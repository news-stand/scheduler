const express = require('express');
const utils = require('../helpers/index.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { generateSchedule } = require('../helpers/algo.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(utils.checkSession);

app.use(express.static(`${__dirname}/../client/dist/compiled`));

app.get('/users', utils.getAllUsers, (req, res) => {
  res.json(req.users);
});

app.get(express.static(`${__dirname}/../client/dist/compiled/favicon.ico`));

app.get('/employee_availabilities', utils.getAllEmployeeAvailabilities, (req, res) => {
  res.json(req.employeeAvailabilities);
});

app.get('/day_parts', utils.getAllDayParts, (req, res) => {
  res.json(req.dayParts);
});

app.get('/needed_employees', utils.getAllNeededEmployees, (req, res) => {
  res.json(req.neededEmployees);
});

app.get('/schedule_dates', utils.getAllScheduleDates, (req, res) => {
  res.json(req.scheduleDates);
});

app.patch('/employee_availability', utils.updateEmployeeAvailability, (req, res) => {
  res.json(req.empoloyeeAvailabilities);
});

app.post('/add_employee', utils.findOrCreateBusiness, utils.addUser, utils.getAllDayParts, utils.addEmployeeAvailability, utils.getAllEmployeeAvailabilities, (req, res) => {
  res.json({
    user: req.user,
    employeeAvailabilities: req.employeeAvailabilities,
  });
});

app.patch('/needed_employees', utils.updateNeededEmployees, (req, res) => {
  res.json(req.scheduleTemplate);
  res.end();
});

app.post('/needed_employees', utils.createScheduleDate, utils.createScheduleTemplate, (req, res) => {
  res.json(req.scheduleTemplate);
});

app.post('/generate_schedule', (req, res) => { 
  generateSchedule(new Date(req.body.mondayDate))
    .then((schedule) => {
      res.json(schedule);
    });
});

app.post('/login', utils.authenticate, /* add middleware to add businessId to req, */ (req, res) => {
  res.redirect('/welcome_back');
});

app.post('/signup', utils.findOrCreateBusiness, utils.createUser, (req, res) => {
  console.log('------------- REQ.BUSINESSID => ', req.businessId);
  res.redirect('/welcome_back');
});

app.post('/logout', utils.destroySession, (req, res) => {
  res.status(200).end();
});

app.get('/welcome_back',
  utils.redirectIfLoggedIn,
  utils.getAllDayParts,
  utils.getAllUsers,
  utils.getAllActualSchedules,
  utils.getAllEmployeeAvailabilities,
  utils.getAllScheduleDates,
  utils.sendEmployeeInfo,
  utils.getAllNeededEmployees,
  (req, res) => {
    const obj = {};
    // add businessId to object
    obj.businessId = req.session.businessId;
    obj.role = req.session.role;
    obj.dayParts = req.dayParts;
    obj.view = 'employeeEditor';
    obj.scheduleActual = req.actual_schedules;
    obj.users = req.users;
    obj.neededEmployees = req.neededEmployees;
    obj.employeeAvailabilities = req.employeeAvailabilities;
    obj.scheduleDates = req.scheduleDates;
    // console.log('--------------------------- inside /welcome_back, this is the obj: ', obj);
    console.log('--------------------------- inside /welcome_back, this is the req.businessId: ', req.session.businessId);
    res.json(obj);
  },
);

module.exports = app;
