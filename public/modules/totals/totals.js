(function() {
	'use strict';
	angular.module('VotExApp').controller('TotalsCtrl', ['$http','$log', '$scope','$timeout','$mdBottomSheet','$mdToast',
	function TotalsCtrl( $http, $log,$scope, $timeout, $mdBottomSheet, $mdToast ) {
		var vm = this;
		var ipfsmain = 'https://gateway.ipfs.io/ipfs/';
		self.serverURL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		var ipfshash_allvotes, ipfshash_voters, ipfshash_validvotes, poll, candidates;
		var data_allvotes, data_voters, data_validvotes;
		vm.cargaMensajes = function(){
			if(poll !== null){
				poll = JSON.parse(localStorage.getItem('poll'))
				ipfshash_allvotes = poll.ipfs.allvotes;
				ipfshash_voters = poll.ipfs.voters;
				ipfshash_validvotes = poll.ipfs.validvotes;
				candidates = poll.candidates;
				async.parallel([
					function(callback){
						$http.get(ipfsmain + ipfshash_allvotes).then(function(data){
							console.log("ipfshash_allvotes data: ",data);
							data_allvotes = data.data;
							callback(null, 'data_allvotes');
						}, function(error){
							$log.log("error", error);
							callback(error, null);
						});
					},
					function(callback){
						$http.get(ipfsmain + ipfshash_voters).then(function(data){
							console.log("ipfshash_voters data: ",data);
							data_voters = data.data;
							callback(null, 'data_voters');
						}, function(error){
							$log.log("error", error);
							callback(error, null);
						});
					},
					function(callback){
						$http.get(ipfsmain + ipfshash_validvotes).then(function(data){
							console.log("ipfshash_validvotes data: ",data);
							/*
							var a = document.createElement('a');
						  a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(data)));
						  a.setAttribute('download', ipfshash_validvotes);
						  a.click()*/
							data_validvotes = data.data;
							callback(null, 'data_validvotes');
						}, function(error){
							$log.log("error", error);
							callback(error, null);
						});
					}
				], function(err, results){
					console.log("async.parallel results: ", results);
					// if all results are ok, calculate totals: by candidate /valind-invalids
					/* vote is
							{	"candidateN":3,
							"signature":"IM+KtOtqOrMh0rBAbKBfDZvr2kEBEc3nuBGAAw1Iya5aFXPi9jUwkA584R0UCCxbdibGNxQ0obWKm7vjaPaMqw0=",
							"address":{"hash":"e97ad20a5b3ac4aec5fcd7fdd4a4d159fdf49bd2","type":"pubkeyhash","network":"livenet"}
							}
							signature = sign(candidate, private key)
							validation = search address in file
					*/
					var size_allvotes = data_allvotes.length;
					var valids_by_candidate = [0,0,0,0,0,0];
					var invalids_by_candidate = [0,0,0,0,0,0];
					var valid_votes = 0;
					var invalid_votes = 0;
					for(var i =0; i < size_allvotes; i++){
						var vote_to_categorize = data_allvotes[i];
						var isvalidvote = _.findIndex(data_voters, function(ballot) {
							return ballot.address.hash == vote_to_categorize.address.hash;
						});
						if(isvalidvote === -1){
							// invalid
							invalids_by_candidate[vote_to_categorize.candidateN] = 1 + invalids_by_candidate[vote_to_categorize.candidateN];
							invalid_votes = 1 + invalid_votes;
						} else {
							// valid
							valids_by_candidate[vote_to_categorize.candidateN] = 1 + valids_by_candidate[vote_to_categorize.candidateN];
							valid_votes = 1 + valid_votes;
						}
					}
					console.log("invalids_by_candidate",invalids_by_candidate);
					console.log("valids_by_candidate",valids_by_candidate);
					console.log("invalid_votes",invalid_votes);
					console.log("valid_votes",valid_votes);
					console.log("async.parallel err: ", err);
					$scope.validvotes = valids_by_candidate;
					$scope.candidates = candidates;

					//bar chart
					$scope.options = { legend: { display: true } };
				  $scope.labels = candidates;
				  $scope.series = ['Valids', 'Invalids'];
				  $scope.data = [
				    valids_by_candidate,
				    invalids_by_candidate
				  ];
				});
			} else {
				ipfshash_validvotes =1;
				$scope.tituloantena = "Select your poll before check your vote"
			}
		}
		vm.cargaMensajes();
	}]);
})();
