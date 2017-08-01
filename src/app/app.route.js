(function() {
  'use strict';

  angular
    .module('real-impact')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/states/home/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl',
        resolve:{
          initData: function (HistoricFlightsFactory) {
            return HistoricFlightsFactory.initData();
          },
          initDataAirtports: function (HistoricFlightsFactory) {
            return HistoricFlightsFactory.initDataAirports();
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
