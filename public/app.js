(function() {
    'use strict';
    angular.module('VotExApp', ['ngRoute',  'ngMaterial','ngMdIcons','ngMessages','chart.js'])
    .config(['$routeProvider', '$mdThemingProvider', 'ChartJsProvider', function($routeProvider, $mdThemingProvider,ChartJsProvider){
      // Configure all charts
      ChartJsProvider.setOptions({
        colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
      });
      $routeProvider
      .when('/pollings', {
          templateUrl : 'modules/pollings/pollings.html'
      })
      .when('/totals', {
          templateUrl : 'modules/totals/totals.html',
          controller  : 'TotalsCtrl as ctrl'
      })
      .when('/check', {
          templateUrl : 'modules/check/check.html',
          controller  : 'CheckCtrl as ctrl'
      })
      .when('/help', {
          templateUrl : 'modules/help/help.html',
          controller  : 'HelpCtrl'
      })
      .when('/simulation', {
          templateUrl : 'modules/simulation/simulation.html',
          controller  : 'SimulationCtrl'
      })
      .otherwise({
          redirectTo: '/pollings'
      });
      $mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('orange');
    }]).controller('AppCtrl', ['$scope', '$mdSidenav','$log', function($scope, $mdSidenav, $log){
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.close = function (menuId) {
          // Component lookup should always be available since we are not using `ng-if`
          $mdSidenav(menuId).close()
            .then(function () {
              $log.debug("close "+menuId+" is done");
            });
        };
    }]);
})();
