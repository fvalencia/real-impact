describe('HomeController', function () {
  beforeEach(module('real-impact'));

  var suite = {};

  beforeEach(inject(function ($injector) {
    suite.$controller = $injector.get('$controller');
    suite.$rootScope = $injector.get('$rootScope');
    suite.$q = $injector.get('$q');
    suite.$mdDialog =  $injector.get('$mdDialog');
    suite.$log =  $injector.get('$log');
    suite.$timeout = $injector.get('$timeout');
    suite.$mdToast = $injector.get('$mdToast');
    suite.$anchorScroll = $injector.get('$anchorScroll');
    suite.$location = $injector.get('$location');

    suite.HistoricFlightsFactoryMock = {
      initData: function(){
        suite.queryDeferred = suite.$q.defer();
        return suite.queryDeferred.promise;
      },
      initDataAirports: function(){
        suite.queryDeferred = suite.$q.defer();
        return suite.queryDeferred.promise;
      },
      getAirPorts: function(){
        suite.queryDeferred = suite.$q.defer();
        return suite.queryDeferred.promise;
      },
      getDelaysOnMonthPer: function(){
        suite.queryDeferred = suite.$q.defer();
        return suite.queryDeferred.promise;
      },
      getDistanceDelays: function(){
        suite.queryDeferred = suite.$q.defer();
        return suite.queryDeferred.promise;
      },
      getDistanceFromTo: function(){
        suite.queryDeferred = suite.$q.defer();
        return suite.queryDeferred.promise;
      },
      getPredictedY: function(){
        return 123;
      },
    }

    suite.GraphBuilderFactoryMock = {
      discreteBarChart:function(){
        return {
          data: [1,2,3],
          options: {
            chart:{
              property: true
            }
          }
        };
      },
      lineChart:function(){
        return {
          data: [1,2,3],
          options: {
            chart:{
              property: true
            }
          }
        };
      }
    }

    suite.vm = suite.$controller('HomeController', {
      $log: suite.$log,
      $timeout: suite.$timeout,
      HistoricFlightsFactory : suite.HistoricFlightsFactoryMock,
      $mdDialog: suite.$mdDialog,
      GraphBuilderFactory: suite.GraphBuilderFactoryMock,
      $mdToast: suite.$mdToast,
      $anchorScroll: suite.$anchorScroll,
      $location: suite.$location
    });

  }));

  afterEach(function () {
    suite = {};
  });

  afterAll(function () {
    suite = null;
  });

  function resolveAndRefresh(data){
  	suite.queryDeferred.resolve(data);
	  suite.$rootScope.$apply();
  }

  function rejectAndRefresh(data){
  	suite.queryDeferred.reject(data);
	  suite.$rootScope.$apply();
  }

  describe('initController function', function () {

    it('if call getAirPorts', function () {

      spyOn(suite.HistoricFlightsFactoryMock, 'getAirPorts').and.callThrough();
      spyOn(suite.HistoricFlightsFactoryMock, 'getDistanceDelays').and.callThrough();

      suite.vm.initController();
   	  resolveAndRefresh({});

      expect(suite.HistoricFlightsFactoryMock.getAirPorts).toHaveBeenCalled();
      expect(suite.HistoricFlightsFactoryMock.getDistanceDelays).toHaveBeenCalled();

    });

  });

});
