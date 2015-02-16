/**
 * Created by davidlevy on 2/16/15.
 */
(function () {

  //define the angular module
  angular.module('obe.object_by_example_form', []);
  //the directives

  function obeField($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {'field': '='},
      link: function (scope, element, attr) {
        scope.name = scope.field.$name;
        if (scope.field.$type == 'object') {
          console.log('we have an object type');
          element.append("<obe-object data='field.data'></obe-object>");
        } else {
          element.append('<li class="list-group-item"><label ng-bind="field.$name"></label>' +
            '<input ng-model="field.data"></li>');
        }
        $compile(element.contents())(scope);
        console.log(scope.field);
        console.log(scope.field.$name);

      }
    }
  }

  function obeArray($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {'list': '='},
      template: '<ul> ' +
        '<li><span>Array</span><strong ng-bind="data.$name"></strong></li> ' +
        '<obe-field ng-repeat="item in list" field="item"></obe-field>' +
        '</ul>',
      link: function (scope, element, attr) {
        scope.elementType = '';
        try {
          scope.newItem = angular.copy(scope.list[0])
          scope.elementType = typeof scope.newItem;
        } catch (e) {
          console.log(e);
        }
        scope.addItem = function () {
          scope.array.push(scope.newItem);
          scope.cleanItem(scope.newItem);
        };
      }
    }
  }

  function obeObject($compile) {
    return {
      restrict: 'E',
      //replace: true,
      scope: {'data': '='},
      template: '<ul class="list-group"> ' +
        '<li class="list-group-item active" ng-if="data.$name"><strong  ng-bind="data.$name"></strong></li> ' +
        '<obe-field ng-repeat="item in items" field="item"></obe-field>' +
        '</ul>',
      link: function (scope, element, attr) {
        scope.items = [];
        var fldType = '';
        for (var key in scope.data) {
          console.log(key);
          if (key[0] == '$') {
            console.log('this key should not be displayed' + key);
            continue;
          }
          fldType = typeof scope.data[key];
          switch (fldType) {
            case 'string':
              scope.items.push({
                $name: key,
                $type: 'field',
                $validation: 'string',
                data: scope.data[key]
              });
              break;
            case 'number':
              scope.items.push({
                $name: key,
                $type: 'field',
                $validation: 'number',
                data: scope.data[key]
              });
              break;
            case 'boolean':
              scope.items.push({
                $name: key,
                $type: 'field',
                $validation: 'boolean',
                data: scope.data[key]
              });
              break;
            case 'object':
              if (angular.isArray(scope.data[key])) {
                scope.items.push({
                  $name: key,
                  $type: 'array',
                  $validation: '',
                  data: scope.data[key]
                });
              } else {
                scope.data[key].$name = key,
                  scope.data[key].$type = 'object',
                  scope.items.push({
                    $type:'object',
                    $name:key,
                    data: scope.data[key]
                  });
              }
              break;
          }

        }
        //console.log(scope.items.length);

      }
    }
  }


  angular.module('obe.object_by_example_form').directive('obeField', ['$compile',obeField]);
  angular.module('obe.object_by_example_form').directive('obeObject', [obeObject]);
  angular.module('obe.object_by_example_form').directive('obeArray', [obeArray]);


}());


