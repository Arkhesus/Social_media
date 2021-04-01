import React from 'react';
import { useState } from "react";
import { Card } from "semantic-ui-react";
import {auth, db} from "../firebase";

export default class CardPost extends React.Component {

    state = {
        posts : null,
        user: null
    };

    constructor(props){
        super(props);

        console.log(props.mail_user.mail);

        db.collection("users").doc(props.mail_user.mail)
            .get()
            .then((doc => {
                if(doc.exists){

                    this.setState({user : doc.data().name})
                    db.collection("posts").doc(doc.data().name).collection("posts")
                    .get()
                    .then(querysnapshot => {
                        const posts = []
                        querysnapshot.docs.forEach(doc => {
                            console.log(doc.data())
                            const data = doc.data()
                            posts.push(data)
                        })
                        this.setState({posts : posts})
                    })
                    .catch(error => console.log(error))  
                }



            }))



                
    }



    render(){
    return (
        <div>
            {
                
                this.state.posts && this.state.posts.map (post => {
                    console.log(this.state);

                    if(post.message != null){
                        return(
                            <Card className="teams_card">
                                <Card.Content>    
                                    <Card.Header className="title">{this.state.user}</Card.Header>
                                        <h2>{post.message}</h2>
                                        
                                </Card.Content>
                            </Card>
                            )
                    }

                })

            }
            
        </div>
    );
}

}