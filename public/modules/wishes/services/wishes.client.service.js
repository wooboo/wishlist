'use strict';

//Wishes service used to communicate Wishes REST endpoints
angular.module('wishes').factory('Wishes', ['$resource',
    function($resource) {
        return $resource('lists/:listId/wishes/:wishId', {
            wishId: '@_id',
            listId: '@listId'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
