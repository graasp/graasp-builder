import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Header from './layout/Header';
import Items from './main/Items';
import items from '../data/sample';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  return (
    <Router>
      <div>
        <Header />
        <main className={classes.root}>
          <Switch>
            <Route path="/items" exact>
              <Items items={items} />
            </Route>
            <Route path="/items/:itemId">
              <Items items={items} />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
