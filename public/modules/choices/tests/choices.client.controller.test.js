'use strict';

(function() {
	// Choices Controller Spec
	describe('Choices Controller Tests', function() {
		// Initialize global variables
		var ChoicesController,
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

			// Initialize the Choices controller.
			ChoicesController = $controller('ChoicesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Choice object fetched from XHR', inject(function(Choices) {
			// Create sample Choice using the Choices service
			var sampleChoice = new Choices({
				name: 'New Choice'
			});

			// Create a sample Choices array that includes the new Choice
			var sampleChoices = [sampleChoice];

			// Set GET response
			$httpBackend.expectGET('choices').respond(sampleChoices);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.choices).toEqualData(sampleChoices);
		}));

		it('$scope.findOne() should create an array with one Choice object fetched from XHR using a choiceId URL parameter', inject(function(Choices) {
			// Define a sample Choice object
			var sampleChoice = new Choices({
				name: 'New Choice'
			});

			// Set the URL parameter
			$stateParams.choiceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/choices\/([0-9a-fA-F]{24})$/).respond(sampleChoice);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.choice).toEqualData(sampleChoice);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Choices) {
			// Create a sample Choice object
			var sampleChoicePostData = new Choices({
				name: 'New Choice'
			});

			// Create a sample Choice response
			var sampleChoiceResponse = new Choices({
				_id: '525cf20451979dea2c000001',
				name: 'New Choice'
			});

			// Fixture mock form input values
			scope.name = 'New Choice';

			// Set POST response
			$httpBackend.expectPOST('choices', sampleChoicePostData).respond(sampleChoiceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Choice was created
			expect($location.path()).toBe('/choices/' + sampleChoiceResponse._id);
		}));

		it('$scope.update() should update a valid Choice', inject(function(Choices) {
			// Define a sample Choice put data
			var sampleChoicePutData = new Choices({
				_id: '525cf20451979dea2c000001',
				name: 'New Choice'
			});

			// Mock Choice in scope
			scope.choice = sampleChoicePutData;

			// Set PUT response
			$httpBackend.expectPUT(/choices\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/choices/' + sampleChoicePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid choiceId and remove the Choice from the scope', inject(function(Choices) {
			// Create new Choice object
			var sampleChoice = new Choices({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Choices array and include the Choice
			scope.choices = [sampleChoice];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/choices\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChoice);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.choices.length).toBe(0);
		}));
	});
}());