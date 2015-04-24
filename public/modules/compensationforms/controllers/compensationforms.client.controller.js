'use strict';

// Compensationforms controller
angular.module('compensationforms').controller('CompensationformsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Compensationforms',
	function($scope, $stateParams, $location, $http, Authentication, Compensationforms) {

        $scope.compensationFormId = '';
        $scope.continue = false;

		// Create new Compensationform
		$scope.create = function() {
			// Create new Compensationform object
			var compensationform = new Compensationforms ({
				firstName: this.firstName,
                lastName: this.lastName,
                institution: this.institution,
                address: this.address,
                city: this.city,
                province: this.province,
                postalCode:this.postalCode
			});

			// Redirect after save
			compensationform.$save(function(response) {
                $scope.compensationFormId = response._id;

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Compensationform
		$scope.remove = function(compensationform) {
			if ( compensationform ) { 
				compensationform.$remove();

				for (var i in $scope.compensationforms) {
					if ($scope.compensationforms [i] === compensationform) {
						$scope.compensationforms.splice(i, 1);
					}
				}
			} else {
				$scope.compensationform.$remove(function() {
					$location.path('compensationforms');
				});
			}
		};

		// Update existing Compensationform
		$scope.update = function() {
			var compensationform = $scope.compensationform;

			compensationform.$update(function() {
				$location.path('compensationforms/' + compensationform._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Compensationforms
		$scope.find = function() {
			$scope.compensationforms = Compensationforms.query();
		};

		// Find existing Compensationform
		$scope.findOne = function() {
			$scope.compensationform = Compensationforms.get({ 
				compensationformId: $stateParams.compensationformId
			});
		};

        $scope.continueToCrf = function(){

            $scope.page.title = '';
            $scope.continue = true;

        };

        $scope.registerUser = function() {

            $scope.credentials.compensationForm = $scope.compensationFormId;
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $location.path('fentoracrf');

            }).error(function(response) {
                $scope.error = response.message;
            });


        };
	}
]);
