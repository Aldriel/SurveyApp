'use strict';

// Fentoracrf controller
angular.module('fentoracrf').controller('FentoracrfController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Fentoracrf',
	function($scope, $stateParams, $location, $http, Authentication, Fentoracrf) {
		$scope.authentication = Authentication;
        $scope.variableTest = 'test';
        $scope.currentPage = 0;
        $scope.pageIndex = 0;
        $scope.numberOfPatients = 0;
        $scope.cureentPatient = 0;
        var pages = [
            'treatmentMonitoring2.html',
            'screening.html',
            'patientDemographics.html',
            'treatmentDetails1.html',
            'treatmentDetails2.html',
            'treatmentDetails3.html',
            'treatmentDetails4.html',
            'treatmentMonitoring1.html',
            'treatmentMonitoring2.html'
        ];

        function init() {
            getPage();
            if($scope.authentication.user.fentoraCrf == null){
                $scope.variableTest= 'NULL';
            } else{
                $scope.variableTest= 'SOMETHING';
            }
        }

        init();

        function getPage(){
            $scope.currentPage = '/modules/fentoracrf/views/pages/' + pages[$scope.pageIndex];
        }

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

        $scope.next = function(){
            $scope.pageIndex++;
        };

        /**
         * SUBMIT FUNCTIONS FOR EVERY PAGES
         */

        $scope.submitScreening = function() {
            $scope.pageIndex++;
            $scope.nbOfPatients = this.nbOfPatients;
            getPage();
        };


        $scope.submitDemographics = function() {
            $scope.pageIndex++;
            $scope.gender = this.gender;
            $scope.dateOfBirth = this.dateOfBirth;
            getPage();
        };

        $scope.submitPatientDetails1 = function() {
            $scope.pageIndex++;
            $scope.firstPrescriptionDate = this.firstPrescriptionDate;
            $scope.lastPrescriptionDate = this.lastPrescriptionDate;
            $scope.isOngoing = this.isOngoing;
            getPage();
        };
        $scope.submitPatientDetails2 = function() {
            $scope.pageIndex++;
            $scope.dailyDosage = this.dailyDosage;
            $scope.patientCondition = this.patientCondition;
            getPage();
        };
        $scope.submitPatientDetails3 = function() {
            $scope.pageIndex++;

            getPage();
        };
        $scope.submitPatientDetails4 = function() {
            $scope.pageIndex++;

            getPage();
        };
        $scope.submitTreatmentMonitoring1 = function() {
            $scope.pageIndex++;

            getPage();
        };

        $scope.submitTreatmentMonitoring2 = function() {
            $scope.pageIndex++;

            getPage();
        };

        $scope.submitDiversion = function() {
            $scope.pageIndex++;

            getPage();
        };

        /**
         * OPIOIDS
         */
        $scope.Opioids = [{}];
        $scope.addOpioid = function(){
            $scope.Opioids.push({});
        }
	}
]);
