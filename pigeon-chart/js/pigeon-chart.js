/*global angular, console, $, alert, jQuery*/
/*jslint vars: true*/
/*jslint plusplus: true*/
var app = angular.module("pigeon-chart", []);

app.directive("pigeonChart", function($parse, $http) {
    "use strict";
    var direc = {};
    direc.restrict = "E";

    direc.scope = {
        //accept as string
        query: "@",
        title: "@",
        subtitle: "@",
        type: "@",
        axisYTitle: "@",
        axisXTitle: "@",
        showDataLabel: "=showDataLabel",
        showLegend: "@",
        zoomType: "@"
    };

    direc.controller = "pigeonChart";

    direc.templateUrl = 'pigeon-chart/template/outputTemplate.html';

    direc.compile = function() {
        var linkFunction = function(scope, element, attributes) {
            scope.init();
        };

        return linkFunction;
    };

    return direc;
});

app.controller("pigeonChart", function($scope, $http) {
    "use strict";

    $scope.chartId = 'chart_' + $scope.$id;

    $scope.init = function() {
        if ($scope.query.includes("SELECT")) {
            $scope.error = false;
            $http.post("pigeon-core/get-data.php", {
                    'sql': $scope.query
                })
                .then(function(response) {
                    $scope.data = response.data.data;
                    var transformeddata = $scope.transform_column_as_series($scope.data, $scope.axisyTitle, $scope.type, $scope.query);
                    var enableLegend = true;
                    var verticalAlign = "middle";
                    var legendLayout = "vertical";

                    if ($scope.showLegend !== undefined) {
                        if ($scope.showLegend !== "false") {
                            if ($scope.showLegend === "top" || $scope.showLegend === "bottom") {
                                verticalAlign = $scope.showLegend;
                                $scope.showLegend = "center";
                                legendLayout = "horizontal";
                            }
                        } else {
                            enableLegend = false;
                        }
                    } else {
                        $scope.showLegend = "right";
                    }

                    Highcharts.chart($scope.chartId, {
                        chart: {
                            zoomType: $scope.zoomType
                        },
                        title: {
                            text: $scope.title
                        },
                        subtitle: {
                            text: $scope.subtitle
                        },

                        xAxis: {
                            title: {
                                text: $scope.axisXTitle
                            },
                            categories: transformeddata.category
                        },

                        yAxis: {
                            title: {
                                text: $scope.axisYTitle
                            }
                        },

                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true
                            },
                            donut: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                showInLegend: true,
                                // depth: 65,
                                innerSize: 150,
                            },
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            },
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: $scope.showDataLabel,
                                    format: '{point.y}'+'%'
                                }
                            }
                        },
                        legend: {
                            layout: legendLayout,
                            align: $scope.showLegend,
                            verticalAlign: verticalAlign,
                            enabled: enableLegend,
                            borderWidth: 1,
                            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                            shadow: true
                        },

                        series: transformeddata.series
                    });

                });

        } else {
            $scope.msg = "Pigeon Chart only accept SELECT query only";
            $scope.error = true;
        }
    };

    $scope.transform_column_as_category = function(source, query) {
        var order = $scope.getGroupByArr(query);
        var groups = $scope.nestedGroup(source, order);
        return groups;
    };

    $scope.getGroupByArr = function(query) {
        var categorykey = query.split("BY")[1].replace(/ +/g, "");
        var order = categorykey.split(",");
        return order;
    }

    //recursive call for creating nested arrays
    $scope.nestedGroup = function(list, order) {
        if (_.isEmpty(order)) return [];
        var groups = _.groupBy(list, _.first(order));
        var group = {};
        return _.map(groups, function(obj, key) {
            //create name-categories pairs (format required in grouped-categories.js)
            group = {
                name: key,
                //get the rest of the order, remove the first index (looping)
                categories: $scope.nestedGroup(obj, _.rest(order))
            };
            return $scope.checkifEmpty(group, order);
        });
    };

    $scope.checkifEmpty = function(group, order) {
        if (_.isEmpty(group.categories)) {
            //remove "categories" property if it's empty
            return _.omit(group, 'categories');
        } else {
            if (_.rest(order) == _.last(order)) {
                //convert objects into a single array
                group.categories = _.pluck(group.categories, 'name');
            }
            return group;
        }
    };

    $scope.transform_column_as_series = function(source, title, charttype, query) {

        if (charttype === "pie" || charttype === "donut") {

            var piedata = [];

            for (x in source) {
                //return an array of each object's values
                var allvalues = Object.values(source[x])
                piedata.push(allvalues);
            }

            return {
                series: [{
                    type: charttype,
                    name: title,
                    data: piedata
                }]
            };

        } else {
            var querystr = query.toLowerCase();
            var categoryArr = [];
            var seriesArr = [];
            var lastcol = [];
            var allseries = [];

            //Obtaining all keys from the first row (table columns' name from sql).
            var allkeys = Object.keys(source[0])

            //Pushing n JSON object to allseries array based on number of column generated
            for (var i = 0; i < allkeys.length; i++) {
                allseries.push({
                    'type': charttype,
                    'name': allkeys[i],
                    'data': []
                });
            }

            //for each row, push the value into each JSON object's data based on number of column generated.
            for (var x in source) {
                for (var i = 0; i < allkeys.length; i++) {
                    allseries[i]['data'].push(source[x][allkeys[i]]);
                }
            }

            if (querystr.includes("group by")) {
                categoryArr = $scope.transform_column_as_category(source, query);
                seriesArr = allseries.slice($scope.getGroupByArr(query).length);
            } else {
                categoryArr = allseries[0].data;
                seriesArr = allseries.slice(1);
            }
        }

        //category contains value for x-axis (category), and series contains an array of series based on number of column generated - first column
        return {
            category: categoryArr,
            series: seriesArr
        };
    };

});