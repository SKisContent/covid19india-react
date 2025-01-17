import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {formatDistance} from 'date-fns';
import {formatDate, formatDateInMillis} from '../utils/common-functions';
/* import * as Icon from 'react-feather';
import {Link} from 'react-router-dom';*/

import Table from './table';
import Level from './level';
import MapExplorer from './mapexplorer';
import TimeSeries from './timeseries';
import Minigraph from './minigraph';
/* import Patients from './patients';*/

function Home(props) {
  const [states, setStates] = useState([]);
  const [stateDistrictWiseData, setStateDistrictWiseData] = useState({});
  /* const [patients, setPatients] = useState([]);*/
  const [fetched, setFetched] = useState(false);
  const [graphOption, setGraphOption] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [timeseries, setTimeseries] = useState([]);
  const [timeseriesMode, setTimeseriesMode] = useState(true);
  const [timeseriesLogMode, setTimeseriesLogMode] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState(undefined);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = async () => {
    try {
      const [response, stateDistrictWiseResponse] = await Promise.all([
        axios.get('https://api.covid19india.org/data.json'),
        axios.get('https://api.covid19india.org/state_district_wise.json'),
        /* axios.get('https://api.covid19india.org/raw_data.json'),*/
      ]);
      response.data.statewise.forEach((d) => {
        d['confirmed'] = d.confirmed ? parseInt(d.confirmed) : 0;
        d['deaths'] = d.deaths ? parseInt(d.deaths) : 0;
        d['mortality'] = d.confirmed ? d.deaths / d.confirmed : 0;
        d['deltaconfirmed'] = d.deltaconfirmed ? parseInt(d.deltaconfirmed) : 0;
        d['deltadeaths'] = d.deltadeaths ? parseInt(d.deltadeaths) : 0;
        d['lastupdatedtime'] = d.lastupdatedtime
          ? new Date(formatDate(d.lastupdatedtime))
          : 0;
        if (d.state !== 'Total' && stateDistrictWiseResponse.data[d.state]) {
          const stateData = stateDistrictWiseResponse.data[d.state];
          for (const district in stateData.districtData) {
            if (stateData.districtData.hasOwnProperty(district)) {
              const ds = stateData.districtData[district];
              ds['lastupdatedtime'] = ds.lastupdatedtime
                ? new Date(formatDate(ds.lastupdatedtime))
                : 0;
            }
          }
        }
      });
      response.data.cases_time_series.forEach((d) => {
        d['dailyconfirmed'] = d.dailyconfirmed ? parseInt(d.dailyconfirmed) : 0;
        d['dailydeceased'] = d.dailydeceased ? parseInt(d.dailydeceased) : 0;
        d['dailymortality'] = d.dailyconfirmed
          ? d.dailydeceased / d.dailyconfirmed
          : 0;

        d['totalconfirmed'] = d.totalconfirmed ? parseInt(d.totalconfirmed) : 0;
        d['totaldeceased'] = d.totaldeceased ? parseInt(d.totaldeceased) : 0;
        d['totalmortality'] = d.totalconfirmed
          ? d.totaldeceased / d.totalconfirmed
          : 0;
      });

      setStates(response.data.statewise);
      setTimeseries(response.data.cases_time_series);
      const lastUpdated = response.data.statewise[0].lastupdatedtime;
      setLastUpdated(lastUpdated.toString());
      setStateDistrictWiseData(stateDistrictWiseResponse.data);
      /* setPatients(rawDataResponse.data.raw_data.filter((p) => p.detectedstate));*/
      setFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onHighlightState = (state, index) => {
    if (!state && !index) setRegionHighlighted(null);
    else setRegionHighlighted({state, index});
  };
  const onHighlightDistrict = (district, state, index) => {
    if (!state && !index && !district) setRegionHighlighted(null);
    else setRegionHighlighted({district, state, index});
  };

  return (
    <div className="Home">
      <div className="home-left">
        <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
          <div className="header-mid">
            <div className="titles">
              <h1>India COVID-19 Tracker</h1>
              <h6 style={{fontWeight: 600}}>A Crowdsourced Initiative</h6>
            </div>
            <div className="last-update">
              <h6>Last Updated</h6>
              <h6 style={{color: '#28a745', fontWeight: 600}}>
                {isNaN(Date.parse(lastUpdated))
                  ? ''
                  : formatDistance(Date.parse(lastUpdated), new Date()) +
                    ' Ago'}
              </h6>
              <h6 style={{color: '#28a745', fontWeight: 600}}>
                {isNaN(Date.parse(lastUpdated))
                  ? ''
                  : formatDateInMillis(Date.parse(lastUpdated))}
              </h6>
            </div>
          </div>
        </div>
        {states.length > 1 && <Level data={states} />}
        <Minigraph timeseries={timeseries} animate={true} />
        <Table
          states={states}
          summary={false}
          stateDistrictWiseData={stateDistrictWiseData}
          onHighlightState={onHighlightState}
          onHighlightDistrict={onHighlightDistrict}
        />
      </div>

      <div className="home-right">
        {fetched && (
          <React.Fragment>
            <MapExplorer
              states={states}
              stateDistrictWiseData={stateDistrictWiseData}
              regionHighlighted={regionHighlighted}
            />

            <div
              className="timeseries-header fadeInUp"
              style={{animationDelay: '1.5s'}}
            >
              <h1>Spread Trends</h1>
              <div className="tabs">
                <div
                  className={`tab ${graphOption === 1 ? 'focused' : ''}`}
                  onClick={() => {
                    setGraphOption(1);
                  }}
                >
                  <h4>Cumulative</h4>
                </div>
                <div
                  className={`tab ${graphOption === 2 ? 'focused' : ''}`}
                  onClick={() => {
                    setGraphOption(2);
                  }}
                >
                  <h4>Daily</h4>
                </div>
              </div>

              <div className="scale-modes">
                <label>Scale Modes</label>
                <div className="timeseries-mode">
                  <label htmlFor="timeseries-mode">Uniform</label>
                  <input
                    type="checkbox"
                    checked={timeseriesMode}
                    className="switch"
                    aria-label="Checked by default to scale uniformly."
                    onChange={(event) => {
                      setTimeseriesMode(!timeseriesMode);
                    }}
                  />
                </div>
                <div
                  className={`timeseries-logmode ${
                    graphOption !== 1 ? 'disabled' : ''
                  }`}
                >
                  <label htmlFor="timeseries-logmode">Logarithmic</label>
                  <input
                    type="checkbox"
                    checked={graphOption === 1 && timeseriesLogMode}
                    className="switch"
                    disabled={graphOption !== 1}
                    onChange={(event) => {
                      setTimeseriesLogMode(!timeseriesLogMode);
                    }}
                  />
                </div>
              </div>
            </div>

            <TimeSeries
              timeseries={timeseries}
              type={graphOption}
              mode={timeseriesMode}
              logMode={timeseriesLogMode}
            />

            {/* Testing Rebuild*/}
          </React.Fragment>
        )}
      </div>

      <div className="home-right"></div>
    </div>
  );
}

export default Home;
