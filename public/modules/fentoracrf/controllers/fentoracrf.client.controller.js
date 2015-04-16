'use strict';

// Fentoracrf controller
angular.module('fentoracrf').controller('FentoracrfController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fentoracrf',
	function($scope, $stateParams, $location, Authentication, Fentoracrf) {
		$scope.authentication = Authentication;

		// Create new Fentoracrf
		$scope.create = function() {
			// Create new Fentoracrf object
			var fentoracrf = new Fentoracrf ({
				name: this.name
			});

			// Redirect after save
			fentoracrf.$save(function(response) {
				$location.path('fentoracrf/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fentoracrf
		$scope.remove = function(fentoracrf) {
			if ( fentoracrf ) { 
				fentoracrf.$remove();

				for (var i in $scope.fentoracrf) {
					if ($scope.fentoracrf [i] === fentoracrf) {
						$scope.fentoracrf.splice(i, 1);
					}
				}
			} else {
				$scope.fentoracrf.$remove(function() {
					$location.path('fentoracrf');
				});
			}
		};

		// Update existing Fentoracrf
		$scope.update = function() {
			var fentoracrf = $scope.fentoracrf;

			fentoracrf.$update(function() {
				$location.path('fentoracrf/' + fentoracrf._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fentoracrf
		$scope.find = function() {
			$scope.fentoracrf = Fentoracrf.query();
		};

		// Find existing Fentoracrf
		$scope.findOne = function() {
			$scope.fentoracrf = Fentoracrf.get({
				fentoracrfId: $stateParams.fentoracrfId
			});
		};
	}
]);
