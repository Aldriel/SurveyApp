'use strict';

(function() {
	// Patientcrves Controller Spec
	describe('Patientcrves Controller Tests', function() {
		// Initialize global variables
		var PatientcrvesController,
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

			// Initialize the Patientcrves controller.
			PatientcrvesController = $controller('PatientcrvesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Patientcrf object fetched from XHR', inject(function(Patientcrves) {
			// Create sample Patientcrf using the Patientcrves service
			var samplePatientcrf = new Patientcrves({
				name: 'New Patientcrf'
			});

			// Create a sample Patientcrves array that includes the new Patientcrf
			var samplePatientcrves = [samplePatientcrf];

			// Set GET response
			$httpBackend.expectGET('patientcrves').respond(samplePatientcrves);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patientcrves).toEqualData(samplePatientcrves);
		}));

		it('$scope.findOne() should create an array with one Patientcrf object fetched from XHR using a patientcrfId URL parameter', inject(function(Patientcrves) {
			// Define a sample Patientcrf object
			var samplePatientcrf = new Patientcrves({
				name: 'New Patientcrf'
			});

			// Set the URL parameter
			$stateParams.patientcrfId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/patientcrves\/([0-9a-fA-F]{24})$/).respond(samplePatientcrf);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patientcrf).toEqualData(samplePatientcrf);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Patientcrves) {
			// Create a sample Patientcrf object
			var samplePatientcrfPostData = new Patientcrves({
				name: 'New Patientcrf'
			});

			// Create a sample Patientcrf response
			var samplePatientcrfResponse = new Patientcrves({
				_id: '525cf20451979dea2c000001',
				name: 'New Patientcrf'
			});

			// Fixture mock form input values
			scope.name = 'New Patientcrf';

			// Set POST response
			$httpBackend.expectPOST('patientcrves', samplePatientcrfPostData).respond(samplePatientcrfResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Patientcrf was created
			expect($location.path()).toBe('/patientcrves/' + samplePatientcrfResponse._id);
		}));

		it('$scope.update() should update a valid Patientcrf', inject(function(Patientcrves) {
			// Define a sample Patientcrf put data
			var samplePatientcrfPutData = new Patientcrves({
				_id: '525cf20451979dea2c000001',
				name: 'New Patientcrf'
			});

			// Mock Patientcrf in scope
			scope.patientcrf = samplePatientcrfPutData;

			// Set PUT response
			$httpBackend.expectPUT(/patientcrves\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/patientcrves/' + samplePatientcrfPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid patientcrfId and remove the Patientcrf from the scope', inject(function(Patientcrves) {
			// Create new Patientcrf object
			var samplePatientcrf = new Patientcrves({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Patientcrves array and include the Patientcrf
			scope.patientcrves = [samplePatientcrf];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/patientcrves\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePatientcrf);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.patientcrves.length).toBe(0);
		}));
	});
}());