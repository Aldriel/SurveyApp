'use strict';

// Choices controller
angular.module('choices').controller('ChoicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Choices',
	function($scope, $stateParams, $location, Authentication, Choices) {
		$scope.authentication = Authentication;

		// Create new Choice
		$scope.create = function() {
			// Create new Choice object
			var choice = new Choices ({
                text: this.text,
                order: this.order,
                type: 'radio'
			});

			// Redirect after save
			choice.$save(function(response) {
				$location.path('choices/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Choice
		$scope.remove = function(choice) {
			if ( choice ) { 
				choice.$remove();

				for (var i in $scope.choices) {
					if ($scope.choices [i] === choice) {
						$scope.choices.splice(i, 1);
					}
				}
			} else {
				$scope.choice.$remove(function() {
					$location.path('choices');
				});
			}
		};

		// Update existing Choice
		$scope.update = function() {
			var choice = $scope.choice;

			choice.$update(function() {
				$location.path('choices/' + choice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Choices
		$scope.find = function() {
			$scope.choices = Choices.query();
		};

		// Find existing Choice
		$scope.findOne = function() {
			$scope.choice = Choices.get({ 
				choiceId: $stateParams.choiceId
			});
		};
	}
]);
