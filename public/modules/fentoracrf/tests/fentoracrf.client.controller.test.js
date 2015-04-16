'use strict';

(function() {
	// Fentoracrf Controller Spec
	describe('Fentoracrf Controller Tests', function() {
		// Initialize global variables
		var FentoracrfController,
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

			// Initialize the Fentoracrf controller.
			FentoracrfController = $controller('FentoracrfController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fentoracrf object fetched from XHR', inject(function(Fentoracrf) {
			// Create sample Fentoracrf using the Fentoracrf service
			var sampleFentoracrf = new Fentoracrf({
				name: 'New Fentoracrf'
			});



			// Set GET response
			$httpBackend.expectGET('fentoracrf').respond(sampleFentoracrf);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fentoracrf).toEqualData(sampleFentoracrf);
		}));

		it('$scope.findOne() should create an array with one Fentoracrf object fetched from XHR using a fentoracrfId URL parameter', inject(function(Fentoracrf) {
			// Define a sample Fentoracrf object
			var sampleFentoracrf = new Fentoracrf({
				name: 'New Fentoracrf'
			});

			// Set the URL parameter
			$stateParams.fentoracrfId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fentoracrf\/([0-9a-fA-F]{24})$/).respond(sampleFentoracrf);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fentoracrf).toEqualData(sampleFentoracrf);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fentoracrf) {
			// Create a sample Fentoracrf object
			var sampleFentoracrfPostData = new Fentoracrf({
				name: 'New Fentoracrf'
			});

			// Create a sample Fentoracrf response
			var sampleFentoracrfResponse = new Fentoracrf({
				_id: '525cf20451979dea2c000001',
				name: 'New Fentoracrf'
			});

			// Fixture mock form input values
			scope.name = 'New Fentoracrf';

			// Set POST response
			$httpBackend.expectPOST('fentoracrf', sampleFentoracrfPostData).respond(sampleFentoracrfResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fentoracrf was created
			expect($location.path()).toBe('/fentoracrf/' + sampleFentoracrfResponse._id);
		}));

		it('$scope.update() should update a valid Fentoracrf', inject(function(Fentoracrf) {
			// Define a sample Fentoracrf put data
			var sampleFentoracrfPutData = new Fentoracrf({
				_id: '525cf20451979dea2c000001',
				name: 'New Fentoracrf'
			});

			// Mock Fentoracrf in scope
			scope.fentoracrf = sampleFentoracrfPutData;

			// Set PUT response
			$httpBackend.expectPUT(/fentoracrf\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fentoracrf/' + sampleFentoracrfPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fentoracrfId and remove the Fentoracrf from the scope', inject(function(Fentoracrf) {
			// Create new Fentoracrf object
			var sampleFentoracrf = new Fentoracrf({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fentoracrf array and include the Fentoracrf
			scope.fentoracrf = [sampleFentoracrf];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fentoracrf\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFentoracrf);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fentoracrf.length).toBe(0);
		}));
	});
}());
