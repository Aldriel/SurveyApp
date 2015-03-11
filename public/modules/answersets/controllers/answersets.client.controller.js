'use strict';

// Answersets controller
angular.module('answersets').controller('AnswersetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Answersets',
	function($scope, $stateParams, $location, Authentication, Answersets) {
		$scope.authentication = Authentication;

		// Create new Answerset
		$scope.create = function() {
			// Create new Answerset object
			var answerset = new Answersets ({
				name: this.name
			});

			// Redirect after save
			answerset.$save(function(response) {
				$location.path('answersets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Answerset
		$scope.remove = function(answerset) {
			if ( answerset ) { 
				answerset.$remove();

				for (var i in $scope.answersets) {
					if ($scope.answersets [i] === answerset) {
						$scope.answersets.splice(i, 1);
					}
				}
			} else {
				$scope.answerset.$remove(function() {
					$location.path('answersets');
				});
			}
		};

		// Update existing Answerset
		$scope.update = function() {
			var answerset = $scope.answerset;

			answerset.$update(function() {
				$location.path('answersets/' + answerset._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Answersets
		$scope.find = function() {
			$scope.answersets = Answersets.query();
		};

		// Find existing Answerset
		$scope.findOne = function() {
			$scope.answerset = Answersets.get({ 
				answersetId: $stateParams.answersetId
			});
		};
	}
]);