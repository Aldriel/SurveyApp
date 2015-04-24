'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Patientcrf = mongoose.model('Patientcrf'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, patientcrf;

/**
 * Patientcrf routes tests
 */
describe('Patientcrf CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Patientcrf
		user.save(function() {
			patientcrf = {
				name: 'Patientcrf Name'
			};

			done();
		});
	});

	it('should be able to save Patientcrf instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patientcrf
				agent.post('/patientcrves')
					.send(patientcrf)
					.expect(200)
					.end(function(patientcrfSaveErr, patientcrfSaveRes) {
						// Handle Patientcrf save error
						if (patientcrfSaveErr) done(patientcrfSaveErr);

						// Get a list of Patientcrves
						agent.get('/patientcrves')
							.end(function(patientcrvesGetErr, patientcrvesGetRes) {
								// Handle Patientcrf save error
								if (patientcrvesGetErr) done(patientcrvesGetErr);

								// Get Patientcrves list
								var patientcrves = patientcrvesGetRes.body;

								// Set assertions
								(patientcrves[0].user._id).should.equal(userId);
								(patientcrves[0].name).should.match('Patientcrf Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Patientcrf instance if not logged in', function(done) {
		agent.post('/patientcrves')
			.send(patientcrf)
			.expect(401)
			.end(function(patientcrfSaveErr, patientcrfSaveRes) {
				// Call the assertion callback
				done(patientcrfSaveErr);
			});
	});

	it('should not be able to save Patientcrf instance if no name is provided', function(done) {
		// Invalidate name field
		patientcrf.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patientcrf
				agent.post('/patientcrves')
					.send(patientcrf)
					.expect(400)
					.end(function(patientcrfSaveErr, patientcrfSaveRes) {
						// Set message assertion
						(patientcrfSaveRes.body.message).should.match('Please fill Patientcrf name');
						
						// Handle Patientcrf save error
						done(patientcrfSaveErr);
					});
			});
	});

	it('should be able to update Patientcrf instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patientcrf
				agent.post('/patientcrves')
					.send(patientcrf)
					.expect(200)
					.end(function(patientcrfSaveErr, patientcrfSaveRes) {
						// Handle Patientcrf save error
						if (patientcrfSaveErr) done(patientcrfSaveErr);

						// Update Patientcrf name
						patientcrf.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Patientcrf
						agent.put('/patientcrves/' + patientcrfSaveRes.body._id)
							.send(patientcrf)
							.expect(200)
							.end(function(patientcrfUpdateErr, patientcrfUpdateRes) {
								// Handle Patientcrf update error
								if (patientcrfUpdateErr) done(patientcrfUpdateErr);

								// Set assertions
								(patientcrfUpdateRes.body._id).should.equal(patientcrfSaveRes.body._id);
								(patientcrfUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Patientcrves if not signed in', function(done) {
		// Create new Patientcrf model instance
		var patientcrfObj = new Patientcrf(patientcrf);

		// Save the Patientcrf
		patientcrfObj.save(function() {
			// Request Patientcrves
			request(app).get('/patientcrves')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Patientcrf if not signed in', function(done) {
		// Create new Patientcrf model instance
		var patientcrfObj = new Patientcrf(patientcrf);

		// Save the Patientcrf
		patientcrfObj.save(function() {
			request(app).get('/patientcrves/' + patientcrfObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', patientcrf.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Patientcrf instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Patientcrf
				agent.post('/patientcrves')
					.send(patientcrf)
					.expect(200)
					.end(function(patientcrfSaveErr, patientcrfSaveRes) {
						// Handle Patientcrf save error
						if (patientcrfSaveErr) done(patientcrfSaveErr);

						// Delete existing Patientcrf
						agent.delete('/patientcrves/' + patientcrfSaveRes.body._id)
							.send(patientcrf)
							.expect(200)
							.end(function(patientcrfDeleteErr, patientcrfDeleteRes) {
								// Handle Patientcrf error error
								if (patientcrfDeleteErr) done(patientcrfDeleteErr);

								// Set assertions
								(patientcrfDeleteRes.body._id).should.equal(patientcrfSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Patientcrf instance if not signed in', function(done) {
		// Set Patientcrf user 
		patientcrf.user = user;

		// Create new Patientcrf model instance
		var patientcrfObj = new Patientcrf(patientcrf);

		// Save the Patientcrf
		patientcrfObj.save(function() {
			// Try deleting Patientcrf
			request(app).delete('/patientcrves/' + patientcrfObj._id)
			.expect(401)
			.end(function(patientcrfDeleteErr, patientcrfDeleteRes) {
				// Set message assertion
				(patientcrfDeleteRes.body.message).should.match('User is not logged in');

				// Handle Patientcrf error error
				done(patientcrfDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Patientcrf.remove().exec();
		done();
	});
});