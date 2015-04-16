'use strict';

//Fentoracrf service used to communicate Fentoracrf REST endpoints
angular.module('fentoracrf').factory('Fentoracrf', ['$resource',
	function($resource) {
		return $resource('fentoracrf/:fentoracrfId', { fentoracrfId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
