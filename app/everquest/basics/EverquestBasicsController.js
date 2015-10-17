angular
.module('test')
.factory('Classes', [ '$resource', function($resource) {
  return $resource('/app/everquest/basics/classes.json', {})
}])
.factory('Races', [ '$resource', function($resource) {
  return $resource('/app/everquest/basics/races.json', {})
}])
.factory('Links', [ '$resource', function($resource) {
  return $resource('/app/everquest/basics/links.json', {})
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
.controller('EverquestBasicsController', [ '$scope', '$window', 'appConfig', 'Classes', 'Races', 'Links', function($scope, $window, appConfig, Classes, Races, Links) {
  appConfig.title = 'EverQuest: Basics';
  
  $scope.links = Links.get();
    
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