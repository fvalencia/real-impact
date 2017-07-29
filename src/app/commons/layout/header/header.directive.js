(function () {
  'use strict';

  angular
    .module('real-impact')
    .directive('headerApp', headerDirective);

  /** @ngInject */
  function headerDirective() {
      return {
        templateUrl: 'app/commons/layout/header/header.html',
      }
    }

})();
