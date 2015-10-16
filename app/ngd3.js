// Simple D3 Service
// Source: http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('d3', [])
.factory('d3Service', ['$document', '$window', '$q', '$rootScope',
  function($document, $window, $q, $rootScope) {
    var d = $q.defer(),
        d3service = {
          d3: function() { return d.promise; }
        };
  $(document).ready(function () {
    d.resolve($window.d3);
  });
  
  return d3service;
}]);

// Some directives
angular.module('d3.directives', [ 'd3' ])

// Source: http://www.ng-newsletter.com/posts/d3-on-angular.html
.directive('d3Bars', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          var renderTimeout;
          var margin = parseInt(attrs.margin) || 20,
              barHeight = parseInt(attrs.barHeight) || 20,
              barPadding = parseInt(attrs.barPadding) || 5;

          var svg = d3.select(ele[0])
            .append('svg')
            .style('width', '100%');

          $window.onresize = function() {
            scope.$apply();
          };

          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });
          

          scope.$watch('data', function(newData) {
            scope.render(newData);
          }, true);

          scope.render = function(data) {
            svg.selectAll('*').remove();

            if (!data) return;
            if (renderTimeout) clearTimeout(renderTimeout);

            renderTimeout = $timeout(function() {
              var width = d3.select(ele[0])[0][0].offsetWidth - margin,
                  height = scope.data.length * (barHeight + barPadding),
                  color = d3.scale.category20(),
                  xScale = d3.scale.linear()
                    .domain([0, d3.max(data, function(d) {
                      return d.score;
                    })])
                    .range([0, width]);

              svg.attr('height', height);

              svg.selectAll('rect')
                .data(data)
                .enter()
                  .append('rect')
                  .on('click', function(d,i) {
                    return scope.onClick({item: d});
                  })
                  .attr('height', barHeight)
                  .attr('width', 140)
                  .attr('x', Math.round(margin/2))
                  .attr('y', function(d,i) {
                    return i * (barHeight + barPadding);
                  })
                  .attr('fill', function(d) {
                    return color(d.score);
                  })
                  .transition()
                    .duration(1000)
                    .attr('width', function(d) {
                      return xScale(d.score);
                    });
              svg.selectAll('text')
                .data(data)
                .enter()
                  .append('text')
                  .attr('fill', '#fff')
                  .attr('y', function(d,i) {
                    return i * (barHeight + barPadding) + 15;
                  })
                  .attr('x', 15)
                  .text(function(d) {
                    return d.name + " (scored: " + d.score + ")";
                  });
            }, 200);
          };
        });
      }}
}])

