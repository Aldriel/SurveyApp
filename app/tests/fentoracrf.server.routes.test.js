'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fentoracrf = mongoose.model('Fentoracrf'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, fentoracrf;

/**
 * Fentoracrf routes tests
 */
describe('Fentoracrf CRUD tests', function() {
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

		// Save a user to the test db and create new Fentoracrf
		user.save(function() {
			fentoracrf = {
				name: 'Fentoracrf Name'
			};

			done();
		});
	});

	it('should be able to save Fentoracrf instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fentoracrf
				agent.post('/fentoracrf')
					.send(fentoracrf)
					.expect(200)
					.end(function(fentoracrfSaveErr, fentoracrfSaveRes) {
						// Handle Fentoracrf save error
						if (fentoracrfSaveErr) done(fentoracrfSaveErr);

						// Get a list of Fentoracrf
						agent.get('/fentoracrf')
							.end(function(fentoracrfGetErr, fentoracrfGetRes) {
								// Handle Fentoracrf save error
								if (fentoracrfGetErr) done(fentoracrfGetErr);

								// Get Fentoracrf list
								var fentoracrf = fentoracrfGetRes.body;

								// Set assertions
								(fentoracrf[0].user._id).should.equal(userId);
								(fentoracrf[0].name).should.match('Fentoracrf Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Fentoracrf instance if not logged in', function(done) {
		agent.post('/fentoracrf')
			.send(fentoracrf)
			.expect(401)
			.end(function(fentoracrfSaveErr, fentoracrfSaveRes) {
				// Call the assertion callback
				done(fentoracrfSaveErr);
			});
	});

	it('should not be able to save Fentoracrf instance if no name is provided', function(done) {
		// Invalidate name field
		fentoracrf.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fentoracrf
				agent.post('/fentoracrf')
					.send(fentoracrf)
					.expect(400)
					.end(function(fentoracrfSaveErr, fentoracrfSaveRes) {
						// Set message assertion
						(fentoracrfSaveRes.body.message).should.match('Please fill Fentoracrf name');
						
						// Handle Fentoracrf save error
						done(fentoracrfSaveErr);
					});
			});
	});

	it('should be able to update Fentoracrf instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fentoracrf
				agent.post('/fentoracrf')
					.send(fentoracrf)
					.expect(200)
					.end(function(fentoracrfSaveErr, fentoracrfSaveRes) {
						// Handle Fentoracrf save error
						if (fentoracrfSaveErr) done(fentoracrfSaveErr);

						// Update Fentoracrf name
						fentoracrf.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Fentoracrf
						agent.put('/fentoracrf/' + fentoracrfSaveRes.body._id)
							.send(fentoracrf)
							.expect(200)
							.end(function(fentoracrfUpdateErr, fentoracrfUpdateRes) {
								// Handle Fentoracrf update error
								if (fentoracrfUpdateErr) done(fentoracrfUpdateErr);

								// Set assertions
								(fentoracrfUpdateRes.body._id).should.equal(fentoracrfSaveRes.body._id);
								(fentoracrfUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Fentoracrf if not signed in', function(done) {
		// Create new Fentoracrf model instance
		var fentoracrfObj = new Fentoracrf(fentoracrf);

		// Save the Fentoracrf
		fentoracrfObj.save(function() {
			// Request Fentoracrf
			request(app).get('/fentoracrf')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Fentoracrf if not signed in', function(done) {
		// Create new Fentoracrf model instance
		var fentoracrfObj = new Fentoracrf(fentoracrf);

		// Save the Fentoracrf
		fentoracrfObj.save(function() {
			request(app).get('/fentoracrf/' + fentoracrfObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', fentoracrf.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Fentoracrf instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Fentoracrf
				agent.post('/fentoracrf')
					.send(fentoracrf)
					.expect(200)
					.end(function(fentoracrfSaveErr, fentoracrfSaveRes) {
						// Handle Fentoracrf save error
						if (fentoracrfSaveErr) done(fentoracrfSaveErr);

						// Delete existing Fentoracrf
						agent.delete('/fentoracrf/' + fentoracrfSaveRes.body._id)
							.send(fentoracrf)
							.expect(200)
							.end(function(fentoracrfDeleteErr, fentoracrfDeleteRes) {
								// Handle Fentoracrf error error
								if (fentoracrfDeleteErr) done(fentoracrfDeleteErr);

								// Set assertions
								(fentoracrfDeleteRes.body._id).should.equal(fentoracrfSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Fentoracrf instance if not signed in', function(done) {
		// Set Fentoracrf user 
		fentoracrf.user = user;

		// Create new Fentoracrf model instance
		var fentoracrfObj = new Fentoracrf(fentoracrf);

		// Save the Fentoracrf
		fentoracrfObj.save(function() {
			// Try deleting Fentoracrf
			request(app).delete('/fentoracrf/' + fentoracrfObj._id)
			.expect(401)
			.end(function(fentoracrfDeleteErr, fentoracrfDeleteRes) {
				// Set message assertion
				(fentoracrfDeleteRes.body.message).should.match('User is not logged in');

				// Handle Fentoracrf error error
				done(fentoracrfDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Fentoracrf.remove().exec();
		done();
	});
});
