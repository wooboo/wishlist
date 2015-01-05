'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wish = mongoose.model('Wish'),
	List = mongoose.model('List');

/**
 * Globals
 */
var user, wish, list;

/**
 * Unit tests
 */
describe('Wish Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		list = new List({
			name: 'Test list'
		});
		list.audit.user = user;
		user.save(function() {
			list.save(function(){
				wish = new Wish({
					name: 'Wish Name',
					list: list
				});

				done();

			});
		});

	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return wish.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			wish.name = '';

			return wish.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Wish.remove().exec();
		User.remove().exec();

		done();
	});
});
