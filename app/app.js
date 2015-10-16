'use strict';

angular
.module('test', [ 'ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'd3', 'd3.directives', 'sticky', 'duScroll'])
.config([ '$routeProvider', function($routeProvider) {
  $routeProvider.when('/minecraft', {
    controller: 'MinecraftController',
    templateUrl: '/app/minecraft/minecraft.html'
  })
  .when('/minecraft/help', {
    controller: 'MinecraftHelpController',
    templateUrl: '/app/minecraft/minecraft-help.html'
  })
  .when('/ventrilo', {
    controller: 'VentriloController',
    templateUrl: '/app/ventrilo/ventrilo.php'
  })
  .when('/everquest/spellSearch', {
    controller: 'SpellTestController',
    templateUrl: '/app/everquest/spellFileTest.html'
  })
  .when('/everquest/regions', {
    controller: 'EverquestMapController',
    templateUrl: '/app/everquest/eqMap.html'
  })
  .when('/everquest/basics', {
    controller: 'EverquestBasicsController',
    templateUrl: '/app/everquest/eqBasics.html'
  })
  .when('/everquest/lore', {
    controller: 'EverquestLoreController',
    templateUrl: '/app/everquest/eqLore.html'
  })
  .when('/everquest/krosarmy', {
    controller: 'KrosarmyController',
    templateUrl: '/app/everquest/krosarmy.html'
  })
  .when('/everquest/links', {
    controller: 'EverquestLinksController',
    templateUrl: '/app/everquest/usefulLinks.html'
  })
  .when('/everquest/tradeskills', {
    controller: 'EverquestTradeskillsController',
    templateUrl: '/app/everquest/eqTradeskills.html'
  })
  .when('/welcome', {
    controller: 'WelcomeController',
    templateUrl: '/app/shared/welcome.html'
  })
  .otherwise({redirectTo: '/welcome'});
}])
.run([ 'appConfig', function(appConfig) {
  appConfig.title = 'bodom0015.game-server.cc';
}]);