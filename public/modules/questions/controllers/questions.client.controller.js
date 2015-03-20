'use strict';

// Questions controller
angular.module('questions').controller('QuestionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Questions', 'Choices',
	function($scope, $stateParams, $location, Authentication, Questions, Choices) {
		$scope.authentication = Authentication;

		// Create new Question
		$scope.create = function() {
			// Create new Question object
			var question = new Questions ({
				text: this.text,
                number: this.number,
                page: this.page
			});

			// Redirect after save
			question.$save(function(response) {
				$location.path('questions/' + response._id);

				// Clear form fields
				$scope.text = '';
                $scope.number = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Question
		$scope.remove = function(question) {
			if ( question ) { 
				question.$remove();

				for (var i in $scope.questions) {
					if ($scope.questions [i] === question) {
						$scope.questions.splice(i, 1);
					}
				}
			} else {
				$scope.question.$remove(function() {
					$location.path('questions');
				});
			}
		};

		// Update existing Question
		$scope.update = function() {
			var question = $scope.question;

			question.$update(function() {
				$location.path('questions/' + question._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Questions
		$scope.find = function() {
			$scope.questions = Questions.query();
		};

		// Find existing Question
		$scope.findOne = function() {
			$scope.question = Questions.get({ 
				questionId: $stateParams.questionId
			});
		};



        $scope.addChoice = function() {

            var question = $scope.question;
            var newChoice = new Choices({
                text: this.text,
                order: this.order,
                question: question._id
            });

            newChoice.$save(function(response) {
                question.choices.push(newChoice._id);
                question.$update(function() {
                    $location.path('questions/' + question._id);
                    this.text ='';
                    this.order ='';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
