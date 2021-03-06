'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('pages').factory('Pages', ['$resource',
	function($resource) {
		return $resource('pages/:pageId', { pageId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            get: {
                method: 'GET'
            }
		});
	}
]);
