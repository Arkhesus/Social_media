import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {db, storage, auth, getUserName, getUserMail} from '../firebase'


const useStyles = makeStyles((theme) => ({
    form:{
        display: "block",
    },
    input: {
        display: 'none',
      },
  }));

const submitPost = async(post, file, setDone) => {
    var user = await getUserName()

    if (file){
        var filename = file[0].name
        await storage.ref("images/"+filename).put(file[0])
        db.collection("posts").doc(user).collection("posts").doc().set({
            message: post,
            image : filename,
        }).then((e) => {
            setDone(true)
        }).catch((e)=>{
            console.log(e)
        })
    }
    else{
        db.collection("posts").doc(user).collection("posts").doc().set({
            message: post,
            image : "",
        }).then((e) => {
            setDone(true)
        }).catch((e)=>{
            console.log(e)
        })
    }
}

const CreatePost = () => {
    const [done, setDone] = useState(false)

    const classes = useStyles();
    var file
    var post 
    return (
        <div>
            <h2>Create a new post</h2>
            <div className={classes.form}>
                <TextField id="standard-basic" label="Post" multiline onChange={(e) => {
                    post = e.target.value
                }}/>
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => file = e.target.files}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span">
                    Upload a photo
                    </Button>
                </label>
                <Button color="primary" onClick={() => submitPost(post, file, setDone)}>
                    Submit
                </Button>

            </div>
            {
                done ? <p>New post posted</p> : <div></div>
            }
        </div>
    );
}

export default CreatePost;