// Source: http://bl.ocks.org/mbostock/7607535
.directive('d3CirclePack', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        label: '@',
        onClick: '&'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          // Optional attributes
          var margin = parseInt(attrs.margin) || 0;
          var diameter =  parseInt(attrs.diameter) || 800;
          
          // Re-render on page-resize
          $window.onresize = function() {
            scope.$apply();
          };
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          // Re-render on data change
          scope.$watch('data', function(newData) {
            scope.render(newData);
          });
          
          // Append an SVG to manipulate
          /*var outerSvg = d3.select(ele[0]).append("svg")
              .attr("width", "100%")
              .attr("height", "100%");
              
          // Draw background image
          var defs = outerSvg.append("defs").append("pattern")
              .attr("id", "image")
              .attr("x", "0")
              .attr("y", "0")
              .attr("patternUnits", "userSpaceOnUse")
              .attr("height", "1")
              .attr("width", "1")
              .append("image")
                  .attr("x", "0")
                  .attr("y", "0")
                  .attr("xlink:href", "/asset/jpg/static_spotlight.jpg");*/
              
          var innerSvg = d3.select(ele[0]).append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
              .attr("preserveAspectRatio", "xMidYMid meet")
              .attr("viewBox", "0 0 " + diameter + " " + diameter)
            .append("g")
              .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

          // Determine color
          var color = d3.scale.linear()
              .domain([-1, 5])
              .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
              .interpolate(d3.interpolateHcl);

          // Run packing algorithm
          var pack = d3.layout.pack()
              .padding(2)
              .size([diameter - margin, diameter - margin])
              .value(function(d) { return d.size; })
              
          // Our render function
          scope.render = function(data) {
            innerSvg.selectAll('*').remove();

            if (!data) return;
            
            var root = data,
                focus = root,
                nodes = pack.nodes(root),
                view;

            var circle = innerSvg.selectAll("circle")
                .data(nodes)
              .enter().append("circle")
                .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                .style("padding", function(d) { return !d.parent ? "0 0 0 300pt" : "0"; })
                .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

            var text = innerSvg.selectAll("text")
                .data(nodes)
              .enter().append("text")
                .attr("class", "label")
                .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                .style("display", function(d) { return d.parent === root ? null : "none"; })
                .text(function(d) { return d.name; });

            var node = innerSvg.selectAll("circle,text");
            
            d3.select(ele[0])
                .style("background", color(-1))
                .on("click", function() { zoom(root); });
            
            zoomTo([root.x, root.y, root.r * 2 + margin]);

            function zoom(d) {    
              var focus0 = focus; focus = d;

              var transition = d3.transition()
                  .duration(d3.event.altKey ? 7500 : 750)
                  .tween("zoom", function(d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function(t) { zoomTo(i(t)); };
                  });

              transition.selectAll("text")
                .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                  .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                  .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                  .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
            }

            function zoomTo(v) {
              var k = diameter / v[2]; view = v;
              node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
              circle.attr("r", function(d) { return d.r * k; });
            }
              
            d3.select(ele[0].frameElement)
            .style("height", diameter + "px");
          };
        });
      }}
}])

