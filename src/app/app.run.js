(function() {
  'use strict';

  angular
    .module('real-impact')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('Run Real-impact...');
  }

})();
