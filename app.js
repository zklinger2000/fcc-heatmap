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
        colors = ["#1010FF", "#202F9C", "#165693", "#F2BF41","#CA760C","#CA470C", "#FF470A"], // alternatively colorbrewer.YlGnBu[9]
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
        .style('fill', function(d) { return colorScale(d.variance); });

      var monthLabels = svg.selectAll('.monthLabel')
        .data(months)
        .enter()
        .append('text')
          .text(function(d) { return d; })
          .attr('x', 0)
          .attr('y', function(d, i) { return monthsScale(i + 1)})
          .style('text-anchor', 'end')
          .attr('transform', 'translate(-10, ' + (3 * gridHeight / 4) + ')');

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
        <svg className="chart"></svg>
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
