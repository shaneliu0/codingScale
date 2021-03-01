import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  
} from '@material-ui/core';

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/"><p>Home screen</p></Route>
      </div>
    </Router>
  );
}

export default App;
