import AuthForm from './components/AuthForm';
import User from './page/User';
import Header from "./components/Header";
import {useState} from "react";
import {auth, getToken, messaging, getUserMail, getUserName, db} from "./firebase";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import Home from "./page/Home"

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
 
const theme = createMuiTheme({
  palette: {
    background:{
      default: "#f5f5f5"
    }
  },
});

function App() {
  const [logged, setLogged] = useState(false)
  const [isTokenFound, setTokenFound] = useState(false);
  const [open, setOpen] = useState(false);
  const [newNotif, setNewNotif] = useState({
    open: null,
    content: []
  });
  var user

  const [notif, setNotif] = useState({
    title:null,
    body:null
  })

  getToken(setTokenFound);

  messaging.onMessage(payload=>{
    setNotif({
      title:payload.notification.title ,
      body:payload.notification.body 
    })
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

  const checkNotifs = () =>{

    db.collection("follows").where("follower", "==", getUserMail()).get().then((resp)=>{
      console.log(resp.docs)
      setNewNotif({open:true, content:resp.docs})
    })
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewNotifClose = () => {
    setNewNotif({open:false});
  };

  if (logged && newNotif.open === null) checkNotifs()

  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <div>
      {
        logged ? (
          <div>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
              <DialogTitle id="simple-dialog-title">New post from : {notif.title}</DialogTitle>
              <DialogContent>
                <DialogContentText>{notif.body}</DialogContentText>
              </DialogContent>
            </Dialog>

          {newNotif.open ? (
            <Dialog onClose={handleNewNotifClose} aria-labelledby="simple-dialog-title" open={newNotif.open}>
              <DialogTitle id="simple-dialog-title">Hello, you have {newNotif.content.length} new notification(s) from :</DialogTitle>
              {newNotif.content.map((notif)=>{
                return (<DialogContent>
                          <DialogContentText>{notif.data().followed}</DialogContentText>
                        </DialogContent>)
              })
              
              }
              
            </Dialog>) : (<div/>)}

            <Router>
              <Header logout={logged} setLogged={setLogged}/>
              <Switch>
                <Route path="/:name">
                  <User />
                </Route>
                <Route path="/">
                  <Home mail={getUserMail()}/>
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
    </ThemeProvider>
  );
}


export default App;
