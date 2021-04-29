import './App.css';
import AuthForm from './components/AuthForm';
import Test from './page/Test';
import User from './page/User';
import Header from "./components/Header";
import {useState} from "react";
import {auth, db, getToken, messaging} from "./firebase";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
 
function App() {
  const [logged, setLogged] = useState(false)
  const [isTokenFound, setTokenFound] = useState(false);
  const [open, setOpen] = useState(false);

  getToken(setTokenFound);

  messaging.onMessage(payload=>{
    console.log("RECUUUUUUUUUUU MGL")
    console.log(payload)
    setOpen(true)
  })

  auth.onAuthStateChanged((user) => {
    if (user) {
        setLogged(true)
    }
    else{
        setLogged(false)
    }
  });

  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div>
    {
      logged ? (
        <div>
          <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
          </Dialog>
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
        </div>
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
