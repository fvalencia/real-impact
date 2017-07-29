(function() {
  'use strict';

  angular
    .module('real-impact')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($log, $timeout, HistoricFlyFactory, $mdDialog, GraphBuilderFactory) {
    var vm = this;

    vm.airports = [];
    vm.units = 'minutes';
    vm.per = 'days';

    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.getAnalythics = getAnalythics;
    vm.changeUnits = changeUnits;

    initController();

    function initController() {
      HistoricFlyFactory.getAirPorts().then(function(airtports){
        vm.airports = airtports;
      });
    }

    function querySearch(query) {
      return query
              ? vm.airports.filter(function(element) {
                return (element.name.toLowerCase().search(query.toLowerCase()) > -1 || element.id.toLowerCase().search(query.toLowerCase()) > -1);
              })
              : vm.airports;
    }

    function selectedItemChange(item, from) {
      console.log(item, from);
    }

    function getAnalythics(){
      if(vm.fromItem && vm.fromItem.id && vm.toItem && vm.toItem.id){
        //We sent the month, emulating user input
        HistoricFlyFactory.getDelaysOnMonthPer('01', vm.per,vm.fromItem.id, vm.toItem.id).then(function(result){
          console.log('getStatsOfFlight', result);
          vm.currentList = result;
          changeUnits();

        });
      }else{
        showAlertDialog('Error', 'Please select a From and a To Airports');
      }
    }

    function changeUnits() {

      console.log('Lalala Changed');

      if(vm.currentList){
        if(vm.units === 'minutes'){
          vm.currentList = vm.currentList.map(function (e) {
            e.value = e.delays;
            return e;
          });
        }else{
          vm.currentList = vm.currentList.map(function (e) {
            e.value = e.ratios;
            return e;
          });
        }

        paintGraph();

      }
    }

    function paintGraph() {
      var graphBuilded = GraphBuilderFactory.discreteBarChart(vm.currentList);
      vm.options = graphBuilded.options;
      vm.data = graphBuilded.data;
    }

    function showAlertDialog(title, text){
      $mdDialog.show(
      $mdDialog.alert()
          .parent(angular.element(document.querySelector('.site')))
          .clickOutsideToClose(true)
          .title(title)
          .textContent(text)
          .ariaLabel('Alert Dialog')
          .ok('Got it!')
      );
    }

  }
})();
