import React, {useState, useEffect} from 'react';

function Level(props) {
  const [data, setData] = useState(props.data);
  const [confirmed, setConfirmed] = useState(0);
  const [active, setActive] = useState(0);
  const [mortality, setMortality] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [deltas, setDeltas] = useState(0);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    const parseData = () => {
      let confirmed = 0;
      let active = 0;
      let deaths = 0;
      let deltas = {};
      data.forEach((state, index) => {
        if (index !== 0) {
          confirmed += parseInt(state.confirmed);
          active += parseInt(state.active);
          deaths += parseInt(state.deaths);
        } else {
          deltas = {
            confirmed: parseInt(state.deltaconfirmed),
            deaths: parseInt(state.deltadeaths),
          };
        }
      });
      const mortality = confirmed > 0 ? deaths / confirmed : 0;
      setConfirmed(confirmed);
      setActive(active);
      setMortality(mortality);
      setDeaths(deaths);
      setDeltas(deltas);
    };
    parseData();
  }, [data]);

  return (
    <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
      <div className="level-item is-cherry">
        <h5>Confirmed</h5>
        <h4>
          [
          {deltas
            ? deltas.confirmed >= 0
              ? '+' + deltas.confirmed
              : '+0'
            : ''}
          ]
        </h4>
        <h1>{confirmed} </h1>
      </div>

      <div className="level-item is-blue">
        <h5 className="heading">Active</h5>
        <h4>&nbsp;</h4>

        <h1 className="title has-text-info">{active}</h1>
      </div>

      <div className="level-item is-gray">
        <h5 className="heading">Deceased</h5>
        <h4>
          [{deltas ? (deltas.deaths >= 0 ? '+' + deltas.deaths : '+0') : ''}]
        </h4>
        <h1 className="title has-text-grey">{deaths}</h1>
      </div>

      <div className="level-item is-black">
        <h5 className="heading">Mortality</h5>
        <h4>
          [
          {deltas
            ? deltas.confirmed && deltas.deaths
              ? mortality -
                  (deaths - deltas.deaths) / (confirmed - deltas.confirmed) >
                0
                ? '+' +
                  (
                    100 *
                    (mortality -
                      (deaths - deltas.deaths) / (confirmed - deltas.confirmed))
                  ).toFixed(2)
                : (
                    100 *
                    (mortality -
                      (deaths - deltas.deaths) / (confirmed - deltas.confirmed))
                  ).toFixed(2)
              : '+0'
            : ''}
          %]
        </h4>
        <h1 className="title has-text-success">
          {(100 * mortality).toFixed(2)}%{' '}
        </h1>
      </div>
    </div>
  );
}

export default Level;
