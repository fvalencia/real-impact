(function() {
  'use strict';

  angular
      .module('real-impact')
      .factory('GraphBuilderFactory', GraphBuilderFactory);

  /** @ngInject */
  function GraphBuilderFactory() {

    var self = this;

    self.height = 450;
    self.margin = {
        top: 40,
        right: 20,
        bottom: 70,
        left: 70
    };
    self.maxDelay = 20;
    self.midDelay = 10;
    self.red = '#f44336';
    self.yellow = '#ffeb3b';
    self.green = '#4caf50';
    self.delay = 200;

    return {
      discreteBarChart: discreteBarChart
    };

    function discreteBarChart(values) {
      var options = {
        chart: {
            type: 'discreteBarChart',
            height: self.height,
            margin : self.margin,
            x: function(d){ return d.label; },
            y: function(d){ return d.value; },
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.0f')(d);
            },
            color: function (d, i) {
                if (d.value > self.maxDelay){
                  return self.red;
                }else if(d.value > self.midDelay){
                  return self.yellow;
                }else{
                  return self.green;
                }
            },
            duration: self.delay,
            xAxis: {
                axisLabel: 'Days',
                axisLabelDistance: 10
            },
            yAxis: {
                axisLabel: 'Arrival Delay (Minutes)',
                axisLabelDistance: 0
            },
            tooltip:{
              classes: 'graph-tooltip md-whiteframe-z1',
              valueFormatter: function (d, i) {
                return d3.format(',.0f')(d)+' minutes of arrival delay';
              },
              keyFormatter:function (d, i) {
                return 'on January '+d;
              }
            }
        },
        title:{
          enable: true,
          text: "Flights arraival delay per day on January",
          className: "graph-title"
        },
        subtitle:{
          enable: true,
          text: "Higher columns means more delay",
          className: "graph-subtitle"
        }
      };

      var data = [
        {
            key: 'January Delay per day',
            values: values
        }
      ];

      return {
        options: options,
        data: data
      };

    }


  }

})();
