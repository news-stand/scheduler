const expect = require('chai').expect;
const pg = require('pg');
const Sequelize = require('sequelize');
const Promise = require('bluebird');
require('dotenv').config();

/*
Mock 'http' objects for testing Express routing functions, but could be used for testing any Node.js web server applications that have code that requires mockups of the request and response objects
*/
const httpMocks = require('node-mocks-http');
const request = require('supertest'); //used for testing http
//require the necessary files
const app = require('../server/app.js');
const schema = require('../database/config.js');
const algo = require('../helpers/algo.js');
const utils = require('../helpers/index.js');
const port = process.env.PORT || 8080;

describe('Shiftly Backend Test Spec', () => {

  let sequelize;
  let server;
  let db;

  before((done) => {
    sequelize = new Sequelize(process.env.DB_NAME || 'shiftly', process.env.DB_USER || 'postgres', process.env.DB_PASS || null, { host: process.env.DB_HOST || 'localhost', dialect: 'postgres' });
    // debugger
    db = schema(sequelize);
    db.User.hasMany(db.Actual_Schedule, { as: 'actual_schedule'});
    db.User.hasMany(db.Employee_Availability, { as: 'employee_availability' });
    db.Employee_Availability.belongsTo(db.User);
    db.Schedule.hasMany(db.Actual_Schedule, { as: 'actual_schedule'});
    db.Schedule.hasMany(db.Needed_Employee, { as: 'needed_employee' });

    db.Day_Part.hasMany(db.Employee_Availability, { as: 'employee_availability' });
    db.Day_Part.hasMany(db.Actual_Schedule, { as: 'actual_schedule' });
    db.Day_Part.hasMany(db.Needed_Employee, { as: 'needed_employee' });

    setTimeout(done, 1000);
  })

  beforeEach((done) => {

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    
    const tables = ['User', 'Schedule', 'Needed_Employee', 'Employee_Availability', 'Actual_Schedule'];
    Promise.each(tables, table => {
      return db[table].destroy({ where: {} });
    })
    .then(() => {
      server = app.listen(port, done);
    });
    
    afterEach(() => {
      server.close();
    });
  });

  describe('Server Routing:', () => {
    it('should get 200 response with /add_employee endpoint', (done) => {
      request(app)
        .post('/add_employee')
        .set('Content-Type', 'application/json')
        .send({
          username: 'Bob',
        })
        .expect(200, done);
    });

    it('adding a new employee creates a new user record', (done) => {
      request(app)
        .post('/add_employee')
        .set('Content-Type', 'application/json')
        .send({
          username: 'Alice',
        })
        .end((err, res) => {
          if (err) { throw err; }
          expect(res.body.user.name).to.equal('Alice');
          done();
        });
    });

    it('should get a 200 response for getAllUsers request', function(done) {
      request(app)
        .get('/users')
        .expect(200, done);
    });
  });

  describe('Middleware:', () => {
    it('adding a new employee creates a employee availability records for the new employee', (done) => {
      request(app)
        .post('/add_employee')
        .set('Content-Type', 'application/json')
        .send({
          username: 'Alice',
        })
        .end((err) => {
          if (err) { done(err); }
          return db.Employee_Availability.findAll({
            where: { '$user.name$': 'Alice' },
            include: [{
              model: db.User,
            }],
          })
            .then((results) => {
              expect(results).to.not.be.empty;
              done();
            })
            .catch(error =>
              done(error));
        });
    });
  });

  describe('Algo', () => {

    let allEmployeeAvail = {
      '1': [ 1, 2, 5, 6, 7, 8, 9, 10 ],
      '2': [ 1, 2, 5, 6, 7, 8, 10 ],
      '3': [ 1, 2, 5, 6, 7, 8, 9, 10 ],
      '4': [ 2, 5, 6, 7 ],
      '5': [ 1, 3, 4, 5, 6, 7, 8, 9, 10 ],
      '6': [ 1, 4, 6, 7, 8, 10 ],
      '7': [ 1, 3, 5, 6, 7, 8, 9, 10 ],
      '8': [ 5, 6, 10 ],
      '9': [ 1, 3, 4, 5, 6, 7, 8, 9, 10 ],
      '10': [ 1, 3, 4, 5, 6, 7, 8, 10 ],
      '11': [ 1, 3, 4, 5, 6, 7, 8, 9, 10 ],
      '12': [ 1, 3, 4, 5, 6, 8, 9, 10 ],
      '13': [ 2, 4, 6, 7, 9 ],
      '14': [ 2, 4, 5, 6, 7 ], 
    };

    let temp = {
      '1': 1,
      '2': 2,
      '3': 2,
      '4': 2,
      '5': 2,
      '6': 3,
      '7': 2,
      '8': 4,
      '9': 3,
      '10': 5,
      '11': 4,
      '12': 5,
      '13': 3,
      '14': 2 
    };

    let result = algo.scheduleGenerator(allEmployeeAvail, temp);

    it('algo should return an array', function(){
      expect(result).to.be.a('object');
    });

    it('algo should schedule exactly as many servers as specified', function(){
      expect(result['1']).to.have.lengthOf(temp['1']);
      expect(result['2']).to.have.lengthOf(temp['2']);
      expect(result['3']).to.have.lengthOf(temp['3']);
      expect(result['4']).to.have.lengthOf(temp['4']);
      expect(result['5']).to.have.lengthOf(temp['5']);
      expect(result['6']).to.have.lengthOf(temp['6']);
      expect(result['7']).to.have.lengthOf(temp['7']);
      expect(result['8']).to.have.lengthOf(temp['8']);
      expect(result['9']).to.have.lengthOf(temp['9']);
      expect(result['10']).to.have.lengthOf(temp['10']);
      expect(result['11']).to.have.lengthOf(temp['11']);
      expect(result['12']).to.have.lengthOf(temp['12']);
      expect(result['13']).to.have.lengthOf(temp['13']);
      expect(result['14']).to.have.lengthOf(temp['14']);
    });

    it('algo should not schedule employees on days they aren\'t available', function () {
      expect(result['4'].indexOf(1)).to.equal(-1);
      expect(result['8'].indexOf(1)).to.equal(-1);
      expect(result['13'].indexOf(1)).to.equal(-1);
      expect(result['14'].indexOf(1)).to.equal(-1);

      expect(result['5'].indexOf(2)).to.equal(-1);
      expect(result['6'].indexOf(2)).to.equal(-1);
      expect(result['7'].indexOf(2)).to.equal(-1);
      expect(result['8'].indexOf(2)).to.equal(-1);
      expect(result['9'].indexOf(2)).to.equal(-1);
      expect(result['10'].indexOf(2)).to.equal(-1);
      expect(result['11'].indexOf(2)).to.equal(-1);
      expect(result['12'].indexOf(2)).to.equal(-1);

      expect(result['1'].indexOf(3)).to.equal(-1);
      expect(result['2'].indexOf(3)).to.equal(-1);
      expect(result['3'].indexOf(3)).to.equal(-1);
      expect(result['4'].indexOf(3)).to.equal(-1);
      expect(result['6'].indexOf(3)).to.equal(-1);
      expect(result['8'].indexOf(3)).to.equal(-1);
      expect(result['13'].indexOf(3)).to.equal(-1);
      expect(result['14'].indexOf(3)).to.equal(-1);

      expect(result['1'].indexOf(4)).to.equal(-1);
      expect(result['2'].indexOf(4)).to.equal(-1);
      expect(result['3'].indexOf(4)).to.equal(-1);
      expect(result['4'].indexOf(4)).to.equal(-1);
      expect(result['7'].indexOf(4)).to.equal(-1);
      expect(result['8'].indexOf(4)).to.equal(-1);

      expect(result['6'].indexOf(5)).to.equal(-1);
      expect(result['13'].indexOf(5)).to.equal(-1);

      expect(result['8'].indexOf(7)).to.equal(-1);
      expect(result['12'].indexOf(7)).to.equal(-1);
      
      expect(result['4'].indexOf(8)).to.equal(-1);
      expect(result['8'].indexOf(8)).to.equal(-1);
      expect(result['13'].indexOf(8)).to.equal(-1);
      expect(result['14'].indexOf(8)).to.equal(-1);

      expect(result['2'].indexOf(9)).to.equal(-1);
      expect(result['4'].indexOf(9)).to.equal(-1);
      expect(result['6'].indexOf(9)).to.equal(-1);
      expect(result['8'].indexOf(9)).to.equal(-1);
      expect(result['10'].indexOf(9)).to.equal(-1);
      expect(result['14'].indexOf(9)).to.equal(-1);

      expect(result['4'].indexOf(10)).to.equal(-1);
      expect(result['13'].indexOf(10)).to.equal(-1);
      expect(result['14'].indexOf(10)).to.equal(-1);
    });

    it('algo should autofill house shift if not enough employees are available', function(){
      expect(result['8'].indexOf('house')).to.not.equal(-1);
    })
  });
});