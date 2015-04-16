'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Fentoracrf = mongoose.model('Fentoracrf');

/**
 * Globals
 */
var user, fentoracrf;

/**
 * Unit tests
 */
describe('Fentoracrf Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			fentoracrf = new Fentoracrf({
				name: 'Fentoracrf Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return fentoracrf.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			fentoracrf.name = '';

			return fentoracrf.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Fentoracrf.remove().exec();
		User.remove().exec();

		done();
	});
});