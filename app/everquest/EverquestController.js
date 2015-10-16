angular
.module('test')
.filter('reverse', [function () {
	return function (input) {
		if (angular.isArray(input)) {
			return input.reverse();
		}
	};
}])
.filter('startAt', function() {
	return function(input, startIndex, pageSize) {
		var start = startIndex * pageSize;
		var end = start + pageSize;
		return input.slice(start, end);
	};
})
.filter('search', function() {
	return function(input, query, propertyName) {
		if (!query) {
			return [];
		}
	
		var filtered = [];
		angular.forEach(input, function(item) {
			if (item[propertyName].indexOf(query) !== -1) {
				filtered.push(item);
			}
		});
		return filtered;
	};
})
.filter('trimSpa', function() {
	return function(input) {
		var index = input.indexOf(' --- ');
		if (index !== -1) {
			return input.slice(index);
		}
		
		return input;
	};
})
.filter('purgeNullItems', function() {
	return function(input) {
		if (!angular.isArray(input)) {
			return input;
		}
	
		var filtered = [];
		angular.forEach(input, function(item) {
			if (item) {
				filtered.push(item);
			}
		});
		return filtered;
	};
})
.filter('classLvlFormat', function() {
	return function(input, targetClass) {
		var ret = -1;
		if (!input || !input.split) {
			return input;
		}
		angular.forEach(input.split(" "), function(item) {
			var split = item.split("/");
			var cls = split[0];
			var lvl = split[1];
			if (angular.uppercase(cls) === angular.uppercase(targetClass)) {
				item.TargetClassReqLevel = parseInt(lvl);
				ret = lvl;
			}
		});
		return ret;
	};
})
.filter('sortByLevel', ['classLvlFormatFilter', function(classLvlFormatFilter) {
	return function(input, targetClass) {
			return input.sort(function compare(a, b) {
				var aLvl = parseInt(classLvlFormatFilter(a.ClassesLevels, targetClass));
				var bLvl = parseInt(classLvlFormatFilter(b.ClassesLevels, targetClass));
				if (aLvl < bLvl) {
					return -1;
				}
				if (aLvl > bLvl) {
					return 1;
				}
				// a must be equal to b
				return 0;
			});
	}
}])
.filter('andHigher', [ 'classLvlFormatFilter', function(classLvlFormatFilter) {
	return function(input, targetClass, targetLvl) {
		var filtered = [];
		angular.forEach(input, function(item) {
			var lvl = classLvlFormatFilter(item.ClassesLevels, targetClass);
			if (lvl > targetLvl && lvl != 254) {
				filtered.push(item);
			}
		});
		return filtered;
	};
}])
.factory('SpellData', [ '$resource', function($resource) {
	return $resource('/app/everquest/spells.json', {})
}])
.factory('DEBUGSingleSpell', [ '$resource', function($resource) {
	return $resource('/app/everquest/spell.json', {})
}])
.factory('History', [ '$resource', function($resource) {
	return $resource('/app/everquest/ancientHistory.json', {})
}])
.factory('Classes', [ '$resource', function($resource) {
	return $resource('/app/everquest/classes.json', {})
}])
.factory('Races', [ '$resource', function($resource) {
	return $resource('/app/everquest/races.json', {})
}])
.factory('Expansions', [ '$resource', function($resource) {
	return $resource('/app/everquest/expansions.json', {})
}])
.factory('ServerMap', [ '$resource', function($resource) {
	return $resource('/app/everquest/characters.json', {})
}])
.factory('Links', [ '$resource', function($resource) {
	return $resource('/app/everquest/links.json', {})
}])
.controller('SpellTestController', [ '$scope', 'appConfig', 'SpellData', function($scope, appConfig, SpellData) {
	$scope.appConfig = appConfig;
	appConfig.title = 'EQ Spell Search (Pre-Alpha)'
	appConfig.path = "everquest/spellSearch/";
	
	$scope.loading = true;

	$scope.spells = [];
	
	// Load the data from the JSON on the server
	SpellData.query(function(data, headers) {
		$scope.spells = data;
		console.log("Successfully loaded spell data!");
	}, function() {
		console.log("Error loading spell data!");
	}).$promise.finally(function() {
		$scope.loading = false;
	});
	
	$scope.pageSizes = [ 1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000 ];
	$scope.pageSize = 50;
	$scope.currentPage = 0;
	
	$scope.query = '';
	
	$scope.setPageSize = function(size) {
		$scope.pageSize = size;
		$scope.currentPage = 0;
	};
	
	$scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.prevPageDisabled = function() {
    return $scope.currentPage === 0;
  };

  $scope.pageCount = function() {
    return Math.ceil($scope.spells.length / $scope.pageSize) - 1;
  };

  $scope.pageRange = function(currentPage) {
		return [currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2];
  };
	
  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function() {
    return $scope.currentPage === $scope.pageCount();
  };
	
	$scope.gotoPage = function(page) {
		$scope.currentPage = page;
	};
}])
.controller('EverquestLinksController', [ '$scope', 'appConfig', 'Links', function($scope, appConfig, Links) {
  appConfig.title = 'Useful EverQuest Info';
	
	$scope.links = Links.get();
}])
.controller('KrosarmyController', [ '$scope', '$window', 'appConfig', 'ServerMap', function($scope, $window, appConfig, ServerMap) {
  appConfig.title = 'Welcome to the Krosarmy!';
	
	$scope.streamOnline = false;
					
	$scope.openMagelo = function(character) {
		$window.open('http://eq.magelo.com/profile/' + character.mageloId, character.fullName + ' - Level ' + character.level + " " + character.className, 'width=800,height=600');
	};
					
	$scope.ifExists = function(varName, front) {
		if (front) {
			return !varName ? "" : " " + varName;
		} else {
			return !varName ? "" : varName + " ";
		}
	};
	
	// Map out the characters by server
	$scope.servers = ServerMap.get();
}])
.filter('filterBy', [function () {
	return function (input, keyName, query) {
		if (!angular.isArray(input)) {
			return input;
		}
		
		var ret = [];
		angular.forEach(input, function(item) {
			if (query === item[keyName]) {
				ret.push(item);
			}
		});
		
		return ret;
	};
}])
.factory('MapData', [ '$resource', function($resource) {
	return $resource('/app/everquest/mapData.json', {})
}])
.factory('MapNodeData', [ '$resource', function($resource) {
	return $resource('/app/everquest/eqMapNodes.json', {}) 		// live JSON data
	//return $resource('/app/everquest/flare.json', {}) 			// test JSON data
}])
.factory('MapEdgeData', [ '$resource', function($resource) {
	return $resource('/app/everquest/eqMapEdges.json', {})
}])
.controller('EverquestMapController', [ '$scope', '$window', 'appConfig', 'MapData', 'MapNodeData', 'MapEdgeData', '$http', function($scope, $window, appConfig, MapData, MapNodeData, MapEdgeData, $http) {
  appConfig.title = 'EverQuest: Map of Norrath';
	//$scope.mapData = MapData.get();
	//$scope.edges = MapEdgeData.query();
	
	// Populate EQ Region Graph
	$scope.dLabel = "The Norrathian Solar System";
	MapNodeData.get({}, function(value, headers) {
		$scope.d3Data = $scope.nodes = value;
	});
}])
.factory('TimeLineLanes', [ '$resource', function($resource) {
	return $resource('/app/everquest/eqTimelineLanes.json', {})
}])
.factory('TimeLineItems', [ '$resource', function($resource) {
	return $resource('/app/everquest/eqTimelineItems.json', {})
}])
.controller('EverquestLoreController', [ '$scope', 'appConfig', 'History', 'Expansions', 'TimeLineLanes', 'TimeLineItems', function($scope, appConfig, History, Expansions, TimeLineLanes, TimeLineItems) {
	appConfig.title = 'EverQuest Lore';
	// Categorical Lanes
	/*TimeLineLanes.query(function(value, headers) {
		$scope.lanes = value;
	}); 
	
	// Populate lanes with items
	TimeLineItems.query(function(value, headers) {
		$scope.items = value;
	});*/
	
	$scope.lanes = ["Chinese","Japanese","Korean"];
	
	$scope.items = [{"lane": 0, "id": "Qin", "start": 5, "end": 205},
				{"lane": 0, "id": "Jin", "start": 265, "end": 420},
				{"lane": 0, "id": "Sui", "start": 580, "end": 615},
				{"lane": 0, "id": "Tang", "start": 620, "end": 900},
				{"lane": 0, "id": "Song", "start": 960, "end": 1265},
				{"lane": 0, "id": "Yuan", "start": 1270, "end": 1365},
				{"lane": 0, "id": "Ming", "start": 1370, "end": 1640},
				{"lane": 0, "id": "Qing", "start": 1645, "end": 1910},
				{"lane": 1, "id": "Yamato", "start": 300, "end": 530},
				{"lane": 1, "id": "Asuka", "start": 550, "end": 700},
				{"lane": 1, "id": "Nara", "start": 710, "end": 790},
				{"lane": 1, "id": "Heian", "start": 800, "end": 1180},
				{"lane": 1, "id": "Kamakura", "start": 1190, "end": 1330},
				{"lane": 1, "id": "Muromachi", "start": 1340, "end": 1560},
				{"lane": 1, "id": "Edo", "start": 1610, "end": 1860},
				{"lane": 1, "id": "Meiji", "start": 1870, "end": 1900},
				{"lane": 1, "id": "Taisho", "start": 1910, "end": 1920},
				{"lane": 1, "id": "Showa", "start": 1925, "end": 1985},
				{"lane": 1, "id": "Heisei", "start": 1990, "end": 1995},
				{"lane": 2, "id": "Three Kingdoms", "start": 10, "end": 670},
				{"lane": 2, "id": "North and South States", "start": 690, "end": 900},
				{"lane": 2, "id": "Goryeo", "start": 920, "end": 1380},
				{"lane": 2, "id": "Joseon", "start": 1390, "end": 1890},
				{"lane": 2, "id": "Korean Empire", "start": 1900, "end": 1945}];
				
	$scope.timeBegin = 0;
	$scope.timeEnd = 2000;
	
	History.query(function(value, headers) {
		$scope.ancientHistory = value;
	});
	Expansions.query(function(value, headers) {
		$scope.expacs = value;
	});
}])
.controller('EverquestBasicsController', [ '$scope', '$window', 'appConfig', 'Classes', 'Races', function($scope, $window, appConfig, Classes, Races) {
  appConfig.title = 'EverQuest: Basics';
		
	$scope.selectedClassKey = 'archetype';
	$scope.selectClassKey = function(keyName) {
		$scope.selectedClassKey = keyName;
	};
	
	$scope.alignments = [ 'Good', 'Neutral', 'Evil' ];	
	$scope.keys = {
		'role': { name: "Role", value: [ 'Tank', 'Damage', 'Healing' ] },
		'archetype': { name: "Archetype", value: [ 'Melee', 'Caster', 'Hybrid' ] },
		'armorType': { name: "Armor Type", value:  [ 'Plate', 'Chain', 'Leather', 'Cloth' ] },
		//weaponType: [ '1H Blunt', '1H Slashing', '1H Piercing', 'Throwing', 'Archery', 'Hand-to-Hand', '2H Blunt', '2H Slashing', '2H Piercing', ] // TODO: Figure out how this will look
	}
	
	$scope.races = Races.query();
	$scope.classes = Classes.query();
}]);