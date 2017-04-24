var myModule = angular.module('erpregistration', []);
myModule.controller('registration', ['$scope', '$http', function($scope, $http) {
	  $scope.status = "";
	  $scope.tweetlist = [];
	  $scope.loading_class = "hide";
	  $scope.respose	=	"hide";
	  $scope.search = function (){
		if($scope.tweets == "" || $scope.tweets == undefined){
			$scope.status = "Please enter any keyword to search tweets";
			return false;
		}
		else{
			$scope.status = ""
		}
		var json_data	=	{"key" : $scope.tweets};
		$scope.loading_class = "show";
		$http.post("./../../search_tweets", json_data)
		.then(function(response) {
			if(response.status == 200 && response.data.length != 0){
				$scope.tweetlist = response.data;
				$scope.loading_class = "hide";
				$scope.respose		=	"show";
			}
			else{
				$scope.tweetlist = [["No tweets available", "NA"]];
				$scope.loading_class = "hide";
				$scope.respose		=	"show";
			}
		});
	  }

	  $scope.tweet_filter	=	function (){
		if($scope.start_time == undefined && $scope.end_time == undefined){
			$scope.status = "Start time and end time field can not be blank for filter the search";
			return false;
		}
		else{
			$scope.status = ""
		}

		var json_data	=	{"start_time" : $scope.start_time, "end_time" : $scope.end_time};
		$scope.loading_class = "show";
		$http.post("./../../filter_tweets", json_data)
		.then(function(response) {
			if(response.status == 200 && response.data.length != 0){
				$scope.tweetlist = response.data;
				$scope.loading_class = "hide";
				$scope.respose		=	"show";
			}
			else{
				$scope.tweetlist = [["No tweets available", "NA"]];
				$scope.loading_class = "hide";
				$scope.respose		=	"show";
			}
		});
	  }

	 $scope.pull_tweets	=	function (){
	  window.open(location.href+"pull_tweets");
	 }

}]);

