(function() {
	'use strict';
	angular.module('VotExApp').controller('HelpCtrl', [ '$http','$log',
	function HelpCtrl( $http, $log ) {
		var vm = this;
		$log.log("Help");
	}]);
})();
