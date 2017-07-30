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
    self.maxDelayMinutes = 20;
    self.midDelayMinutes = 10;
    self.maxDelayPercent = 15;
    self.midDelayPercent = 8;
    self.red = '#f44336';
    self.yellow = '#ffeb3b';
    self.green = '#4caf50';
    self.delay = 200;

    return {
      discreteBarChart: discreteBarChart,
      lineChart: lineChart
    };

    function discreteBarChart(values, opts) {

      var options = {
        chart: {
            type: 'discreteBarChart',
            height: self.height,
            margin : self.margin,
            x: function(d){ return d.label; },
            y: function(d){ return d.value; },
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.0f')(d)+((opts.units === 'ratio')?'%':'');
            },
            color: function (d, i) {
                var max = ((opts.units === 'minutes')?self.maxDelayMinutes:self.maxDelayPercent);
                var min = ((opts.units === 'minutes')?self.midDelayMinutes:self.midDelayPercent);
                if (d.value > max){
                  return self.red;
                }else if(d.value > min){
                  return self.yellow;
                }else{
                  return self.green;
                }
            },
            duration: self.delay,
            xAxis: {
                axisLabel: ((opts.per === 'days')?'Departure Day':'Departure Hour'),
                axisLabelDistance: 10,
                tickFormat:function(d, i){
                  if(opts.per === 'hours'){
                    return ((i % 3 === 0)?d:'');
                  }else{
                    return d;
                  }
                },
            },
            yAxis: {
                axisLabel: 'Arrival Delay '+((opts.units === 'minutes')?'(Minutes)':'Ratio %'),
                axisLabelDistance: 0,
                tickFormat:function(d, i){
                  return d3.format(',.0f')(d) + ((opts.units === 'ratio')?'%':'');
                }
            },
            tooltip:{
              classes: 'graph-tooltip md-whiteframe-z1',
              valueFormatter: function (d, i) {
                return d3.format(',.0f')(d)+(((opts.units === 'minutes')?' Minutes':'%')+' of arrival delay');
              },
              keyFormatter:function (d, i) {
                return 'on '+opts.month+' '+d;
              }
            }
        },
        title:{
          enable: true,
          text: "Flights arrival delay per departure "+((opts.per === 'days')?'day':'hour')+" on "+opts.month,
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
            key: '01',
            values: values
        }
      ];

      return {
        options: options,
        data: data
      };

    }

    function lineChart(values) {

      var options = {
          chart: {
              type: 'lineChart',
              height: self.height,
              margin : self.margin,
              x: function(d){ return d.x; },
              y: function(d){ return d.y; },
              useInteractiveGuideline: true,
              showLegend: false,
              xAxis: {
                  axisLabel: 'Distance of Flight'
              },
              yAxis: {
                  axisLabel: 'Delay in Minutes',
                  tickFormat: function(d){
                      return d3.format('.0f')(d);
                  },
                  axisLabelDistance: -10
              }
          },
          title:{
            enable: true,
            text: "Correlation Between Arrival Delay and Distance",
            className: "graph-title"
          },
          subtitle:{
            enable: true,
            text: "Calculed using a Polynomial Regression",
            className: "graph-subtitle"
          }
      };

      var data = [
        {
          values: values,
          key: 'Delay in Minutes: ',
          color: 'rgb(255,152,0)',
          strokeWidth: 2,
        }
      ]

      return {
        options: options,
        data: data
      };

    }


  }

})();
