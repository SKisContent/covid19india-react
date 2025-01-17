import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Level from './level';
import Minigraph from './minigraph';
import Table from './table';

function Summary(props) {
  const [states, setStates] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [timeseries, setTimeseries] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched === false) {
      getStates();
    }
  }, [fetched]);

  const getStates = () => {
    axios
      .get('https://api.covid19india.org/data.json')
      .then((response) => {
        response.data.statewise.forEach((d) => {
          d['confirmed'] = d.confirmed ? parseInt(d.confirmed) : 0;
          d['deaths'] = d.deaths ? parseInt(d.deaths) : 0;
          d['mortality'] = d.confirmed ? d.deaths / d.confirmed : 0;
          d['deltaconfirmed'] = d.deltaconfirmed
            ? parseInt(d.deltaconfirmed)
            : 0;
          d['deltadeaths'] = d.deltadeaths ? parseInt(d.deltadeaths) : 0;
        });
        setStates(response);
        setDeltas(response.data.key_values[0]);
        setTimeseries(response.data.cases_time_series);
        setFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="Summary">
      <div className="header fadeInUp" style={{animationDelay: '0.5s'}}>
        <h1>India COVID-19 Tracker</h1>
      </div>

      <Minigraph timeseries={timeseries} animate={false} />
      <Level data={states} deltas={deltas} />
      <Table states={states} summary={true} />

      <div className="summary-bottom">
        <div className="summary-bottom-left">
          <img
            src="icon.png"
            alt="https://covid19remix.herokuapp.com | Coronavirus cases live dashboard"
          />
          <h5>We stand with everyone fighting on the frontlines</h5>
        </div>
        <div className="link">
          <a href="https://github.com/SKisContent/covid19india-react">
            https://newspie.in/covid19india
          </a>
        </div>
      </div>
    </div>
  );
}

export default Summary;
