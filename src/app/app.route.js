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
          initData: function (HistoricFlyFactory) {
            return HistoricFlyFactory.initData();
          },
          initDataAirtports: function (HistoricFlyFactory) {
            return HistoricFlyFactory.initDataAirports();
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
