'use strict';

// Lists controller
angular.module('lists').controller('ListsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lists',
    function($scope, $stateParams, $location, Authentication, Lists) {
        $scope.authentication = Authentication;
        $scope.newListUser = {};
        // edit authorizatrion
        $scope.canEdit = function(list) {
            if (!list.$resolved || !Authentication.user)
                return false;
            for (var i = 0; i < list.users.length; i++) {
                if (list.users[i].user._id === Authentication.user._id &&
                    list.users[i].role === 'owner') {
                    return true;
                }
            }
            return false;
        };
        // Create new List
        $scope.create = function() {
            // Create new List object
            var list = new Lists({
                name: this.name
            });

            // Redirect after save
            list.$save(function(response) {
                $location.path('lists/' + response._id + '/wishes');

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing List
        $scope.remove = function(list) {
            if (list) {
                list.$remove();

                for (var i in $scope.lists) {
                    if ($scope.lists[i] === list) {
                        $scope.lists.splice(i, 1);
                    }
                }
            } else {
                $scope.list.$remove(function() {
                    $location.path('lists');
                });
            }
        };

        // Update existing List
        $scope.update = function() {
            var list = $scope.list;

            list.$update(function() {
                $location.path('lists/' + list._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Lists
        $scope.find = function() {
            $scope.lists = Lists.query();
        };

        // Find existing List
        $scope.findOne = function() {
            $scope.list = Lists.get({
                listId: $stateParams.listId
            });
        };

        // Add user
        $scope.addUser = function() {
            $scope.list.users = $scope.list.users || [];
            $scope.list.users.push($scope.newListUser);
            $scope.newListUser = {};
        };
        // Remove user
        $scope.removeUser = function(user) {
            $scope.list.users.splice($scope.list.users.indexOf(user), 1);
        };
    }
]);
