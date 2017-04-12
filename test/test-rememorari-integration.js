const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {User} = require('../models/user');
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
    });
});