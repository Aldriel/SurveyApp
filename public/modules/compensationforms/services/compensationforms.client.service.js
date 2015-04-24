'use strict';

//Compensationforms service used to communicate Compensationforms REST endpoints
angular.module('compensationforms').factory('Compensationforms', ['$resource',
	function($resource) {
		return $resource('compensationforms/:compensationformId', { compensationformId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);