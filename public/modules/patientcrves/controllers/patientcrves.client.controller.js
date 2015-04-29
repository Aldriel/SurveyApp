'use strict';

// Patientcrves controller
angular.module('patientcrves').controller('PatientcrvesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patientcrves',
	function($scope, $stateParams, $location, Authentication, Patientcrves) {
		$scope.authentication = Authentication;

		// Create new Patientcrf
		$scope.create = function() {
			// Create new Patientcrf object
			var patientcrf = new Patientcrves ({

			});

			// Redirect after save
			patientcrf.$save(function(response) {
				$location.path('patientcrves/' + response._id);

				// Clear form fields

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Patientcrf
		$scope.remove = function(patientcrf) {
			if ( patientcrf ) { 
				patientcrf.$remove();

				for (var i in $scope.patientcrves) {
					if ($scope.patientcrves [i] === patientcrf) {
						$scope.patientcrves.splice(i, 1);
					}
				}
			} else {
				$scope.patientcrf.$remove(function() {
					$location.path('patientcrves');
				});
			}
		};

		// Update existing Patientcrf
		$scope.update = function() {
			var patientcrf = $scope.patientcrf;

			patientcrf.$update(function() {
				$location.path('patientcrves/' + patientcrf._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patientcrves
		$scope.find = function() {
			$scope.patientcrves = Patientcrves.query();
		};

		// Find existing Patientcrf
		$scope.findOne = function() {
			$scope.patientcrf = Patientcrves.get({ 
				patientcrfId: $stateParams.patientcrfId
			});
		};
	}
]);
