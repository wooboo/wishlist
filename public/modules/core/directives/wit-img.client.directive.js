'use strict';

angular.module('core')
    .factory('witUrls', function() {
        var wit_index = 0;
        var wit_urls = ['//wit.wurfl.io', '//wit1.wurfl.io', '//wit2.wurfl.io', '//wit3.wurfl.io', '//wit4.wurfl.io'];
        return {
            get: function() {
                var url = wit_urls[wit_index];
                wit_index++;
                if (wit_index >= wit_urls.length) {
                    wit_index = 0;
                }
                return url;
            }
        };
    }).directive('witImg', ['witUrls',
        function(witUrls) {
            return {
                restrict: 'E',
                replace: false,
                scope: {
                    src: '='
                },
                template: '<div class="wit"><img style="max-width:100%" src="{{wit_link}}/{{src}}"/></div>',
                link: function(scope, element, attributes) {
                    var wit_link_pieces = [witUrls.get()];
                    angular.forEach(attributes.$attr, function(attr) {
                        if (attr !== 'src') {
                            wit_link_pieces.push(attr + '_' + attributes[attr]);
                        }
                    });
                    scope.wit_link = wit_link_pieces.join('/');
                }
            };
        }
    ]);
