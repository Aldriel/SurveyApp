'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Answerset = mongoose.model('Answerset'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, answerset;

/**
 * Answerset routes tests
 */
describe('Answerset CRUD tests', function() {
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

		// Save a user to the test db and create new Answerset
		user.save(function() {
			answerset = {
				name: 'Answerset Name'
			};

			done();
		});
	});

	it('should be able to save Answerset instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answerset
				agent.post('/answersets')
					.send(answerset)
					.expect(200)
					.end(function(answersetSaveErr, answersetSaveRes) {
						// Handle Answerset save error
						if (answersetSaveErr) done(answersetSaveErr);

						// Get a list of Answersets
						agent.get('/answersets')
							.end(function(answersetsGetErr, answersetsGetRes) {
								// Handle Answerset save error
								if (answersetsGetErr) done(answersetsGetErr);

								// Get Answersets list
								var answersets = answersetsGetRes.body;

								// Set assertions
								(answersets[0].user._id).should.equal(userId);
								(answersets[0].name).should.match('Answerset Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Answerset instance if not logged in', function(done) {
		agent.post('/answersets')
			.send(answerset)
			.expect(401)
			.end(function(answersetSaveErr, answersetSaveRes) {
				// Call the assertion callback
				done(answersetSaveErr);
			});
	});

	it('should not be able to save Answerset instance if no name is provided', function(done) {
		// Invalidate name field
		answerset.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answerset
				agent.post('/answersets')
					.send(answerset)
					.expect(400)
					.end(function(answersetSaveErr, answersetSaveRes) {
						// Set message assertion
						(answersetSaveRes.body.message).should.match('Please fill Answerset name');
						
						// Handle Answerset save error
						done(answersetSaveErr);
					});
			});
	});

	it('should be able to update Answerset instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answerset
				agent.post('/answersets')
					.send(answerset)
					.expect(200)
					.end(function(answersetSaveErr, answersetSaveRes) {
						// Handle Answerset save error
						if (answersetSaveErr) done(answersetSaveErr);

						// Update Answerset name
						answerset.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Answerset
						agent.put('/answersets/' + answersetSaveRes.body._id)
							.send(answerset)
							.expect(200)
							.end(function(answersetUpdateErr, answersetUpdateRes) {
								// Handle Answerset update error
								if (answersetUpdateErr) done(answersetUpdateErr);

								// Set assertions
								(answersetUpdateRes.body._id).should.equal(answersetSaveRes.body._id);
								(answersetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Answersets if not signed in', function(done) {
		// Create new Answerset model instance
		var answersetObj = new Answerset(answerset);

		// Save the Answerset
		answersetObj.save(function() {
			// Request Answersets
			request(app).get('/answersets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Answerset if not signed in', function(done) {
		// Create new Answerset model instance
		var answersetObj = new Answerset(answerset);

		// Save the Answerset
		answersetObj.save(function() {
			request(app).get('/answersets/' + answersetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', answerset.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Answerset instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answerset
				agent.post('/answersets')
					.send(answerset)
					.expect(200)
					.end(function(answersetSaveErr, answersetSaveRes) {
						// Handle Answerset save error
						if (answersetSaveErr) done(answersetSaveErr);

						// Delete existing Answerset
						agent.delete('/answersets/' + answersetSaveRes.body._id)
							.send(answerset)
							.expect(200)
							.end(function(answersetDeleteErr, answersetDeleteRes) {
								// Handle Answerset error error
								if (answersetDeleteErr) done(answersetDeleteErr);

								// Set assertions
								(answersetDeleteRes.body._id).should.equal(answersetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Answerset instance if not signed in', function(done) {
		// Set Answerset user 
		answerset.user = user;

		// Create new Answerset model instance
		var answersetObj = new Answerset(answerset);

		// Save the Answerset
		answersetObj.save(function() {
			// Try deleting Answerset
			request(app).delete('/answersets/' + answersetObj._id)
			.expect(401)
			.end(function(answersetDeleteErr, answersetDeleteRes) {
				// Set message assertion
				(answersetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Answerset error error
				done(answersetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Answerset.remove().exec();
		done();
	});
});