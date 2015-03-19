'use strict';

// Surveys controller
angular.module('surveys').controller('SurveysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Surveys',  'Pages', 'Questions', 'Answers','Answersets',
	function($scope, $stateParams, $location, Authentication, Surveys, Pages, Questions, Answers, Answersets) {

        $scope.authentication = Authentication;
        $scope.pageIndex = 0;
        $scope.formData = {};
        $scope.answerSet = {};
        $scope.unchecked = true;

        // Create new Survey
        $scope.create = function () {
            // Create new Survey object
            var survey = new Surveys({
                title: this.title,
                description: this.description,
                pages: []
            });

            // Redirect after save
            survey.$save(function (response) {
                $location.path('surveys/' + response._id);

                // Clear form fields
                $scope.title = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Survey
        $scope.remove = function (survey) {
            if (survey) {
                survey.$remove();

                for (var i in $scope.surveys) {
                    if ($scope.surveys [i] === survey) {
                        $scope.surveys.splice(i, 1);
                    }
                }
            } else {
                $scope.survey.$remove(function () {
                    $location.path('surveys');
                });
            }
        };

        // Update existing Survey
        $scope.update = function () {
            var survey = $scope.survey;

            survey.$update(function () {
                $location.path('surveys/' + survey._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Surveys
        $scope.find = function () {
            $scope.surveys = Surveys.query();
        };

        // Find existing Survey
        $scope.findOne = function () {
            $scope.survey = Surveys.get({
                surveyId: $stateParams.surveyId
            });
        };

        // Pages functions
        $scope.addPage = function () {
            var survey = $scope.survey;
            var newPage = new Pages({
                title: this.pageTitle,
                header: this.pageHeader,
                number: this.pageNumber,
                survey: survey._id,
                nextButtonText: this.nextButton,
                previousButtonText: this.previousButton
            });

            newPage.$save(function (response) {
                survey.pages.push(newPage._id);
                survey.$update(function () {
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            this.pageTitle = '';
            this.pageHeader = '';
            this.pageNumber = '';
        };

        $scope.getPage = function () {
            $scope.page = Pages.get({
                pageId: $scope.survey.pages[$scope.pageIndex]._id
            });
        };

        $scope.$watch('survey.pages', function () {
            $scope.getPage();

        });

        $scope.$watch('pageIndex', function () {
            $scope.getPage();
        });

        $scope.previousPage = function () {
            $scope.pageIndex--;
            $scope.formData = {};

        };

        function nextPage() {
            $scope.pageIndex++;
            $scope.formData = {};
            $scope.unchecked = true;
        }

        $scope.startSurvey = function () {
            $scope.pageIndex++;
            $scope.formData = {};
            $scope.unchecked = true;
            $scope.initAnswerSet();
        };

        //Functions for answers
        $scope.initAnswerSet = function () {
            $scope.answerSet = new Answersets({
                survey: $scope.survey._id,
                respondent: Authentication.user._id,
                answers: []
            });
            $scope.answerSet.$save(function (response) {
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        function updateAnswerSet() {
            $scope.answerSet.$update(function () {
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }


        function registerAnswers(){
            var timeout = 0;
            var skipLogic = false;
            angular.forEach($scope.page.questions, function(question){
                var value = $scope.formData[question];
                var answer = new Answers({
                    survey: $scope.survey._id,
                    question: question,
                    answer: value
                });
                timeout =+ 10;
                answer.$save(function (response) {
                    $scope.answerSet.answers.push(answer._id);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
            setTimeout(updateAnswerSet, timeout);
            setTimeout(nextPage, timeout);
        }

        $scope.submitForm = function() {
            registerAnswers();
        };

        $scope.checkBox = function() {
                $scope.unchecked = false;
        };

        $scope.someSelected = function (object) {
            return Object.keys(object).some(function (key) {
                return object[key];
            });
        };
    }

]);
