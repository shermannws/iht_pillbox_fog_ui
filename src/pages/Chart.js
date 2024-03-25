import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import {getPillEntries} from "../services/pillStatus";
import {useParams, useNavigate} from "react-router-dom"
import './Chart.css'

const Chart = (props) => {
  const navigate = useNavigate();
  const patientId = useParams().patientId || props.patientId;
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getPillEntries(patientId).then(res => {
      const before_data = [];
      const after_data = [];
      res.forEach(e => {
        if (e.medicationtype == 'before') {
          before_data.push({
            x: new Date(e.administeredtime).toLocaleDateString(),
            y: [
              new Date(e.administeredtime).getTime(),
              new Date(e.consumedtime).getTime()
            ],
          })
        } else {
          after_data.push({
            x: new Date(e.administeredtime).toLocaleDateString(),
            y: [
              new Date(e.administeredtime).getTime(),
              new Date(e.consumedtime).getTime()
            ],
          })
        }
      });
      setSeries([{
        name: "before-meal",
        data: before_data
      }, {
        name: "after-meal",
        data: after_data
      }])
    });
  }, [])

  const [options] = useState({
    chart: {
      type: 'rangeBar'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
      }
    },
    xaxis: {
      type: 'datetime'
    },
    style: {
      colors: ['#FEB019', '#fff']
    }
  });

  return (
    <div className="chart-container">
      <button className="back-btn" onClick={()=>navigate("/")}>Back</button>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="rangeBar" height={400} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default Chart;