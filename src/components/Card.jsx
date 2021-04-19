import React from 'react';
import { Card } from "semantic-ui-react";
import {auth, db} from "../firebase";

export default class CardPost extends React.Component {

    state = {
        posts : null,
        user: null,
        mail : null
    };

    constructor(props){
        super(props);                
    }

    componentDidMount(){
        this.setState({ "mail" : this.props.mail_user.mail})
        this.getPost(this.props.mail_user.mail);
    }

   componentDidUpdate(){
       if(this.state.mail != this.props.mail_user.mail){
        this.setState({ "mail" : this.props.mail_user.mail})
        this.getPost(this.props.mail_user.mail)        
        
       }
    }

    getPost(mail){
        db.collection("users").doc(mail)
            .get()
            .then((doc => {
                if(doc.exists){
                    this.setState({"user" : doc.data().name})
                    db.collection("posts").doc(doc.data().name).collection("posts")
                    .get()
                    .then(querysnapshot => {
                        const posts = []
                        querysnapshot.docs.forEach(doc => {
                            const data = doc.data()
                            posts.push(data)
                        })
                        this.setState({"posts" : posts})
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
