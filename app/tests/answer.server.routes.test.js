'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Answer = mongoose.model('Answer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, answer;

/**
 * Answer routes tests
 */
describe('Answer CRUD tests', function() {
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

		// Save a user to the test db and create new Answer
		user.save(function() {
			answer = {
				name: 'Answer Name'
			};

			done();
		});
	});

	it('should be able to save Answer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answer
				agent.post('/answers')
					.send(answer)
					.expect(200)
					.end(function(answerSaveErr, answerSaveRes) {
						// Handle Answer save error
						if (answerSaveErr) done(answerSaveErr);

						// Get a list of Answers
						agent.get('/answers')
							.end(function(answersGetErr, answersGetRes) {
								// Handle Answer save error
								if (answersGetErr) done(answersGetErr);

								// Get Answers list
								var answers = answersGetRes.body;

								// Set assertions
								(answers[0].user._id).should.equal(userId);
								(answers[0].name).should.match('Answer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Answer instance if not logged in', function(done) {
		agent.post('/answers')
			.send(answer)
			.expect(401)
			.end(function(answerSaveErr, answerSaveRes) {
				// Call the assertion callback
				done(answerSaveErr);
			});
	});

	it('should not be able to save Answer instance if no name is provided', function(done) {
		// Invalidate name field
		answer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answer
				agent.post('/answers')
					.send(answer)
					.expect(400)
					.end(function(answerSaveErr, answerSaveRes) {
						// Set message assertion
						(answerSaveRes.body.message).should.match('Please fill Answer name');
						
						// Handle Answer save error
						done(answerSaveErr);
					});
			});
	});

	it('should be able to update Answer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answer
				agent.post('/answers')
					.send(answer)
					.expect(200)
					.end(function(answerSaveErr, answerSaveRes) {
						// Handle Answer save error
						if (answerSaveErr) done(answerSaveErr);

						// Update Answer name
						answer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Answer
						agent.put('/answers/' + answerSaveRes.body._id)
							.send(answer)
							.expect(200)
							.end(function(answerUpdateErr, answerUpdateRes) {
								// Handle Answer update error
								if (answerUpdateErr) done(answerUpdateErr);

								// Set assertions
								(answerUpdateRes.body._id).should.equal(answerSaveRes.body._id);
								(answerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Answers if not signed in', function(done) {
		// Create new Answer model instance
		var answerObj = new Answer(answer);

		// Save the Answer
		answerObj.save(function() {
			// Request Answers
			request(app).get('/answers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Answer if not signed in', function(done) {
		// Create new Answer model instance
		var answerObj = new Answer(answer);

		// Save the Answer
		answerObj.save(function() {
			request(app).get('/answers/' + answerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', answer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Answer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Answer
				agent.post('/answers')
					.send(answer)
					.expect(200)
					.end(function(answerSaveErr, answerSaveRes) {
						// Handle Answer save error
						if (answerSaveErr) done(answerSaveErr);

						// Delete existing Answer
						agent.delete('/answers/' + answerSaveRes.body._id)
							.send(answer)
							.expect(200)
							.end(function(answerDeleteErr, answerDeleteRes) {
								// Handle Answer error error
								if (answerDeleteErr) done(answerDeleteErr);

								// Set assertions
								(answerDeleteRes.body._id).should.equal(answerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Answer instance if not signed in', function(done) {
		// Set Answer user 
		answer.user = user;

		// Create new Answer model instance
		var answerObj = new Answer(answer);

		// Save the Answer
		answerObj.save(function() {
			// Try deleting Answer
			request(app).delete('/answers/' + answerObj._id)
			.expect(401)
			.end(function(answerDeleteErr, answerDeleteRes) {
				// Set message assertion
				(answerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Answer error error
				done(answerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Answer.remove().exec();
		done();
	});
});