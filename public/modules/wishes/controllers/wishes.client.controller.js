'use strict';

// Wishes controller
angular.module('wishes').controller('WishesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lists', 'Wishes',
    function($scope, $stateParams, $location, Authentication, Lists, Wishes) {
        $scope.authentication = Authentication;
        // list edit authorizatrion
        $scope.canEditList = function(list) {
            if (!list || !list.$resolved || !Authentication.user)
                return false;
            for (var i = 0; i < list.users.length; i++) {
                if (list.users[i].user._id === Authentication.user._id &&
                    list.users[i].role === 'owner') {
                    return true;
                }
            }
            return false;
        };
        // wish edit authorizatrion
        $scope.canEditWish = function() {
            if (!$scope.list.$resolved || !Authentication.user)
                return false;
            for (var i = 0; i < $scope.list.users.length; i++) {
                if ($scope.list.users[i].user._id === Authentication.user._id &&
                    ($scope.list.users[i].role === 'owner' || $scope.list.users[i].role === 'moderator')) {
                    return true;
                }
            }
            return false;
        };
        // Create new Wish
        $scope.create = function() {
            // Create new Wish object
            var wish = new Wishes({
                name: this.name,
                listId: $stateParams.listId
            });

            // Redirect after save
            wish.$save(function(response) {
                $location.path('lists/' + $stateParams.listId + '/wishes');

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Wish
        $scope.remove = function(wish) {
            if (wish) {
                wish.$remove();

                for (var i in $scope.wishes) {
                    if ($scope.wishes[i] === wish) {
                        $scope.wishes.splice(i, 1);
                    }
                }
            } else {
                $scope.wish.listId = $stateParams.listId;
                $scope.wish.$remove(function() {
                    $location.path('/lists/' + $stateParams.listId + '/wishes');
                });
            }
        };

        // Update existing Wish
        $scope.update = function() {
            var wish = $scope.wish;
            wish.listId = $stateParams.listId;

            wish.$update(function() {
                $location.path('/lists/' + $stateParams.listId + '/wishes');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Wishes
        $scope.find = function() {
            $scope.list = Lists.get({
                listId: $stateParams.listId
            });
            $scope.wishes = Wishes.query({
                listId: $stateParams.listId
            });
        };

        // Find existing Wish
        $scope.findOne = function() {
            $scope.wish = Wishes.get({
                listId: $stateParams.listId,
                wishId: $stateParams.wishId
            });
        };
    }
]);
