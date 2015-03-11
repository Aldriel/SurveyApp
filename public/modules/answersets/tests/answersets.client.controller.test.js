'use strict';

(function() {
	// Answersets Controller Spec
	describe('Answersets Controller Tests', function() {
		// Initialize global variables
		var AnswersetsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Answersets controller.
			AnswersetsController = $controller('AnswersetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Answerset object fetched from XHR', inject(function(Answersets) {
			// Create sample Answerset using the Answersets service
			var sampleAnswerset = new Answersets({
				name: 'New Answerset'
			});

			// Create a sample Answersets array that includes the new Answerset
			var sampleAnswersets = [sampleAnswerset];

			// Set GET response
			$httpBackend.expectGET('answersets').respond(sampleAnswersets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.answersets).toEqualData(sampleAnswersets);
		}));

		it('$scope.findOne() should create an array with one Answerset object fetched from XHR using a answersetId URL parameter', inject(function(Answersets) {
			// Define a sample Answerset object
			var sampleAnswerset = new Answersets({
				name: 'New Answerset'
			});

			// Set the URL parameter
			$stateParams.answersetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/answersets\/([0-9a-fA-F]{24})$/).respond(sampleAnswerset);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.answerset).toEqualData(sampleAnswerset);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Answersets) {
			// Create a sample Answerset object
			var sampleAnswersetPostData = new Answersets({
				name: 'New Answerset'
			});

			// Create a sample Answerset response
			var sampleAnswersetResponse = new Answersets({
				_id: '525cf20451979dea2c000001',
				name: 'New Answerset'
			});

			// Fixture mock form input values
			scope.name = 'New Answerset';

			// Set POST response
			$httpBackend.expectPOST('answersets', sampleAnswersetPostData).respond(sampleAnswersetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Answerset was created
			expect($location.path()).toBe('/answersets/' + sampleAnswersetResponse._id);
		}));

		it('$scope.update() should update a valid Answerset', inject(function(Answersets) {
			// Define a sample Answerset put data
			var sampleAnswersetPutData = new Answersets({
				_id: '525cf20451979dea2c000001',
				name: 'New Answerset'
			});

			// Mock Answerset in scope
			scope.answerset = sampleAnswersetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/answersets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/answersets/' + sampleAnswersetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid answersetId and remove the Answerset from the scope', inject(function(Answersets) {
			// Create new Answerset object
			var sampleAnswerset = new Answersets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Answersets array and include the Answerset
			scope.answersets = [sampleAnswerset];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/answersets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAnswerset);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.answersets.length).toBe(0);
		}));
	});
}());