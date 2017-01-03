(function() {
	'use strict';
	angular.module('VotExApp').controller('PollingsCtrl', [ '$http','$log','$q','$timeout','$scope','$location',
	function PollingsCtrl( $http, $log,$q ,$timeout, $scope, $location) {
		var vm = this;
		$scope.imagePath = 'img/washedout.png';
		self.serverURL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		var urlpollings = serverURL + "/pollings";
		vm.loadPollings = function(){
			if ('caches' in window) {
			  caches.match(urlpollings).then(function(response) {
			  	console.log("load pollings caches.match",urlpollings,response);
			    if (response === undefined) {
					$http.get(urlpollings).then(function(data){
						vm.pollings  = data.data;
						console.log("data urlpollings", data);
						console.log("vm.pollings", vm.pollings);
					}, function(error){
						$log.log("urlpollings error", error);
					});
			    }
			  });
			} else {
				console.log("not load pollings");
			}
		}
		vm.loadPollings();
	    var poll = JSON.parse(localStorage.getItem('poll'));
	    console.log("poll",poll)
	    if(poll !== null){
	    	vm.poll = poll
	    	vm.poll = poll
	    	vm.selectedItem  = poll
	    } else {
	    	vm.selectedItem = null
	    	vm.poll = null
	    }
	    vm.searchText = null;
	    vm.querySearch = querySearch;
	    vm.noCache = true
	    // ******************************
	    // Internal methods
	    // ******************************
	    function querySearch (query) {
	      return query ? vm.pollings.filter( createFilterFor(query) ) : vm.pollings;
	    }
	    function createFilterFor(query) {
	      var lowercaseQuery = angular.lowercase(query);
	      return function filterFn(poll) {
	      	var polllower = angular.lowercase(poll.title);
	        return (polllower.indexOf(lowercaseQuery) === 0);
	      };
	    }
	    vm.selectPoll = function(pollselected){
	    	vm.poll = pollselected
	    	console.log("pollselected",vm.poll)
	    	localStorage.setItem('poll', JSON.stringify(pollselected));
	    }
			vm.checkMyVote = function(){
				console.log("check my vote clicked")
				$location.path("/check");
			}
			vm.totals = function(){
				console.log("totals clicked")
				$location.path("/totals");
			}
			vm.help = function(){
				console.log("help clicked")
				$location.path("/help");
			}
	}]);
})();
