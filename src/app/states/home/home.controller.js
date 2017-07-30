(function() {
  'use strict';

  angular
    .module('real-impact')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($log, $timeout, HistoricFlyFactory, $mdDialog, GraphBuilderFactory, $mdToast, $anchorScroll, $location) {
    var vm = this;

    vm.airports = [];
    vm.units = 'minutes';
    vm.per = 'hours';
    vm.chartVisible = true;

    vm.querySearch = querySearch;
    vm.getAnalythics = getAnalythics;
    vm.changeUnits = changeUnits;
    vm.changePer = changePer;
    vm.changeScroll = changeScroll;

    initController();

    function initController() {
      HistoricFlyFactory.getAirPorts().then(function(airtports){
        vm.airports = airtports;
      });

      HistoricFlyFactory.getDistanceDelays('01').then(function(result){
        vm.correlationData = result;
        paintGraph('lineChart');
      });

    }

    function querySearch(query) {
      return query
              ? vm.airports.filter(function(element) {
                return (element.name.toLowerCase().search(query.toLowerCase()) > -1 || element.id.toLowerCase().search(query.toLowerCase()) > -1);
              })
              : vm.airports;
    }

    function getAnalythics(){
      if(vm.fromItem && vm.fromItem.id && vm.toItem && vm.toItem.id){
        //We sent the month, emulating user input
        HistoricFlyFactory.getDelaysOnMonthPer('01', vm.per,vm.fromItem.id, vm.toItem.id, vm.units).then(function(result){

          if(result.length === 0){
            vm.chartVisible = false;
            showAlertDialog('Alert', 'Not Data Found');
          }else{
            vm.chartVisible = true;
          }

          HistoricFlyFactory.getDistanceFromTo('01',vm.fromItem.id, vm.toItem.id).then(function(distance){
            showToast('Current Selection Distance: '+distance+'mi');
          });

          vm.currentList = result;
          vm.showOpts = {
            month: getMonth('01'),
            units: vm.units,
            per: vm.per
          }
          paintGraph('discreteBarChart');
        });

      }else{
        showAlertDialog('Error', 'Please select a From and a To Airports');
      }
    }

    function changeUnits() {

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
        vm.showOpts.units = vm.units;
        paintGraph('discreteBarChart');
      }
    }

    function changePer(){
      getAnalythics();
    }

    function paintGraph(type) {
      if(type === 'discreteBarChart'){
        var graphBuilded = GraphBuilderFactory.discreteBarChart(vm.currentList, vm.showOpts);
        vm.options = graphBuilded.options;
        vm.data = graphBuilded.data;
      }

      if(type === 'lineChart'){
        var graphBuilded = GraphBuilderFactory.lineChart(vm.correlationData);
        vm.options2 = graphBuilded.options;
        vm.data2 = graphBuilded.data;
      }

    }

    function getMonth(month){
      var months = [];
      months['01'] = 'January';
      months['02'] = 'February';
      months['03'] = 'March';
      months['04'] = 'April';
      months['05'] = 'May';
      months['06'] = 'June';
      months['07'] = 'July';
      months['08'] = 'August';
      months['09'] = 'September';
      months['10'] = 'October';
      months['11'] = 'November';
      months['12'] = 'December';

      return months[month];
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

    function showToast(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position('top right')
          .hideDelay(6000)
          .highlightClass('md-primary')
          .action('CLOSE')
      );

    };

    function changeScroll(){
      $timeout(function(){
        $location.hash('crr');
        $anchorScroll();
      },200);
    }

  }
})();
