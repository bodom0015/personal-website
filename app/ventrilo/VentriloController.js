angular
.module('test')
.controller('VentriloController', [ '$scope', 'appConfig', function($scope, appConfig) {
  appConfig.title = 'Ventrilo Status';
  
  $(function () {
    $('.btn').popover(); // initialized with defaults
  });      
    
  $scope.vent = {
    hostname: 'bodom0015.game-server.cc',
    password: 'moneytrees',
    port: 3784
  };
}]);