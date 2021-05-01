import { Button, IconButton } from '@material-ui/core';
import { PostAdd, ThumbDown, ThumbUp } from '@material-ui/icons';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {auth, db, getUserMail, storage, fbase} from "../firebase";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
    card: {
        margin:"10px"
    }
  })

class CardPost extends React.Component {

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
    //    else {
    //         this.getPost(this.props.mail_user.mail)
    //    }
    }

    getUser(mail){
        db.collection("users").doc(mail)
        .get()
        .then(doc => {
            if(doc.exists){
                this.setState({"user" : doc.data().name})
            }
        })
    }

    getPost(mail){
        db.collection("posts").doc(mail).collection("posts")
        .get()
        .then(async(querysnapshot) => {
            const posts = []
            for(const doc of querysnapshot.docs) {
                var imageUrl = await this.getImages(doc.data().image);
                var existLike = await db.collection("likes").doc(getUserMail()+"_"+doc.id).get()

                var data = {
                    post: doc.data(),
                    img: imageUrl,
                    id: doc.id,
                    iLiked: existLike.exists
                };
                
                console.log(data);
                posts.push(data);
            }

            this.setState({"posts" : posts})
        })
        .catch(error => console.log(error))  

    }

    async getImages(name){
        if(name){
            return await storage.ref("images/").child(name).getDownloadURL()
        }
    }

    async likePost(id){
        var mail = getUserMail()
        var exist = await db.collection("likes").doc(mail+"_"+id).get()

        if (!exist.exists){
            db.collection("likes").doc(mail+"_"+id).set({
                "userId":mail,
                "postId":id
            })
            .then(() => {
                db.collection("posts").doc(this.state.mail).collection("posts").doc(id).update({
                    "likes":fbase.firestore.FieldValue.increment(1)
                }).then(()=> {
                    this.getPost(this.state.mail)
                })
            })
            .catch(err => {
                console.log(err)
            })  
        }
        else{
            db.collection("likes").doc(mail+"_"+id).delete().then(()=>{
                db.collection("posts").doc(this.state.mail).collection("posts").doc(id).update({
                    "likes":fbase.firestore.FieldValue.increment(-1)
                }).then(()=> {
                    this.getPost(this.state.mail)
                })
            })
        }
    }

    render(){
        console.log("re rendering")
        const { classes } = this.props;
        return (
            <div>
                {
                this.state.posts && this.state.posts.map(post => {
                    if(post.post.message != null){
                        return ( 
                            <div className={classes.card}>
                                <Card>
                                    <CardActionArea>
                                        {
                                            post.img ? 
                                            (<img src={post.img} height="150px"/>) 
                                            :
                                            <p></p>
                                        }
                                        
                                        <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {this.state.user}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {post.post.message}
                                        </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        Likes : {post.post.likes ? post.post.likes : 0 }
                                        {
                                            post.iLiked ? (
                                                <IconButton>
                                                    <ThumbDown onClick={() => this.likePost(post.id)}/>
                                                </IconButton>
                                            ) : (
                                                <IconButton>
                                                    <ThumbUp onClick={() => this.likePost(post.id)}/>
                                                </IconButton>
                                            )
                                        }
                                    </CardActions>
                                </Card>
                            </div>
                        )
                    }
                })
                }
            </div>
        );
    }
}

export default withStyles(useStyles)(CardPost)