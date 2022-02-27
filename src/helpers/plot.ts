import * as d3 from "d3";

// create data
const data = [{x: 0, y: 20}, {x: 150, y: 150}, {x: 300, y: 100}, {x: 450, y: 20}, {x: 600, y: 130}]

// create svg element:
const svg = d3.select("#area").append("svg").attr("width", 800).attr("height", 200)

// prepare a helper function
const curveFunc = d3.area()
  .x(function(d) { return d.x })      // Position of both line breaks on the X axis
  .y1(function(d) { return d.y })     // Y position of top line breaks
  .y0(200)                            // Y position of bottom line breaks (200 = bottom of svg area)

// Add the path using this helper function
svg.append('path')
  .attr('d', curveFunc(data))
  .attr('stroke', 'black')
  .attr('fill', '#69b3a2');

console.log(svg);