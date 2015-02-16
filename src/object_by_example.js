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
        if (scope.field.$type == 'object') {
          element.append("<obe-object data='field.data'></obe-object>")
        } else {
          element.append('<li><label ng-bind="field.$name"></label> ' +
            '<input ng-model="field.data"></li>')
        }
        $compile(element.content)(scope);
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
        '<obeField ng-repeat="item in list" field="item"></obeField>' +
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
      replace: true,
      scope: {'data': '='},
      template: '<ul> ' +
        '<li><strong ng-bind="data.$name"></strong></li> ' +
        '<obeField ng-repeat="item in items" field="item"></obeField>' +
        '</ul>',
      link: function (scope, element, attr) {
        scope.items = [];
        var fldType = '';
        for (var key in scope.data) {
          if (scope.data[key][0] == '$') {
            continue;
          }
          fldType = typeof scope.data[key]
          switch (fldType) {
            case 'string':
              items.push({
                $name: key,
                $type: 'field',
                $validation: 'string',
                data: scope.data[key]
              })
              break;
            case 'number':
              items.push({
                $name: key,
                $type: 'field',
                $validation: 'number',
                data: scope.data[key]
              })
              break;
            case 'boolean':
              items.push({
                $name: key,
                $type: 'field',
                $validation: 'boolean',
                data: scope.data[key]
              })
              break;
            case 'object':
              if (angular.isArray(scope.data[key])) {
                scope.items.push({
                  $name: key,
                  $type: 'array',
                  $validation: '',
                  data: scope.data[key]
                })
              } else {
                scope.data[key].$name = key,
                  scope.data[key].$type = 'object',
                  scope.items.push({
                    data: scope.data[key]
                  })
              }
              break;
          }

        }

      }
    }
  }


  angular.module('obe.object_by_example_form').directive('obeField', [obeField]);
  angular.module('obe.object_by_example_form').directive('obeObject', [obeObject]);
  angular.module('obe.object_by_example_form').directive('obeArray', [obeArray]);


}());


