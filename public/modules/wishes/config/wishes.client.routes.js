'use strict';

//Setting up route
angular.module('wishes').config(['$stateProvider',
    function($stateProvider) {
        // Wishes state routing
        $stateProvider.
        state('listWishes', {
            url: '/lists/:listId/wishes',
            templateUrl: 'modules/wishes/views/list-wishes.client.view.html'
        }).
        state('createWish', {
            url: '/lists/:listId/wishes/create',
            templateUrl: 'modules/wishes/views/create-wish.client.view.html'
        }).
        state('viewWish', {
            url: '/lists/:listId/wishes/:wishId',
            templateUrl: 'modules/wishes/views/view-wish.client.view.html'
        }).
        state('editWish', {
            url: '/lists/:listId/wishes/:wishId/edit',
            templateUrl: 'modules/wishes/views/edit-wish.client.view.html'
        });
    }
]);
