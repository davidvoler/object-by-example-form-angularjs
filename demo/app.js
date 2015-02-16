/**
 * Created by davidlevy on 2/16/15.
 */
(function () {

  function obeDemoController(){
    var self = this;

    self.example = {weight:5, face:'round',name:'Shira'};

  }


  angular.module('obe.demo',['obe.object_by_example_form']);


  angular.module('obe.demo').controller('obeDemoController',obeDemoController);

}());

