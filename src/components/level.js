import React, {useState, useEffect} from 'react';

function Level(props) {
  const [data, setData] = useState(props.data);
  const [confirmed, setConfirmed] = useState(0);
  const [active, setActive] = useState(0);
  const [mortality, setMortality] = useState(0);
  const [deaths, setDeaths] = useState(0);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    const parseData = () => {
      let confirmed = 0;
      let active = 0;
      let deaths = 0;
      data.forEach((state, index) => {
        if (index !== 0) {
          confirmed += parseInt(state.confirmed);
          active += parseInt(state.active);
          deaths += parseInt(state.deaths);
        }
      });
      const mortality = confirmed > 0 ? deaths / confirmed : 0;
      setConfirmed(confirmed);
      setActive(active);
      setMortality(mortality);
      setDeaths(deaths);
    };
    parseData();
  }, [data]);

  return (
    <div className="Level fadeInUp" style={{animationDelay: '0.8s'}}>
      <div className="level-item is-cherry">
        <h5>Confirmed</h5>
        <h4>
          [
          {props.deltas
            ? props.deltas.confirmeddelta >= 0
              ? '+' + props.deltas.confirmeddelta
              : '+0'
            : ''}
          ]
        </h4>
        <h1>{confirmed} </h1>
      </div>

      <div className="level-item is-blue">
        <h5 className="heading">Active</h5>
        <h4>&nbsp;</h4>
        {/* <h4>[{props.deltas ? props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta) >=0 ? '+'+(props.deltas.confirmeddelta-(props.deltas.recovereddelta+props.deltas.deceaseddelta)).toString() : '+0' : ''}]</h4>*/}
        <h1 className="title has-text-info">{active}</h1>
      </div>

      <div className="level-item is-gray">
        <h5 className="heading">Deceased</h5>
        <h4>
          [
          {props.deltas
            ? props.deltas.deceaseddelta >= 0
              ? '+' + props.deltas.deceaseddelta
              : '+0'
            : ''}
          ]
        </h4>
        <h1 className="title has-text-grey">{deaths}</h1>
      </div>

      <div className="level-item is-black">
        <h5 className="heading">Mortality</h5>
        <h4>
          [
          {props.deltas
            ? props.deltas.confirmeddelta && props.deltas.deceaseddelta
              ? mortality -
                  (deaths - props.deltas.deceaseddelta) /
                    (confirmed - props.deltas.confirmeddelta) >
                0
                ? '+' +
                  (
                    100 *
                    (mortality -
                      (deaths - props.deltas.deceaseddelta) /
                        (confirmed - props.deltas.confirmeddelta))
                  ).toFixed(2)
                : (
                    100 *
                    (mortality -
                      (deaths - props.deltas.deceaseddelta) /
                        (confirmed - props.deltas.confirmeddelta))
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
