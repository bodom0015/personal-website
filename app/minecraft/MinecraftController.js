angular
.module('test')
// .constant('Hostname', '192.168.88.200') // Home Internal
.constant('Hostname', 'bodom0015.game-server.cc') // Home External
.factory('ServerStatusEndpoint', [ '$resource', function($resource) {
  return {
    getStatus: $resource('/minecraft/status.php', {}, {
      get: {method:'GET', params:{}}
    }).get
  };
}])
.factory('ServerList', [ 'Hostname', function(Hostname) {
  return [
    { host: Hostname, port: 25565, description: 'Survival HQ', gamemode: 'Survival'},
    // {'host': $scope.host, 'port': 25566, 'description': 'Creative HQ with Herblore', 'forge': true, 'gamemode': 'Creative'},
    { host: Hostname, port: 25567, description: 'Zombie City HQ', modUrl: '/minecraft/mods-25567.zip', gamemode: 'Survival'},
    { host: Hostname, port: 25568, description: 'Pixelmon HQ', modUrl: '/minecraft/mods-25568.zip', gamemode: 'Creative'},
    { host: Hostname, port: 25569, description: 'Wasteland HQ', modUrl: '/minecraft/mods-25569.zip', gamemode: 'Creative'},
    // {'host': $scope.host, 'port': 25570, 'description': 'Dragon Block C HQ', 'forge': true, 'gamemode': 'Survival'}
  ];
}])
.controller('MinecraftController', [ '$scope', 'appConfig', 'ServerList', 'ServerStatusEndpoint', function($scope, appConfig, ServerList, ServerStatusEndpoint) {
  appConfig.title = 'Minecraft Server Status';
  
  $scope.servers = ServerList;
  
  $scope.serversDebug = JSON.stringify($scope.servers);
  
  var copyFields = function(fieldNames, src, dest) {
    angular.forEach(fieldNames, function(fieldName) {
      dest[fieldName] = src[fieldName];
    });
  };
  
  
  // Populate results for each server
  $scope.results = [];
  
// Get the server status for each server
  angular.forEach($scope.servers, function(server) {
    ServerStatusEndpoint.getStatus({host: server.host, port: server.port}, function(value, responseHeaders) {
      console.log("Received status for " + server.host + ":" + server.port + "!");
      console.dir(value);
      copyFields([ 'forge', 'description', 'gamemode', 'modUrl', 'host', 'port' ], server, value);
      $scope.results.push(value);
    },
    function(httpResponse) {
      console.log("Failed!");
      console.dir(httpResponse);
      $scope.results.push(server);
    });
  });
}]).controller('MinecraftHelpController', [ '$scope', 'appConfig', 'ServerList', function($scope, appConfig, ServerList) {
  
  appConfig.title = 'Play Minecraft with Us!';
  
  // $scope.host = '192.168.88.200';          // Home Internal
  $scope.host = 'bodom0015.game-server.cc';   // Home External
  
  $scope.servers = ServerList;
  
  $scope.serversDebug = JSON.stringify($scope.servers);
}]);