/**
 * Created by Maxime on 2015-04-02.
 */
// Pages controller
angular.module('pages').controller('CompensationController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
    function($scope, $stateParams, $location, Authentication, Users) {
        $scope.authentication = Authentication;

        $scope.submitForm = function(){

        }


    }
])
