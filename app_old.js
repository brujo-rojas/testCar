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
      value: 10,
      options: {
        floor: 1,
        ceil: 30,
        step: 0.5,
        precision: 1,
        showTicks: true,
        translate: function(value) {
          return '$ ' + value + "M";
        },
        onChange: function(id) {
          vm.recalc();
        },
      }
    };

    vm.sliderCuotas = {
      value: 150,
      options: {
        floor: 50,
        ceil: 400,
        step: 50,
        showTicks: true,
        translate: function(value) {
          return '$ ' + value + "K";
        },
        onChange: function(id) {
          vm.recalc();
        },
      }
    };

    vm.sliderCantidadCuotas = {
      value: 25,
      options: {
        floor: 24,
        ceil: 72,
        step: 1,
        showTicks: true,
        readOnly: true,
        translate: function(value) {
          return value + " Cuotas";
        }
      }
    };

    vm.recalc = function(){
      var sueldoEstimado = vm.sliderCuotas.value /3 * 10 * 1000;
      var creditoPermitido = sueldoEstimado * 8;
      var pieEstimado =  vm.sliderPrecioTotal.value * 1000000 - creditoPermitido;
      //var creditoEstimado = vm.sliderPrecioTotal.value * 1000000 - pieEstimado;

      if(creditoPermitido > (vm.sliderPrecioTotal.value * 1000000)){
        creditoPermitido = vm.sliderPrecioTotal.value * 1000000;
      }


      if(pieEstimado < 0){
        pieEstimado = 0
      }

      vm.pie_num = "$ "+ _.round(pieEstimado / 1000) + " K"
      vm.credito_num = "$ "+ _.round(creditoPermitido / 1000 )+ " K"
      vm.pie_porcentaje = _.round(pieEstimado * 100) / (vm.sliderPrecioTotal.value * 1000000);

      vm.cuotas = _.round(creditoPermitido / (vm.sliderCuotas.value * 1000))
      vm.sliderCantidadCuotas.value = vm.cuotas;
    }
    vm.recalc();


















  });
