'use strict';

(function() {
	// Compensationforms Controller Spec
	describe('Compensationforms Controller Tests', function() {
		// Initialize global variables
		var CompensationformsController,
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

			// Initialize the Compensationforms controller.
			CompensationformsController = $controller('CompensationformsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Compensationform object fetched from XHR', inject(function(Compensationforms) {
			// Create sample Compensationform using the Compensationforms service
			var sampleCompensationform = new Compensationforms({
				name: 'New Compensationform'
			});

			// Create a sample Compensationforms array that includes the new Compensationform
			var sampleCompensationforms = [sampleCompensationform];

			// Set GET response
			$httpBackend.expectGET('compensationforms').respond(sampleCompensationforms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.compensationforms).toEqualData(sampleCompensationforms);
		}));

		it('$scope.findOne() should create an array with one Compensationform object fetched from XHR using a compensationformId URL parameter', inject(function(Compensationforms) {
			// Define a sample Compensationform object
			var sampleCompensationform = new Compensationforms({
				name: 'New Compensationform'
			});

			// Set the URL parameter
			$stateParams.compensationformId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/compensationforms\/([0-9a-fA-F]{24})$/).respond(sampleCompensationform);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.compensationform).toEqualData(sampleCompensationform);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Compensationforms) {
			// Create a sample Compensationform object
			var sampleCompensationformPostData = new Compensationforms({
				name: 'New Compensationform'
			});

			// Create a sample Compensationform response
			var sampleCompensationformResponse = new Compensationforms({
				_id: '525cf20451979dea2c000001',
				name: 'New Compensationform'
			});

			// Fixture mock form input values
			scope.name = 'New Compensationform';

			// Set POST response
			$httpBackend.expectPOST('compensationforms', sampleCompensationformPostData).respond(sampleCompensationformResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Compensationform was created
			expect($location.path()).toBe('/compensationforms/' + sampleCompensationformResponse._id);
		}));

		it('$scope.update() should update a valid Compensationform', inject(function(Compensationforms) {
			// Define a sample Compensationform put data
			var sampleCompensationformPutData = new Compensationforms({
				_id: '525cf20451979dea2c000001',
				name: 'New Compensationform'
			});

			// Mock Compensationform in scope
			scope.compensationform = sampleCompensationformPutData;

			// Set PUT response
			$httpBackend.expectPUT(/compensationforms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/compensationforms/' + sampleCompensationformPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid compensationformId and remove the Compensationform from the scope', inject(function(Compensationforms) {
			// Create new Compensationform object
			var sampleCompensationform = new Compensationforms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Compensationforms array and include the Compensationform
			scope.compensationforms = [sampleCompensationform];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/compensationforms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompensationform);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.compensationforms.length).toBe(0);
		}));
	});
}());