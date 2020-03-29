import React, { Component } from "react";
import "./App.css";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);



class GraphContainer extends Component {
  
  render() {
    return (
      <div className="graphContainer">
        <Graph country={"DNK"} />
      </div>
    );
  }
}



class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: props.country ? props.country : "DNK"
    };
  }

  async fetchData(country) {
    var dataProvider = [];

    const result = await fetch(
      `https://covidapi.info/api/v1/country/${country}`
    ).then(response => response.json());

    var results = result.result;

    var days = [];
    Object.keys(results).forEach(key => {
      days.push(key);
    });
    var values = [];
    Object.values(results).forEach(value => {
      values.push(value);
    });

    for (var i = 0; i < days.length; i++) {
      dataProvider.push({
        date: days[i],
        confirmed: values[i].confirmed,
        deaths: values[i].deaths,
        recovered: values[i].recovered
      });
    }

    return dataProvider;
  }

  componentDidMount() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;

    this.fetchData(this.state.country).then(data => {
      let confirmedData = [];
      let deathsData = [];
      let recoveredData = [];

      for (var i = 0; i < data.length; i++) {
        var day, month, year, date;
        var splitDate = data[i].date.split("-");
        day = splitDate[2];
        month = splitDate[1];
        year = splitDate[0];
        date = new Date(year, month, day);
        confirmedData.push({
          date: date,
          confirmed: data[i].confirmed
        });
        deathsData.push({ date: date, deaths: data[i].deaths });
        recoveredData.push({
          date: date,
          recovered: data[i].recovered
        });
      }

      chart.dateFormatter.inputDateFormat = "yyyy-mm-dd";

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let confirmedSeries = chart.series.push(new am4charts.LineSeries());
      confirmedSeries.name = "Confirmed Cases";
      confirmedSeries.dataFields.dateX = "date";
      confirmedSeries.dataFields.valueY = "confirmed";
      confirmedSeries.data = confirmedData;
      confirmedSeries.stroke = am4core.color("#F5DBCB");

      let deathsSeries = chart.series.push(new am4charts.LineSeries());
      deathsSeries.name = "Confirmed Cases";
      deathsSeries.dataFields.dateX = "date";
      deathsSeries.dataFields.valueY = "deaths";
      deathsSeries.data = deathsData;
      deathsSeries.stroke = am4core.color("#000000");

      let recoveredSeries = chart.series.push(new am4charts.LineSeries());
      recoveredSeries.name = "Confirmed Cases";
      recoveredSeries.dataFields.dateX = "date";
      recoveredSeries.dataFields.valueY = "recovered";
      recoveredSeries.data = recoveredData;
      recoveredSeries.stroke = am4core.color("#000FFF");

      confirmedSeries.tooltipText = "Confirmed: {valueY.value}";
      deathsSeries.tooltipText = "Deaths: {valueY.value}";
      recoveredSeries.tooltipText = "recovered: {valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      this.chart = chart;
    });
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
  render() {
    return (
      <div>
        <h1>{this.state.country}</h1>
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
      </div>
    );
  }
}

// Component which contains the dynamic state for the chart
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Covid-19 Numbers</h1>
        <GraphContainer />
        
      </div>
    );
  }
}

export default App;
