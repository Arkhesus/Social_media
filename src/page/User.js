import React from 'react';
import {
    useParams
  } from "react-router-dom";
import {auth, db, getUserMail} from "../firebase";
import { useState } from "react";
import CardPost from "../components/Card";
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

class User extends React.Component {

    state = {
        user: null,
        mail : null,
        followed: null,
    };

    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.setState({ "user" : this.props.match.params.name})
        this.getMail(this.props.match.params.name);
    }

   componentDidUpdate(){
       if(this.state.user != this.props.match.params.name){
        console.log("comp update")
        this.setState({ "user" : this.props.match.params.name})
        this.getMail(this.props.match.params.name)
       }
   }

    getMail(name){
        db.collection("users").where("name", "==", name)
            .get()
            .then(doc => {
                console.log(doc.docs[0].id)
                this.setState({ "mail" : doc.docs[0].id })
                
                this.getFollow()
            })
            .catch(error => console.log(error))  
   }

    getFollow(){
        db.collection("follows").doc(getUserMail()+"_"+this.state.mail).get().then(doc=>{
            this.setState({followed:doc.exists})
        })
   }

    setFollow(){
        db.collection("follows").doc(getUserMail()+"_"+this.state.mail).set({
            follower: getUserMail(),
            followed : this.state.mail
        }).then(doc=>{
            this.getFollow()
        })
    }

    setUnFollow(){
        db.collection("follows").doc(getUserMail()+"_"+this.state.mail).delete().then(doc=>{
            this.getFollow()
        })
    }

   render(){
    return(
        <div>
        <h1>Bienvenue sur le fil d'actualité de  {this.state.user}</h1> 

        {this.state.followed==true ? 
        (
            <Button variant="contained" color="primary" 
                onClick={() => {
                            console.log("clicked")
                            this.setUnFollow()
                        }
                    }>Ne plus suivre
            </Button>
        )
        :
        (
            this.state.followed == null ? (
                <p>Loading...</p>
            )
            :
            (
                <Button variant="contained" color="primary" 
                onClick={() => {
                            this.setFollow()
                        }
                    }>Suivre
            </Button>
            )
        )}

        {this.state.mail ? 
        (
            <div>
                <CardPost mail_user={{"mail" : this.state.mail}}/>
            </div>
        )
        :
        (
            <p></p>
        )}
        
    </div>
    )     
   }
}

export default withRouter(User);