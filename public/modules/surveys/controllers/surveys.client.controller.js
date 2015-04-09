'use strict';

// Surveys controller
angular.module('surveys').controller('SurveysController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Surveys',  'Pages', 'Questions', 'Answers','Answersets',
	function($scope, $stateParams, $http, $location, Authentication, Surveys, Pages, Questions, Answers, Answersets) {

        $scope.authentication = Authentication;

        $scope.pageIndex = 0;
        $scope.formData = {};
        $scope.answerSet = {};
        $scope.unchecked = true;
        $scope.value =[];
        $scope.nextPageId = '';


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
                previousButtonText: this.previousButton,
                customPageURL: this.customPageURL
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
            var id;
            if ($scope.nextPageId !== ''){
                id = $scope.nextPageId;
            } else {
                id = $scope.survey.pages[$scope.pageIndex]._id;
            }
            $scope.page = Pages.get({
                pageId: id
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
            initPage();

        };

        function initPage() {
            $scope.formData = {};
            $scope.unchecked = true;
            $scope.value =[];
        }

        function nextPage() {
            $scope.pageIndex++;
            initPage();
        }
        $scope.nextSurveyPage = function(){
            nextPage();
        };

        $scope.startSurvey = function () {
            nextPage();
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
            // check to make sure the form is completely valid
            registerAnswers();
        };

        function isPresent(array, element){
            var present = false;
            var i =0;
            while (!present && i< array.length){
                if(array[i] === element){
                    present = true;
                }
            }
            return present;
        }

        $scope.updateQuestionValue = function(choice){

            if($scope.value[choice._id] === true){
                $scope.value[choice._id] = false;
                $scope.unchecked = true;
                for(var i in $scope.value){
                    if($scope.value[i] === true){
                        $scope.unchecked = false;
                    }
                }
            } else {
                $scope.value[choice._id] = true;
                $scope.unchecked = false;
            }
        };


         $scope.checkSurveyLogic= function(pageId){
            if(pageId !== ''){
                $scope.nextPageId = pageId;
            } else {
                $scope.nextPageId = '';
            }
        };

        $scope.credentials ={};
        $scope.compensate = function() {
            $scope.credentials.username =  $scope.credentials.firstName+$scope.credentials.lastName+'@temp.ca';
            $scope.credentials.password = 'tempPassword';
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                nextPage();


            }).error(function(response) {
                $scope.error = response.message;
            });

        };
    }
]);
