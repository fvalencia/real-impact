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
          getDelaysOnMonthPer: getDelaysOnMonthPer,
          getDistanceDelays: getDistanceDelays,
          getDistanceFromTo: getDistanceFromTo
    };

    function initData(){
      return $http({
          method: 'GET',
          url: '/assets/data/historic-data.json'
        }).then(function(result){
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

    function getDelaysOnMonthPer(month, per, from, to, units) {
      var deferred = $q.defer(), matches = {};

      var key, currentMonth;

      getDataFromTo(from, to, month).then(function(dataFromTo) {

        if(dataFromTo.length > 0){

          if(per === 'days'){
            groupByDays(dataFromTo).then(function (groupedData) {
              var values = [], delays, ratios;
              for (var day in groupedData) {
                delays = getAvg(groupedData[day].delays);
                ratios = getAvg(groupedData[day].ratios);
                values.push({
                  label: day.split("-")[2],
                  delays: delays,
                  ratios: ratios,
                  value: ((units === 'minutes')?delays:ratios)
                });
              };
              deferred.resolve(values);
            });
          }else{
            groupByHours(dataFromTo).then(function (groupedData) {
              var values = [], delays, ratios, label;
              for (var hour in groupedData) {
                delays = getAvg(groupedData[hour].delays);
                ratios = getAvg(groupedData[hour].ratios);
                label = hour.toString();
                label = (label.length === 3)?('0'+label):label;
                label = label.slice(0, 2) + ":" + label.slice(2);
                if(label.length == 5)
                  values.push({
                    label: label,
                    delays: delays,
                    ratios: ratios,
                    value: ((units === 'minutes')?delays:ratios)
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

    function getDataFromTo(from, to, month) {
      var deferred = $q.defer(), result = [];
      self.data.forEach(function(obj, i) {
        if(obj['ORIGIN'] === from && obj['DEST'] === to && obj['FL_DATE'].split("-")[1] === month){
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

    function groupByHours(list) {
      var deferred = $q.defer();
      var key, group = {};

      list.forEach(function (element, i) {
        key = element['CRS_DEP_TIME'];
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

    function getDistanceDelays(month, units) {
      var deferred = $q.defer(), distance ,distances = [];
      self.data.find(function(obj, i) {

        distance = obj['DISTANCE'];

        if(obj['FL_DATE'].split("-")[1] === month){
          if(!distances[distance]){
            distances[distance] = { delays: [] };
          }
          distances[distance].delays.push(obj['ARR_DELAY']);
        }

        if(i === self.data.length - 1 ){
          var values = [], delays, toAnalyze = [];
          for (var distance in distances) {
            delays = getAvg(distances[distance].delays);
            values.push(new DataPoint(parseInt(distance), delays));
            toAnalyze.push({ x: parseInt(distance)});
          };

          var poly = new PolynomialRegression(values, 40);
          var terms = poly.getTerms();
          var regressionData = [];

          toAnalyze.forEach(function(row, j){
            regressionData.push({x: row.x, y: poly.predictY(terms, row.x)});
            if(j === toAnalyze.length - 1 ){
              deferred.resolve(regressionData);
            }
          });
        }
      });

      return deferred.promise;
    }

    function getDistanceFromTo(month, from, to) {
      var deferred = $q.defer(), distance = null;
      self.data.forEach(function(obj, i) {
        if(obj['ORIGIN'] === from && obj['DEST'] === to && obj['FL_DATE'].split("-")[1] === month){
          distance = obj['DISTANCE'];
          deferred.resolve(distance);
          return distance;
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
