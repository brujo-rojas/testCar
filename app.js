Number.prototype.formatMoney = function(c, d, t){
  var n = this, 
    c = isNaN(c = Math.abs(c)) ? 0 : c, 
    d = d == undefined ? "," : d, 
    t = t == undefined ? "." : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


angular.module('wilkyApp', ['rzModule', 'fusioncharts', 'ui.bootstrap'])
  .controller('WilkyController', function($scope, $http) {

    $http.get('derco.json').then(function(response) {
      vm.cars = response.data.results;
    });

    var vm = this;

    vm.pie_porcentaje = 0;
    vm.pie_num = "";
    vm.credito_num = "";
    vm.delta = 1000000;
    vm.carsFiltered = [];

    vm.filterCars = function(){
      vm.carsFiltered = vm.cars;
      vm.carsFiltered = [];
      _.each(vm.cars, function(car){
        if(car.value > vm.sliderPrecioTotal.value*1000000 - vm.delta){
          if(car.value < vm.sliderPrecioTotal.value*1000000 + vm.delta){
            vm.carsFiltered.push(car);
          }
        }
      });
    }

    vm.sliderPrecioTotal = {
      value: 4,
      options: {
        floor: 4,
        ceil: 25,
        step: 1,
        precision: 1,
        showTicks: true,
        translate: function(value) {
          return '$ ' + value + " M";
        },
        onChange: function(id) {
          vm.sliderPie.options.floor = vm.sliderPrecioTotal.value * 0.2 * 1000 ;
          vm.sliderPie.options.ceil = vm.sliderPrecioTotal.value * 1000 ;
          vm.sliderPie.value = vm.sliderPie.value < vm.sliderPie.options.floor ? vm.sliderPie.options.floor : vm.sliderPie.value;
          vm.recalc();
          $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
          });V
        },
      }
    };

    vm.sliderPie = {
      value: 1000,
      options: {
        floor: 500,
        ceil: 4000,
        step: 500,
        showTicks: true,
        translate: function(value) {
          if(value < 1000){
            return '$ ' + value + " K";
          }
          if(value >= 1000){
            return '$ ' + _.round(value / 1000, 1) + " M";
          }
        },
        onChange: function(id) {
          vm.recalc();
        },
      }
    };

    vm.sliderCantidadCuotas = {
      value: 36,
      options: {
        floor: 12,
        ceil: 48,
        step: 12,
        showTicks: true,
        translate: function(value) {
          return value + " Cuotas";
        },
        onChange: function(id) {
          vm.recalc();
        },
      }
    };

    vm.recalc = function(){
      vm.filterCars();
      var creditoNecesario = vm.sliderPrecioTotal.value*1000000 - vm.sliderPie.value*1000;
      var valorCuota = creditoNecesario / vm.sliderCantidadCuotas.value;

      vm.cuota = valorCuota;
      vm.credito_num = "$ "+ _.round(creditoNecesario/1000000, 2)+" M";
      vm.pie_num = "$ "+ _.round(vm.sliderPie.value / 1000, 2) +" M";
      vm.pie_porcentaje = _.round((vm.sliderPie.value * 1000 * 100)/ (vm.sliderPrecioTotal.value * 1000000), 1);

      vm.cuotaInteligente = vm.sliderPrecioTotal.value * 1000000 * 0.3 / vm.sliderCantidadCuotas.value;

    }
    vm.recalc();


















  });
