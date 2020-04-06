import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import * as Icon from 'react-feather';

import './App.scss';

import Home from './components/home';
import Navbar from './components/navbar';
import Links from './components/links';
import FAQ from './components/faq';
/* import PatientDB from './components/patientdb';*/

const history = require('history').createBrowserHistory;

function App() {
  const pages = [
    {
      pageLink: '/',
      view: Home,
      displayName: 'Home',
      animationDelayForNavbar: 0.2,
    },
    /* {
      pageLink: '/database',
      view: PatientDB,
      displayName: 'Patients DB',
      animationDelayForNavbar: 0.3,
    },*/
    {
      pageLink: '/links',
      view: Links,
      displayName: 'Helpful Links',
      animationDelayForNavbar: 0.5,
    },
    {
      pageLink: '/faq',
      view: FAQ,
      displayName: 'FAQ',
      animationDelayForNavbar: 0.6,
    },
  ];

  return (
    <div className="App">
      <Router history={history}>
        <Route
          render={({location}) => (
            <div className="Almighty-Router">
              <Navbar pages={pages} />
              <Route exact path="/" render={() => <Redirect to="/" />} />
              <Switch location={location}>
                {pages.map((page, i) => {
                  return (
                    <Route
                      exact
                      path={page.pageLink}
                      component={page.view}
                      key={i}
                    />
                  );
                })}
              </Switch>
            </div>
          )}
        />
      </Router>

      <footer className="fadeInUp" style={{animationDelay: '2s'}}>
        <div className="link">
          Forked from&nbsp;
          <a href="https://github.com/covid19india/covid19india-react">
            covid19india-react
          </a>
        </div>
        <a
          href="https://github.com/SKisContent/covid19india-react"
          className="button github"
        >
          <Icon.GitHub />
          <span>Open Sourced on GitHub</span>
        </a>
        <a
          href="https://bit.ly/patientdb"
          target="_noblank"
          className="button excel"
        >
          <Icon.Database />
          <span>Crowdsourced Patient Database</span>
        </a>
        <a
          href="https://twitter.com/skiscontent"
          target="_noblank"
          className="button twitter"
          style={{justifyContent: 'center'}}
        >
          <Icon.Twitter />
          <span>Feedback and suggestions </span>
        </a>
      </footer>
    </div>
  );
}

export default App;
