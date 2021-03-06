import React from 'react';
import { auth, db } from "../firebase";
import CreatePost from "./CreatePost";
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AddIcon from '@material-ui/icons/Add';
import Popover from '@material-ui/core/Popover';
import {
  useHistory,
  Link,
} from "react-router-dom";


const Search = (props) => {
    let searchText= props;
    let name = searchText.charAt(0).toUpperCase() + searchText.slice(1).toLowerCase();
    
    return new Promise((resolve, reject) =>{
      db.collection('users').where('name', ">=", name).where('name', '<=', name+ '\uf8ff')
      .get()
      .then(data => {
        const resp = []
        data.forEach(childData => {
          name = childData.data().name
          resp.push(name)
        })
        resolve(resp)
      })
    })
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginRight: 1,
      padding: 5
    },
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      fontSize: "0.7rem",
      width: "45%"
    },
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

    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(1),
      width: '50%',
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
    [theme.breakpoints.down('xs')]: {
      marginRight: 1,
      padding: 5
    },
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
    width: 500,
    [theme.breakpoints.down('xs')]: {
      width: "80vw",
    },
  }, 
  liste: {
    minWidth:250,
  },
  logout:{
    [theme.breakpoints.down('xs')]: {
      fontSize: "0.7rem",
    },
  }
}));

const Header = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
      "drawer":false,
      "names": [],
  })

  const [anchorEl, setAnchorEl] = React.useState(null);

  const closeDrawer = () => {
    setState({...state, ["drawer"]: false})
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const history = useHistory();

  const routeChange = () =>{ 
    let path = `/`;
    history.push(path);
  }

  const open = Boolean(anchorEl);
  
  var logout = null
  if (props.logout === true){
    logout = 
    <div className={classes.main}>
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            
            <InputBase
                placeholder="Search user???"
                classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
                }}
                
                onKeyPress={async(e) => {
                  
                  if (e.key === 'Enter'){
                    Search(e.target.value).then((names) => setState({names:names}))
                    setAnchorEl(e.currentTarget)
                  }
                }}
                inputProps={{ 'aria-label': 'search' }}
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <List className={classes.liste}>
                {state.names.map((i) => {
                  return (<ListItem>
                    <Link to={'/'+i} onClick={()=> handleClose()}>{i}</Link>
                  </ListItem>)
                })}

              </List>
            </Popover>
        </div>
        <Button className={classes.logout} color="inherit" onClick={() => {
            auth.signOut().then(()=>{
              props.setLogged(false)  
            })
          }}>Logout</Button>
    </div>
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Drawer anchor="left" open={state["drawer"]} onClose={() => setState({...state, ["drawer"]: false})}>
            <div className={classes.drawer}>
                <CreatePost closeDrawer={closeDrawer}></CreatePost>
            </div>
        </Drawer>
        <Toolbar>
          {
            props.logout ? 
            (
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <AddIcon onClick={() => setState({...state, ["drawer"]: true})}/>
            </IconButton>
            ) : (<p></p>)
          }
          <Typography variant="h6" className={classes.title} onClick={routeChange}>
            Social Media
          </Typography>

          {logout}
          
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default Header;