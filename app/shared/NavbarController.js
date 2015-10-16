angular
.module('test')
.factory('appConfig', function() {
	var appConfig = {
		title: ''
	};
	return appConfig;
})
.filter('navbar', function() {
  return function(input, pull) {
		var filtered = [];
		
		var matches;
		switch (pull) {
			case 'left':
				matches = function(nav) { return !nav.right };
				break;
			case 'right':
				matches = function(nav) { return !nav.right };
				break;
		}

		if (!matches) {
			return input;
		}
		
		angular.forEach(input, function(nav) {
			if (pull === 'right' && nav.right === true) {
				filtered.push(nav);
			} else if (pull === 'left' && !nav.right) {
				filtered.push(nav);
			}
		});
		return filtered;
  };
})
.controller('NavbarController', [ '$scope', '$location', 'appConfig', function($scope, $location, appConfig) {
	$scope.appConfig = appConfig;
	
	$scope.$watch('appConfig.title', function(newValue, oldValue) {
		$scope.title = newValue;
	});
	
	$scope.$watch('appConfig.path', function(newValue, oldValue) {
		$scope.path = $scope.home.url + newValue;
 });

	// TODO: This is probably horrible, performance-wise
	$scope.isArray = angular.isArray;
	
	$scope.home = 
	{
		name:'Mike Lambert',
		url:'http://bodom0015.game-server.cc/#/'
	};
		
	$scope.navs = [
		/*{
			name: 'Welcome!',
			url: $scope.home.url
		},*/
		{
			name:'EverQuest',
			right: true,
			isOpen: false,
			url: [
				{
					name: 'Map of Norrath',
					url: $scope.home.url + 'everquest/regions'
				},
				{
					name: 'EverQuest Lore',
					url: $scope.home.url + 'everquest/lore'
				},
				{
					name: 'EverQuest Basics',
					url: $scope.home.url + 'everquest/basics'
				},
				{
					name: 'Useful Links',
					url: $scope.home.url + 'everquest/links'
				},
				{
					name: 'Meet the Krosarmy',
					url: $scope.home.url + 'everquest/krosarmy'
				},
				{
					name: 'Spell Search (Pre-Alpha)',
					url: $scope.home.url + 'everquest/spellSearch'
				}
			],
		},
		{
			name:'Minecraft',
			right:true,
			isOpen: false,
			url:[
				{
					name:'Server Status',
					url: $scope.home.url + 'minecraft'
				},
				{
					name:'Play Minecraft With Us!',
					url: $scope.home.url + 'minecraft/help'
				},
			]
		},
		{
			name:'Ventrilo',
			url: $scope.home.url + 'ventrilo',
			right: true
		},
	];
}]);