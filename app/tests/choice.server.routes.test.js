'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Choice = mongoose.model('Choice'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, choice;

/**
 * Choice routes tests
 */
describe('Choice CRUD tests', function() {
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

		// Save a user to the test db and create new Choice
		user.save(function() {
			choice = {
				name: 'Choice Name'
			};

			done();
		});
	});

	it('should be able to save Choice instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Choice
				agent.post('/choices')
					.send(choice)
					.expect(200)
					.end(function(choiceSaveErr, choiceSaveRes) {
						// Handle Choice save error
						if (choiceSaveErr) done(choiceSaveErr);

						// Get a list of Choices
						agent.get('/choices')
							.end(function(choicesGetErr, choicesGetRes) {
								// Handle Choice save error
								if (choicesGetErr) done(choicesGetErr);

								// Get Choices list
								var choices = choicesGetRes.body;

								// Set assertions
								(choices[0].user._id).should.equal(userId);
								(choices[0].name).should.match('Choice Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Choice instance if not logged in', function(done) {
		agent.post('/choices')
			.send(choice)
			.expect(401)
			.end(function(choiceSaveErr, choiceSaveRes) {
				// Call the assertion callback
				done(choiceSaveErr);
			});
	});

	it('should not be able to save Choice instance if no name is provided', function(done) {
		// Invalidate name field
		choice.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Choice
				agent.post('/choices')
					.send(choice)
					.expect(400)
					.end(function(choiceSaveErr, choiceSaveRes) {
						// Set message assertion
						(choiceSaveRes.body.message).should.match('Please fill Choice name');
						
						// Handle Choice save error
						done(choiceSaveErr);
					});
			});
	});

	it('should be able to update Choice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Choice
				agent.post('/choices')
					.send(choice)
					.expect(200)
					.end(function(choiceSaveErr, choiceSaveRes) {
						// Handle Choice save error
						if (choiceSaveErr) done(choiceSaveErr);

						// Update Choice name
						choice.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Choice
						agent.put('/choices/' + choiceSaveRes.body._id)
							.send(choice)
							.expect(200)
							.end(function(choiceUpdateErr, choiceUpdateRes) {
								// Handle Choice update error
								if (choiceUpdateErr) done(choiceUpdateErr);

								// Set assertions
								(choiceUpdateRes.body._id).should.equal(choiceSaveRes.body._id);
								(choiceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Choices if not signed in', function(done) {
		// Create new Choice model instance
		var choiceObj = new Choice(choice);

		// Save the Choice
		choiceObj.save(function() {
			// Request Choices
			request(app).get('/choices')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Choice if not signed in', function(done) {
		// Create new Choice model instance
		var choiceObj = new Choice(choice);

		// Save the Choice
		choiceObj.save(function() {
			request(app).get('/choices/' + choiceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', choice.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Choice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Choice
				agent.post('/choices')
					.send(choice)
					.expect(200)
					.end(function(choiceSaveErr, choiceSaveRes) {
						// Handle Choice save error
						if (choiceSaveErr) done(choiceSaveErr);

						// Delete existing Choice
						agent.delete('/choices/' + choiceSaveRes.body._id)
							.send(choice)
							.expect(200)
							.end(function(choiceDeleteErr, choiceDeleteRes) {
								// Handle Choice error error
								if (choiceDeleteErr) done(choiceDeleteErr);

								// Set assertions
								(choiceDeleteRes.body._id).should.equal(choiceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Choice instance if not signed in', function(done) {
		// Set Choice user 
		choice.user = user;

		// Create new Choice model instance
		var choiceObj = new Choice(choice);

		// Save the Choice
		choiceObj.save(function() {
			// Try deleting Choice
			request(app).delete('/choices/' + choiceObj._id)
			.expect(401)
			.end(function(choiceDeleteErr, choiceDeleteRes) {
				// Set message assertion
				(choiceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Choice error error
				done(choiceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Choice.remove().exec();
		done();
	});
});