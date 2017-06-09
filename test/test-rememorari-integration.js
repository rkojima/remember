const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {User} = require('../models/user');
const {Book} = require('../models/book');
const {Timer} = require('../models/timer');
const {Note} = require('../models/note');
const {app} = require('../server');

chai.use(chaiHttp);

describe("Rememorari API", function() {
    describe("GET endpoint", function() {
        it("should give me a 200 status", function() {
            return chai.request(app) 
                .get('/signup')
                .then(function(_res) {
                    res = _res;
                    res.should.have.status(200);
                });
        });
        it("should redirect me to the login page if not signed in", function() {
            return chai.request(app)
                .get('/dashboard')
                .then(function(_res) {
                    res = _res;
                    res.header['location'].should.include('/login');
                });
        });
    });
});