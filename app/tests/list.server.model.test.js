'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    List = mongoose.model('List');

/**
 * Globals
 */
var user, list;

/**
 * Unit tests
 */
describe('List Model Unit Tests:', function() {
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
            list = new List({
                name: 'List Name'
            });
            list.audit.user = user;
            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return list.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) {
            list.name = '';

            return list.save(function(err) {
                should.exist(err);
                done();
            });
        });
        it('should set audit create properties for new list', function(done) {
            return list.save(function(err) {
                should.exist(list.audit.createUser);
                should.exist(list.audit.createDate);
                done();
            });
        });
        it('should set audit update properties for new list', function(done) {
            return list.save(function(err) {
                return list.save(function(err) {
                    should.exist(list.audit.updateUser);
                    should.exist(list.audit.updateDate);
                    done();
                });
            });
        });
    });

    afterEach(function(done) {
        List.remove().exec();
        User.remove().exec();

        done();
    });
});
