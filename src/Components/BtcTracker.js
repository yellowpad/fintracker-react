import React, { Component } from 'react';
import axios from 'axios'
import ReactDOM from 'react-dom'
import {Chart} from 'react-d3-core'
import {AreaChart} from 'react-d3-basic'


class BtcTracker extends Component {
  constructor(){
    super()

    this.state={
      data: [],
      min: 0,
      max: 0,
      ticker: 'AAPL'
    }
  }

  componentDidMount(){
    this.grabData()
    setInterval(()=>{this.grabData()}, 3000)
  }

  changeTicker(event){
    this.setState({
      ticker: event.target.value
    })
  }

  grabData(){
    //yahoo oauth
    // consumer key: dj0yJmk9akFzaGJZdzFpanE0JmQ9WVdrOWNsZFJabnAwTldNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02ZQ--
    // consumer secret: 96368618450ceaed5f35b73e5ba1ad9edd34d94b

    // Date.parse(data.data["time"]["updated"])
    axios
      .get(`https://fintracker3000.herokuapp.com/btc_tracker?symbol=${this.state.ticker}`)
      .then((data)=>{
        let btcdata = [...this.state.data, {time: Date.now(), value: parseFloat(data.data.query.results.quote["Bid"])}]
        let max = btcdata.reduce((acc, cur)=>{return cur.value>acc ? cur.value : acc }, 0)
        let min = btcdata.reduce((acc, cur)=>{return acc>cur.value ? cur.value : acc }, 1000)
        this.setState({
          data: btcdata,
          max: max,
          min: min
        })
      })

    if (this.state.data.length > 20){
      this.setState({
        data: this.state.data.filter((item, i)=>i!==0)
      })
    }
  }

  makeChart(){
    console.log("hi")
    // var LineChart = rd3.LineChart
    var lineData = this.state.data;
    var chartSeries = [{
      field: 'value',
      name: 'AAPL',
      color: "red",
      style:{
        fill: "url(#linear)",
        background: "linear-gradient(red, yellow)",
        opacity: .2
      }
    }]
    var x = function(d){
      return d.time.toString();
    }

    var StockChart =
        <AreaChart
        yDomain={[this.state.min-1,this.state.max+1]}
        chartSeries={chartSeries}
        legend={false}
        data={lineData}
        width={1000}
        height={700}
        x={x}
        xScale="time"
        title="Line Chart"
        gridHorizontal={true}>
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#05a"/>
            <stop offset="100%" stop-color="#0a5"/>
          </linearGradient>
        </AreaChart>

  return StockChart
  }

  // { x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 10 }, { x: 3, y: 5 }, { x: 4, y: 8 }, { x: 5, y: 15 }, { x: 6, y: 10 }

  render() {
    // debugger
    // console.log(this.state.data)
    return (
      <div>
        {this.state.data ? this.makeChart() : null}
      </div>

    );
  }
}

export default BtcTracker;
