'use strict';

// Fentoracrf controller
angular.module('fentoracrf').controller('FentoracrfController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Fentoracrf', 'Patientcrves',
	function($scope, $stateParams, $location, $http, Authentication, Fentoracrf, Patientcrves) {
		$scope.authentication = Authentication;
        $scope.currentCRF = {'nothing':'nothing'};
        $scope.fentoraCRF = {'nothing':'nothing'};
        var pages = [
            'screening.html',
            'patientDemographics.html',

            'diversion.html',
            'end.html',
            'treatmentDetails1.html',
            'treatmentDetails2.html',

            'treatmentDetails3.html',
            'treatmentDetails4.html',
            'treatmentMonitoring1.html',
            'treatmentMonitoring2.html',
            'diversion.html',
            'end.html'
        ];

        $scope.initFentoraCRF = function() {
            $scope.fentoraCRF = new Fentoracrf({
                physician: Authentication.user._id,
                numberOfPatients: 0,
                currentPatientNumber: 0,
                currentPageIndex: 0,
                patientsCRFs:[]
            });
            $scope.fentoraCRF.$save(function (response) {
                $scope.authentication.user.fentoraCrf = response._id;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        function getPage(){
            $scope.currentPage = '/modules/fentoracrf/views/pages/' + pages[$scope.fentoraCRF.currentPageIndex];
        }


        function init() {
            /*
            if($scope.authentication.user.fentoraCrf === null){
                $scope.initFentoraCRF();
            } else{
                var id = $scope.authentication.user.fentoraCrf;
                $scope.fentoraCRF = Fentoracrf.get({
                    fentoracrfId: id
                });
            }
            $scope.currentPage = '/modules/fentoracrf/views/pages/' + pages[0];
            */
            $scope.initFentoraCRF();
            getPage();
        }

        init();



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

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.passwordDetails = null;

                // Attach user profile
                Authentication.user = response;

                // And redirect to the index page
                $location.path('/password/reset/success');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.newPatient = function() {
            $scope.currentCRF = new Patientcrves({
            });
            $scope.currentCRF.$save(function (response) {
                $scope.fentoraCRF.patientsCRFs[$scope.currentCRF.currentPatientNumber] = response._id;
                $scope.fentoraCRF.currentPageIndex = 1;
                setTimeout(getPage(), 50);
                setTimeout($scope.fentoraCRF.currentPatientNumber++, 75);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        /**
         * SUBMIT FUNCTIONS FOR EVERY PAGES
         */

        function updateFentoraCrf() {
            $scope.fentoraCRF.$update(function () {
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }

        function updatePatientCrf() {
            $scope.currentCRF.$update(function () {
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }

        $scope.submitScreening = function() {
            $scope.newPatient();
            updateFentoraCrf();
            $scope.fentoraCRF.currentPageIndex++;

            getPage();
        };

        $scope.submitPage = function() {
            $scope.fentoraCRF.currentPageIndex++;
            updatePatientCrf();
            updateFentoraCrf();
            getPage();
        };

        /**
         * OPIOIDS
         */
        $scope.Opioids = [{}];
        $scope.addOpioid = function(){
        $scope.Opioids.push({});
        };
	}
]);
