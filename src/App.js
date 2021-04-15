import './App.css';
import AuthForm from './components/AuthForm';
import Test from './page/Test';
import User from './page/User';
import Header from "./components/Header";
import {useState} from "react";
import {auth, db} from "./firebase";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
 
function App() {
  const [logged, setLogged] = useState(false)

  auth.onAuthStateChanged((user) => {
    if (user) {
        setLogged(true)
    }
    else{
        setLogged(false)
    }
  });
  
  return (
    <div>
    {
      logged ? (
        <Router>
          <Header logout={logged} setLogged={setLogged}/>
          <Switch>
            <Route path="/test/:msg">
              <Test logged={logged} setLogged={setLogged}/>
            </Route>
            <Route path="/:name">
              <User />
            </Route>
            <Route path="/">
              <AuthForm logged={logged} setLogged={setLogged}/>
            </Route>
          </Switch>
        </Router>
      ) : (
        <div>
          <Header logout={logged} setLogged={setLogged}/>
          <AuthForm logged={logged} setLogged={setLogged}/>
        </div>
      )
    }
    </div>
  );
}


export default App;
