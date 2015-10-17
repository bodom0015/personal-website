angular
.module('test')
.factory('MapData', [ '$resource', function($resource) {
  return $resource('/app/everquest/map/mapData.json', {})
}])
.factory('MapNodeData', [ '$resource', function($resource) {
  return $resource('/app/everquest/map/eqMapNodes.json', {})    // live JSON data
  //return $resource('/app/everquest/flare.json', {})       // test JSON data
}])
.factory('MapEdgeData', [ '$resource', function($resource) {
  return $resource('/app/everquest/map/eqMapEdges.json', {})
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
}]);