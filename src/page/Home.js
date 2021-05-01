import React from 'react'
import CardPosts from "../components/CardPosts"
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

function Home(props) {

    const classes = useStyles();

    return (
        <div className={classes.cards}>
            <CardPosts mail_user={{"mail" : props.mail}}/>
        </div>
    )
}

export default Home