// Source: http://bl.ocks.org/bunkat/2338034
.directive('d3TimeLine', ['$window', '$timeout', 'd3Service', 
  function($window, $timeout, d3Service) {
    return {
      restrict: 'E',
      scope: {
        lanes: '=',
        items: '=',
        timeBegin: '@',
        timeEnd: '@'
      },
      link: function(scope, ele, attrs) {
        d3Service.d3().then(function(d3) {
          var timeBegin = parseInt(attrs.timeBegin) || 0;
          var timeEnd = parseInt(attrs.timeEnd) || 2000;
          
          var laneLength, m, w, h, x, x1, y1, y2;
          
          var rescale = function() {
            laneLength = scope.lanes.length;
          
            m = [20, 15, 15, 20], //top right bottom left
                w = 960 - m[1] - m[3],
                h = 500 - m[0] - m[2],
                miniHeight = laneLength * 12 + 50,
                mainHeight = h - miniHeight - 50;

            //scales
            x = d3.scale.linear()
                .domain([timeBegin, timeEnd])
                .range([0, w]);
            x1 = d3.scale.linear()
                .range([0, w]);
            y1 = d3.scale.linear()
                .domain([0, laneLength])
                .range([0, mainHeight]);
            y2 = d3.scale.linear()
                .domain([0, laneLength])
                .range([0, miniHeight]);
          };
          rescale();
          var chart = d3.select(ele[0])
                .append("svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .attr("class", "chart")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 850 500");
          
          chart.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", w)
            .attr("height", mainHeight);

          var main = chart.append("g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
                .attr("width", w)
                .attr("height", mainHeight)
                .attr("class", "main");

          var mini = chart.append("g")
                .attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
                .attr("width", w)
                .attr("height", miniHeight)
                .attr("class", "mini");
            
            
          // Re-render on page-resize
          $window.onresize = function() {
            scope.$apply();
          };
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.lanes, scope.items);
          });

          // Re-render on lane data change
          scope.$watch('items', function(newData) {
            scope.render(scope.lanes, newData);
          });
          // Re-render on item data change
          scope.$watch('lanes', function(newData) {
            if (newData.$promise && !newData.$resolved) {
              newData.then(function(result) {
                scope.render(result, scope.items);
              });
            } else {
              scope.render(newData, scope.items);
            }
          });
            
          scope.render = function(lanes, items) {
            // Short-circuit for invalid data           
            if (!items) {
              console.log("Error: No items found!");
              return;
            }
            
            if (!lanes) {
              console.log("Error: No lanes found!")
              return;
            }
            
            rescale();
            
            //main lanes and texts
            main.append("g").selectAll(".laneLines")
              .data(items)
              .enter().append("line")
              .attr("x1", m[1])
              .attr("y1", function(d) {return y1(d.lane);})
              .attr("x2", w)
              .attr("y2", function(d) {return y1(d.lane);})
              .attr("stroke", "lightgray")

            main.append("g").selectAll(".laneText")
              .data(lanes)
              .enter().append("text")
              .text(function(d) {return d;})
              .attr("x", -m[1])
              .attr("y", function(d, i) {return y1(i + .5);})
              .attr("dy", ".5ex")
              .attr("text-anchor", "end")
              .attr("class", "laneText");
            
            //mini lanes and texts
            mini.append("g").selectAll(".laneLines")
              .data(items)
              .enter().append("line")
              .attr("x1", m[1])
              .attr("y1", function(d) {return y2(d.lane);})
              .attr("x2", w)
              .attr("y2", function(d) {return y2(d.lane);})
              .attr("stroke", "lightgray");

            mini.append("g").selectAll(".laneText")
              .data(lanes)
              .enter().append("text")
              .text(function(d) {return d;})
              .attr("x", -m[1])
              .attr("y", function(d, i) {return y2(i + .5);})
              .attr("dy", ".5ex")
              .attr("text-anchor", "end")
              .attr("class", "laneText");

            var itemRects = main.append("g")
                      .attr("clip-path", "url(#clip)");
            
            //mini item rects
            mini.append("g").selectAll("miniItems")
              .data(items)
              .enter().append("rect")
              .attr("class", function(d) {return "miniItem" + d.lane;})
              .attr("x", function(d) {return x(d.start);})
              .attr("y", function(d) {return y2(d.lane + .5) - 5;})
              .attr("width", function(d) {return x(d.end - d.start);})
              .attr("height", 10);

            //mini labels
            mini.append("g").selectAll(".miniLabels")
              .data(items)
              .enter().append("text")
              .text(function(d) {return d.id;})
              .attr("x", function(d) {return x(d.start);})
              .attr("y", function(d) {return y2(d.lane + .5);})
              .attr("dy", ".5ex");

            //brush
            var brush = d3.svg.brush()
                      .x(x)
                      .on("brush", display);

            mini.append("g")
              .attr("class", "x brush")
              .call(brush)
              .selectAll("rect")
              .attr("y", 1)
              .attr("height", miniHeight - 1);

            display();
            
            function display() {
              var rects, labels,
                minExtent = brush.extent()[0],
                maxExtent = brush.extent()[1],
                visItems = items.filter(function(d) {return d.start < maxExtent && d.end > minExtent;});

              mini.select(".brush")
                .call(brush.extent([minExtent, maxExtent]));

              x1.domain([minExtent, maxExtent]);

              //update main item rects
              rects = itemRects.selectAll("rect")
                      .data(visItems, function(d) { return d.id; })
                .attr("x", function(d) {return x1(d.start);})
                .attr("width", function(d) {return x1(d.end) - x1(d.start);});
              
              rects.enter().append("rect")
                .attr("class", function(d) {return "miniItem" + d.lane;})
                .attr("x", function(d) {return x1(d.start);})
                .attr("y", function(d) {return y1(d.lane) + 10;})
                .attr("width", function(d) {return x1(d.end) - x1(d.start);})
                .attr("height", function(d) {return .8 * y1(1);});

              rects.exit().remove();

              //update the item labels
              labels = itemRects.selectAll("text")
                .data(visItems, function (d) { return d.id; })
                .attr("x", function(d) {return x1(Math.max(d.start, minExtent) + 2);});

              labels.enter().append("text")
                .text(function(d) {return d.id;})
                .attr("x", function(d) {return x1(Math.max(d.start, minExtent));})
                .attr("y", function(d) {return y1(d.lane + .5);})
                .attr("text-anchor", "start");

              labels.exit().remove();

            }
          }
        });
      }
    }
  }]);