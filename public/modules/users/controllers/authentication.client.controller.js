'use strict';

angular.module('users').controller( 'AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Fentoracrf',
	function($scope, $http, $location, Authentication, Fentoracrf) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/fentoracrf');

		$scope.signup = function() {
            $scope.fentoraCRF.$save(function (response) {
                $http.post('/auth/signup', $scope.credentials).success(function(response) {
                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;

                    // And redirect to the index page
                    $location.path('/');
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });


		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
                $location.path('/fentoracrf');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
