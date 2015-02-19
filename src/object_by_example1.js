/**
 * Created by davidlevy on 2/16/15.
 */
(function () {

    //define the angular module
    angular.module('obe.object_by_example_form', []);
    //the directives


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

                var fldType = '';

                scope.generateArrayHeader = function (obj,name) {
                    var elementType = typeof obj[0];

                    if (elementType == 'object'){
                        var ret  = '<tr>';
                        for (key in obj[0]){
                            ret = ret + '<td>'+ key +'</td>';
                        }
                        ret = ret + '</tr>';
                        return ret;
                    }else{
                        return '<tr><td>'+name+'</td></tr>'
                    }
                };
                scope.generateArrayFooter = function (obj,name) {
                    return '</table>';
                };

                scope.generateArrayBody = function (obj,name,idx) {
                    var elementType = typeof obj;
                    if (elementType == 'object'){
                        var ret  = '<tr>';
                        for (key in obj){
                            console.log('<td><input ng-model="'+name +'['+idx +'].'+key+'"></td>');
                            ret = ret + '<td><input ng-model="'+name +'['+idx +'].'+key+'"></td>';
                        }
                        ret = ret + '</tr>';
                        return ret;
                    }else{
                        return '<tr><td><input ng-model="'+name+'['+idx+']"></td></tr>'
                    }
                };

                scope.generateHtml = function (obj, name) {
                    element.append('<ul class="list-group">');
                    element.append('<li class="list-group-item active" ><strong>' + name + '</strong></li>');

                    for (var key in obj) {
                        console.log(key);
                        if (key[0] == '$') {
                            console.log('this key should not be displayed' + key);
                            continue;
                        }
                        fldType = typeof obj[key];
                        switch (fldType) {
                            case 'string':
                                element.append('<li class="list-group-item">' + key + '<input ng-model="' + name + '.' + key + '" /></li>');
                                break;
                            case 'number':
                                element.append('<li class="list-group-item">' + key + '<input ng-model="' + name + '.' + key + '" /></li>');
                                break;
                            case 'boolean':
                                element.append('<li class="list-group-item">' + key + '<input type="checkbox" ng-model="' + name + '.' + key + '" /></li>');
                                break;
                            case 'object':
                                if (angular.isArray(obj[key])) {
                                    element.append('<table>');
                                    element.append(scope.generateArrayHeader(obj[key],name + '.' + key));
                                    for(var i =0; i < obj[key].length;i++){
                                        element.append(scope.generateArrayBody(obj[key][i],name + '.' + key,i));
                                    }
                                    element.append('<table>');
                                    console.log('array');

                                } else {
                                    scope.generateHtml(obj[key], name + '.' + key);
                                }
                                break;
                        }

                    }
                    element.append('</ul>');
                };
                scope.generateHtml(scope.data, 'data');
                $compile(element.contents())(scope);

                //console.log(scope.items.length);

            }
        }
    }


    angular.module('obe.object_by_example_form').directive('obeObject', ['$compile', obeObject]);


}());


