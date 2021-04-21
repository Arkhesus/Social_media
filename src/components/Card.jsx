import { PostAdd } from '@material-ui/icons';
import React from 'react';
import { Card } from "semantic-ui-react";
import {auth, db, storage} from "../firebase";

export default class CardPost extends React.Component {

    state = {
        posts : [],
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
                    .then(async(querysnapshot) => {
                        const posts = []
                        for(const doc of querysnapshot.docs) {
                            console.log(doc.data())
                            var imageUrl = await this.getImages(doc.data().image);
                            var data = {
                                post: doc.data(),
                                img: imageUrl
                            };
                            console.log(data);
                            posts.push(data);
                        }

                        this.setState({"posts" : posts})
                    })
                    .catch(error => console.log(error))  
                }
            }))
    }

    async getImages(name){
        if(name){
            return await storage.ref("images/").child(name).getDownloadURL()
        }
    }

    render(){
        return (
            <div>
                {
                    this.state.posts && this.state.posts.map(post => {
                        if(post.post.message != null){
                            return( <Card className="teams_card">
                                        <Card.Content>    
                                            <Card.Header className="title">{this.state.user}</Card.Header>
                                            <h2>{post.post.message}</h2>
                                            <img src={post.img} height="80px"/>
                                                
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
