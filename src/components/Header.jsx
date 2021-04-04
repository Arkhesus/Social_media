import React from 'react';

import {auth,db} from "../firebase";
import { useState } from "react";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const Search = (props, name) => 
  {



    let searchKey= props;
    let firstLetter = searchKey
    

    if(firstLetter.length <= 1){
      firstLetter = firstLetter.toUpperCase();
      console.log(firstLetter);
      db.collection('users').where('letter', '==', firstLetter)
      .get()
      .then(data => {
        data.forEach(childData => {
          // sampleArr.push(childData.payload.doc.data())
          console.log(childData.id, '=>', childData.data())
          name = childData.data().name

          return name
        })
      })
    }else{
      let name = firstLetter.charAt(0).toUpperCase() + firstLetter.slice(1).toLowerCase();
      console.log("Nom complet", name.length, name)
      db.collection('users').where('name', ">=", name).where('name', '<=', name+ '\uf8ff')
      .get()
      .then(data => {
        data.forEach(childData => {
          // sampleArr.push(childData.payload.doc.data())
          console.log(childData.id, '=>', childData.data())
          name = childData.data().name

          return name
        })
      })
    }


};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  main:{
    display:"flex",
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  drawer:{
    width: 250
  }
}));

const Header = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
      "drawer":false,
  })
  const [name, setName] = useState('');
  
  var logout = null
  if (props.logout === true){
        logout = 
        <div className={classes.main}>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search user…"
                    classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                    }}
                    onChange={(e) => (setName(Search(e.target.value, name)))}
                    inputProps={{ 'aria-label': 'search' }}
                />

                
            </div>
                <Button color="inherit" onClick={() => auth.signOut()}>Logout</Button>
        </div>
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Drawer anchor="left" open={state["drawer"]} onClose={() => setState({...state, ["drawer"]: false})}>
            <div className={classes.drawer}>
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon onClick={() => setState({...state, ["drawer"]: true})}/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Social Media
          </Typography>

          {logout}
          
        </Toolbar>
      </AppBar>

      <div id="test"></div>
    </div>
  );
}
export default Header;