'use strict';

//Patientcrves service used to communicate Patientcrves REST endpoints
angular.module('patientcrves').factory('Patientcrves', ['$resource',
	function($resource) {
		return $resource('patientcrves/:patientcrfId', { patientcrfId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);