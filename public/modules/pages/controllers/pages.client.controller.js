'use strict';

// Pages controller
angular.module('pages').controller('PagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pages', 'Questions', 'Answers',
	function($scope, $stateParams, $location, Authentication, Pages, Questions, Answers) {

        $scope.authentication = Authentication;
        $scope.questions =[];
        $scope.test = "this is a test";

		// Create new Page
		$scope.create = function() {
			// Create new Page object
			var page = new Pages ({
				title: this.title,
                header: this.header,
                number: this.number,
                survey: this.survey
			});

			// Redirect after save
			page.$save(function(response) {
				$location.path('pages/' + response._id);

				// Clear form fields
				$scope.title = '';
                $scope.header = '';
                $scope.number = '';
                $scope.survey = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Page
		$scope.remove = function(page) {

			if ( page ) {
				page.$remove();

				for (var i in $scope.pages) {
					if ($scope.pages [i] === page) {
						$scope.pages.splice(i, 1);
					}
				}
			} else {
				$scope.page.$remove(function() {
					$location.path('pages');
				});
			}

		};

		// Update existing Page
		$scope.update = function() {
			var page = $scope.page;
			page.$update(function() {
				$location.path('surveys/' + page.survey);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pages
		$scope.find = function() {
			$scope.pages = Pages.query();
		};

		// Find existing Page


		$scope.findOne = function() {
			$scope.page = Pages.get({ 
				pageId: $stateParams.pageId
			});
		};

        // Pages functions
        $scope.addQuestion = function() {
            var page = $scope.page;
            var newQuestion = new Questions({
                text: this.questionText,
                number: this.questionNumber,
                choices: [],
                type: this.selectedType.value,
                page: page._id
            });

            newQuestion.$save(function(response) {
                page.questions.push(newQuestion._id);
                page.$update(function() {
                    $location.path('pages/' + page._id);
                    this.questionText ='';
                    this.questionNumber ='';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        //Questions functions
        $scope.getQuestions = function () {
            var id;
            $scope.questions =[];
            if(!$scope.page.questions.isEmpty) {
                for (id in $scope.page.questions) {
                    $scope.questions.push(
                        Questions.get({
                            questionId: $scope.page.questions[id]
                        })
                    );
                }
            }
        };

        //Functions for choices
        $scope.choiceTypes =[
            {label:'radio', value: 'radio'},
            {label:'checkbox', value: 'checkbox'},
            {label:'text', value: 'text'},
            {label:'number', value: 'number'},
            {label:'date', value: 'date'}
        ];
        $scope.selectedType = $scope.choiceTypes[0];

        $scope.$watch('page.questions', function () {
            $scope.getQuestions();
        });
	}
]);
