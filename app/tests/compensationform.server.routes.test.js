'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Compensationform = mongoose.model('Compensationform'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, compensationform;

/**
 * Compensationform routes tests
 */
describe('Compensationform CRUD tests', function() {
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

		// Save a user to the test db and create new Compensationform
		user.save(function() {
			compensationform = {
				name: 'Compensationform Name'
			};

			done();
		});
	});

	it('should be able to save Compensationform instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compensationform
				agent.post('/compensationforms')
					.send(compensationform)
					.expect(200)
					.end(function(compensationformSaveErr, compensationformSaveRes) {
						// Handle Compensationform save error
						if (compensationformSaveErr) done(compensationformSaveErr);

						// Get a list of Compensationforms
						agent.get('/compensationforms')
							.end(function(compensationformsGetErr, compensationformsGetRes) {
								// Handle Compensationform save error
								if (compensationformsGetErr) done(compensationformsGetErr);

								// Get Compensationforms list
								var compensationforms = compensationformsGetRes.body;

								// Set assertions
								(compensationforms[0].user._id).should.equal(userId);
								(compensationforms[0].name).should.match('Compensationform Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Compensationform instance if not logged in', function(done) {
		agent.post('/compensationforms')
			.send(compensationform)
			.expect(401)
			.end(function(compensationformSaveErr, compensationformSaveRes) {
				// Call the assertion callback
				done(compensationformSaveErr);
			});
	});

	it('should not be able to save Compensationform instance if no name is provided', function(done) {
		// Invalidate name field
		compensationform.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compensationform
				agent.post('/compensationforms')
					.send(compensationform)
					.expect(400)
					.end(function(compensationformSaveErr, compensationformSaveRes) {
						// Set message assertion
						(compensationformSaveRes.body.message).should.match('Please fill Compensationform name');
						
						// Handle Compensationform save error
						done(compensationformSaveErr);
					});
			});
	});

	it('should be able to update Compensationform instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compensationform
				agent.post('/compensationforms')
					.send(compensationform)
					.expect(200)
					.end(function(compensationformSaveErr, compensationformSaveRes) {
						// Handle Compensationform save error
						if (compensationformSaveErr) done(compensationformSaveErr);

						// Update Compensationform name
						compensationform.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Compensationform
						agent.put('/compensationforms/' + compensationformSaveRes.body._id)
							.send(compensationform)
							.expect(200)
							.end(function(compensationformUpdateErr, compensationformUpdateRes) {
								// Handle Compensationform update error
								if (compensationformUpdateErr) done(compensationformUpdateErr);

								// Set assertions
								(compensationformUpdateRes.body._id).should.equal(compensationformSaveRes.body._id);
								(compensationformUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Compensationforms if not signed in', function(done) {
		// Create new Compensationform model instance
		var compensationformObj = new Compensationform(compensationform);

		// Save the Compensationform
		compensationformObj.save(function() {
			// Request Compensationforms
			request(app).get('/compensationforms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Compensationform if not signed in', function(done) {
		// Create new Compensationform model instance
		var compensationformObj = new Compensationform(compensationform);

		// Save the Compensationform
		compensationformObj.save(function() {
			request(app).get('/compensationforms/' + compensationformObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', compensationform.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Compensationform instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Compensationform
				agent.post('/compensationforms')
					.send(compensationform)
					.expect(200)
					.end(function(compensationformSaveErr, compensationformSaveRes) {
						// Handle Compensationform save error
						if (compensationformSaveErr) done(compensationformSaveErr);

						// Delete existing Compensationform
						agent.delete('/compensationforms/' + compensationformSaveRes.body._id)
							.send(compensationform)
							.expect(200)
							.end(function(compensationformDeleteErr, compensationformDeleteRes) {
								// Handle Compensationform error error
								if (compensationformDeleteErr) done(compensationformDeleteErr);

								// Set assertions
								(compensationformDeleteRes.body._id).should.equal(compensationformSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Compensationform instance if not signed in', function(done) {
		// Set Compensationform user 
		compensationform.user = user;

		// Create new Compensationform model instance
		var compensationformObj = new Compensationform(compensationform);

		// Save the Compensationform
		compensationformObj.save(function() {
			// Try deleting Compensationform
			request(app).delete('/compensationforms/' + compensationformObj._id)
			.expect(401)
			.end(function(compensationformDeleteErr, compensationformDeleteRes) {
				// Set message assertion
				(compensationformDeleteRes.body.message).should.match('User is not logged in');

				// Handle Compensationform error error
				done(compensationformDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Compensationform.remove().exec();
		done();
	});
});