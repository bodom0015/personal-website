angular
.module('test')
.factory('SpellData', [ '$resource', function($resource) {
  return $resource('/app/everquest/spells/spells.json', {})
}])
.factory('DEBUGSingleSpell', [ '$resource', function($resource) {
  return $resource('/app/everquest/spells/spell.json', {})
}])
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
}]);