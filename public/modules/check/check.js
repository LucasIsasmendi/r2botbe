(function() {
	'use strict';
	angular.module('VotExApp').controller('CheckCtrl', [ '$http','$log',
	function CheckCtrl( $http, $log ) {
		var vm = this;
		var ipfsmain = 'https://gateway.ipfs.io/ipfs/';
		var poll = JSON.parse(localStorage.getItem('poll'));
		vm.votesready = false;
		vm.search = {
			valid: false,
			invalid:false
		}
		self.serverURL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		vm.loadVaidVotes = function(){
			$http.get(ipfsmain + poll.ipfs.validvotes).then(function(data){
				console.log("ipfs valid votes data: ",data);
				vm.validvotes = data.data;
				vm.votesready = true;
			}, function(error){
				$log.log("error loading valid votes from IPFS", error);
			});
		}
		vm.loadVaidVotes();
		vm.searchAddress = function(){
			vm.search = {
				valid: false,
				invalid:false
			}
			console.log("address", vm.addressinput);
			var isvalidvote = _.findIndex(vm.validvotes, function(ballot) {
				return ballot.address.hash === vm.addressinput;
			});
			if(isvalidvote === -1){
				// no valid
				vm.search.invalid = true;
				console.log("invalid vote");
			} else {
				// valid
				vm.search.valid = true;
				vm.vote = vm.validvotes[isvalidvote];
				vm.name = poll.candidates[vm.vote.candidateN];
				console.log("valid vm.vote",vm.vote);
			}
		}
		console.log("ctrl.addressinput.length",vm.addressinput);
	}]);
})();
