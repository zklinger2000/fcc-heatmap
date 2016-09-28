//====
// D3
//====

function buildHeatmap() {
  fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(data.baseTemperature);

      var margin = { top: 100, right: 40, bottom: 140, left: 140 },
        width = 960 - margin.left - margin.right,
        height = 540 - margin.top - margin.bottom,
        gridWidth = width / Math.ceil(data.monthlyVariance.length / 12),
        gridHeight = Math.floor(height / 12),
        legendElementWidth = 30,
        colors = ["#5d50a2", "#3387bd", "#66c3a8", "#aadea6", "#e8f598", "#fdffc4", "#ffdf8d", "#fbaf62","#f36c48","#d43d4e", "#9c0244"], // alternatively colorbrewer.YlGnBu[9]
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // Create a hidden tooltip element
      var div = d3.select("#app").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Create the SVG
      var svg = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var minVariance = d3.min(data.monthlyVariance, function(d) {
        return d.variance;
      });

      var maxVariance = d3.max(data.monthlyVariance, function(d) {
        return d.variance;
      });

      var colorScale = d3.scaleQuantile()
        .domain([minVariance, maxVariance])
        .range(colors);

      var minYear = d3.min(data.monthlyVariance, function(d) {
        return d.year;
      });

      var maxYear = d3.max(data.monthlyVariance, function(d) {
        return d.year;
      });

      var yearsScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, width]);

      var monthsScale = d3.scaleLinear()
        .domain([1, 12])
        .range([0, height]);

      var cards = svg.selectAll('.month')
        .data(data.monthlyVariance)
        .enter()
        .append('rect')
        .attr('x', function(d) { return yearsScale(d.year); })
        .attr('y', function(d) { return monthsScale(d.month); })
        // .attr('rx', 4)
        // .attr('ry', 4)
        .attr('width', gridWidth)
        .attr('height', gridHeight + 3)
        .style('fill', function(d) { return colorScale(d.variance); })
        .on('mouseover', function(d) {
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html('<div>' + d.year + ' - ' + months[d.month] + '</div>' +
          '<div>' + (data.baseTemperature + d.variance).toFixed(2) + ' C</div>' +
          '<div>' + (d.variance).toFixed(2) + ' C</div>')
            .style('left', (yearsScale(d.year) + margin.left + 50) + 'px')
            .style('top', (monthsScale(d.month) + margin.top + 50) + 'px');
        })
        .on('mouseout', function(d) {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });

      var monthLabels = svg.selectAll('.monthLabel')
        .data(months)
        .enter()
        .append('text')
          .text(function(d) { return d; })
          .attr('x', 0)
          .attr('y', function(d, i) { return monthsScale(i + 1)})
          .style('text-anchor', 'end')
          .attr('transform', 'translate(-10, ' + (3 * gridHeight / 4) + ')');

      var xAxis = svg.append('g')
        .call(d3.axisBottom(yearsScale).tickFormat(d3.format(' ')))
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height + gridHeight + 3) + ')');

      var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

      legend.enter().append("g")
        .attr("class", "legend")
        .append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i + width / 2; })
        .attr("y", height + (margin.top))
        .attr("width", legendElementWidth)
        .attr("height", gridHeight / 2)
        .style("fill", function(d, i) { return colors[i]; });

      legend.enter().append('text')
        // .append("text")
        .text(function(d, i) { return (i * (maxVariance - minVariance) / 10).toFixed(1); })
        .attr("x", function(d, i) { return legendElementWidth * i + width / 2; })
        .attr("y", gridHeight + height + margin.top);

      legend.exit().remove();

    });
}

//=======
// React
//=======

const { Component, PropTypes } = React;

class Chart extends Component {
  componentDidMount() {
    let style = {

    };
    buildHeatmap();
  }

  render() {
    return (
      <div className="heatmap-chart">
        <h1 className="heatmap-title"></h1>
        <p className="heatmap-info"></p>
        <svg className="chart" width={960} height={540}></svg>
      </div>
    );
  }
}

Chart.propTypes = {

};

//============================================================================
// App Component
//----------------------------------------------------------------------------
//
//============================================================================
class App extends Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    return (
      <div className="App">
        <Chart />
      </div>
    );
  }
}

App.propTypes = {

};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
