import React from 'react'
import CardPost from "../components/Card"
import Header from "../components/Header"
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme)=>({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
      
    },
    cards: {
        maxWidth: 500,
        padding: 20,
        margin: "auto",
    }
  }))

function MenuApp(props) {

    const classes = useStyles();

    return (
        <div className={classes.cards}>
            <CardPost mail_user={{"mail" : props.mail}}/>
        </div>
    )
}

export default MenuApp
