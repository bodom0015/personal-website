angular
.module('test')
.factory('TimeLineLanes', [ '$resource', function($resource) {
  return $resource('/app/everquest/lore/eqTimelineLanes.json', {})
}])
.factory('TimeLineItems', [ '$resource', function($resource) {
  return $resource('/app/everquest/lore/eqTimelineItems.json', {})
}])
.factory('Expansions', [ '$resource', function($resource) {
  return $resource('/app/everquest/lore/expansions.json', {})
}])
.factory('History', [ '$resource', function($resource) {
  return $resource('/app/everquest/lore/ancientHistory.json', {})
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
}]);