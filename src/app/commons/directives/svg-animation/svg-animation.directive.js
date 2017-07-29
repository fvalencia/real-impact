(function () {
  'use strict';

  angular
    .module('real-impact')
    .directive('svgAnimation', svgAnimationDirective);

  /** @ngInject */
  function svgAnimationDirective() {
      return {
        templateUrl: 'app/commons/directives/svg-animation/svg-animation.html',
      }
    }

})();
