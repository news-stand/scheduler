const Sequelize = require('sequelize');
const config = require('./config.js');
const Promise = require('bluebird');
require('dotenv').config();

console.log('database url', process.env.DATABASE_URL);

const sequelize = new Sequelize('postgres://uizpiefw:Le-BGdBSsUKodU66n06bx7SE41x-FGv0@baasu.db.elephantsql.com:5432/uizpiefw', {
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const db = config(sequelize);

db.User.hasMany(db.Session, { as: 'session' });

// One-to-Many Relationships
db.User.hasMany(db.Actual_Schedule, { as: 'actual_schedule' });
db.User.hasMany(db.Employee_Availability, { as: 'employee_availability' });

db.Schedule.hasMany(db.Actual_Schedule, { as: 'actual_schedule' });
db.Schedule.hasMany(db.Needed_Employee, { as: 'needed_employee' });

db.Day_Part.hasMany(db.Employee_Availability, { as: 'employee_availability' });
db.Day_Part.hasMany(db.Actual_Schedule, { as: 'actual_schedule' });
db.Day_Part.hasMany(db.Needed_Employee, { as: 'needed_employee' });

// drops all table, just put it in so that it doesn't give an error
// for creating the same table everytime during dev

db.User.sync()
  .then(() => {
    return db.Schedule.sync();
  })
  .then(() => {
    return db.Day_Part.sync();
  })
  .then(() => {
    return db.Employee_Availability.sync();
  })
  .then(() => {
    return db.Actual_Schedule.sync();
  })
  .then(() => {
    return db.Needed_Employee.sync();
  })
  .then(() => {
    return db.Session.sync();
  })
  .then(() => {
    return saveDayParts(dayParts);
  });

const dayParts = [
  'monA', 'monP',
  'tuesA', 'tuesP',
  'wedsA', 'wedsP',
  'thursA', 'thursP',
  'friA', 'friP',
  'satA', 'satP',
  'sunA', 'sunP',
];

let saveDayParts = (dayParts) => {
	return Promise.each(dayParts, (dayPart) => {
		db.Day_Part.create({ name: dayPart })
			.catch((err) => {
				console.log('day parts saved');
			});
	})
};

module.exports = {
  User: db.User,
  Schedule: db.Schedule,
  Employee_Availability: db.Employee_Availability,
  Actual_Schedule: db.Actual_Schedule,
  Needed_Employee: db.Needed_Employee,
  Day_Part: db.Day_Part,
  sequelize: sequelize,
  Sessions: db.Session,
};
