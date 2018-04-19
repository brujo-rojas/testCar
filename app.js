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
  .controller('WilkyController', function() {


    var vm = this;

    vm.pie_porcentaje = 40;
    vm.pie_num = "$ 4M";
    vm.credito_num = "$ 6M";

    vm.sliderPrecioTotal = {
      value: 0,
      options: {
        floor: 1,
        ceil: 30,
        step: 0.5,
        precision: 1,
        showTicks: true,
        translate: function(value) {
          return '$ ' + value + " M";
        },
        onChange: function(id) {
          vm.recalc();
        },
      }
    };

    vm.sliderPie = {
      value: 0,
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
            return '$ ' + value / 1000 + " M";
          }
        },
        onChange: function(id) {
          vm.recalc();
        },
      }
    };

    vm.sliderCantidadCuotas = {
      value: 12,
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
      var creditoNecesario = vm.sliderPrecioTotal.value*1000000 - vm.sliderPie.value*1000;
      var valorCuota = creditoNecesario / vm.sliderCantidadCuotas.value;

      vm.cuota = valorCuota;
      vm.credito_num = "$ "+ _.round(creditoNecesario/1000000, 2)+" M";
      vm.pie_num = "$ "+ _.round(vm.sliderPie.value / 1000, 2) +" M";
      vm.pie_porcentaje = _.round((vm.sliderPie.value * 1000 * 100)/ (vm.sliderPrecioTotal.value * 1000000), 1);

    }
    vm.recalc();


















  });
