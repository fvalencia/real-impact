(function() {
  'use strict';

  angular
      .module('real-impact')
      .factory('HistoricFlyFactory', HistoricFlyFactory);

  /** @ngInject */
  function HistoricFlyFactory($http, $q) {

    var self = this;
    self.data = null;
    self.dataAirports = null;
    self.airports = null;

    return {
          initData: initData,
          initDataAirports: initDataAirports,
          getAirPorts: getAirPorts,
          getDelaysOnMonthPer: getDelaysOnMonthPer
    };

    function initData(){
      return $http({
          method: 'GET',
          url: '/assets/data/historic-data.json'
        }).then(function(result){
          console.log(result.data);
          self.data = result.data;
        }, function (err) {
          self.data = null;
        });
    }

    function initDataAirports() {
      return $http({
          method: 'GET',
          url: '/assets/data/airports.json'
        }).then(function(result){
          self.dataAirports = result.data;
        }, function (err) {
          self.dataAirports = null;
        });
    }

    function getAirPorts() {

      var deferred = $q.defer(), currentCodes = [];

      self.airports = [];

      self.data.forEach(function(obj, i) {
        if (obj.hasOwnProperty('DEST') && currentCodes.indexOf(obj['DEST']) === -1) {
          currentCodes.push(obj['DEST']);
          self.airports.push({
            id: obj['DEST'],
            name: getNameByCode(obj['DEST']).name
          });
        }
        if (obj.hasOwnProperty('ORIGIN') && currentCodes.indexOf(obj['ORIGIN']) === -1) {
          currentCodes.push(obj['ORIGIN']);
          self.airports.push({
            id: obj['ORIGIN'],
            name: getNameByCode(obj['ORIGIN']).name
          });
        }

        if(i === self.data.length - 1 ){
          deferred.resolve( self.airports );
        }
      });

      return deferred.promise;

    }

    function getNameByCode(code){
      return self.dataAirports.find(function(element) {
        return element.code === code;
      })
    }

    function getDelaysOnMonthPer(month, per, from, to) {
      var deferred = $q.defer(), matches = {};

      var key, currentMonth;

      getDataFromTo(from, to).then(function(dataFromTo) {

        if(dataFromTo.length > 0){

          if(per === 'days'){
            groupByDays(dataFromTo).then(function (groupedData) {
              var values = []
              for (var day in groupedData) {
                values.push({
                  label: day.split("-")[2],
                  delays: getAvg(groupedData[day].delays),
                  ratios: getAvg(groupedData[day].ratios)
                });
              };
              deferred.resolve(values);
            });
          }

        }else{
          deferred.resolve([]);
        }

      });

      return deferred.promise;

    }

    function getDataFromTo(from, to) {
      var deferred = $q.defer(), result = [];
      self.data.forEach(function(obj, i) {
        if(obj['ORIGIN'] === from && obj['DEST'] === to){
          result.push(obj);
        }

        if(i === self.data.length - 1 ){
          deferred.resolve(result);
        }

      });
      return deferred.promise;
    }

    function groupByDays(list) {
      var deferred = $q.defer();
      var key, group = {};

      list.forEach(function (element, i) {
        key = element['FL_DATE'];
        if(!group[key]){
          group[key] = { delays: [], ratios: [] };
        }

        group[key].delays.push(element['ARR_DELAY']);
        group[key].ratios.push((element['ARR_DELAY']/element['CRS_ELAPSED_TIME']) * 100);

        if(i === list.length - 1 ){
          deferred.resolve(group);
        }

      });

      return deferred.promise;

    }

    function getAvg(array) {
      var sum = 0;
      var total = 0;

      for( var i = 0; i < array.length; i++ ){
        if(array[i] !== ""){
          total++;
          sum += array[i];
        }
      }

      return total > 0 ? sum/total : 0;

    }

  }

})();
