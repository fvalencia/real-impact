(function() {
  'use strict';

  angular
    .module('real-impact')
    .config(config);

  /** @ngInject */
  function config($logProvider, $mdThemingProvider) {
    // Enable log
    var myStyle = $mdThemingProvider.extendPalette('orange', {
      'contrastDefaultColor': 'light'
    });

    $mdThemingProvider.definePalette('myStyle', myStyle);

    $mdThemingProvider.theme('default')
    .primaryPalette('myStyle');

    $logProvider.debugEnabled(true);
  }

})();
