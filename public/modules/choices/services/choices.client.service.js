'use strict';

//Choices service used to communicate Choices REST endpoints
angular.module('choices').factory('Choices', ['$resource',
	function($resource) {
		return $resource('choices/:choiceId', { choiceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);