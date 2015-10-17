angular
.module('test')
.factory('ServerMap', [ '$resource', function($resource) {
  return $resource('/app/everquest/krosarmy/characters.json', {})
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
}]);