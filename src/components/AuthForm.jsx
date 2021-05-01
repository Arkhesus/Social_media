import { useState, Fragment } from "react";
// import { Card, Menu, Form, Button } from "semantic-ui-react";
import { db, auth } from "../firebase";
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme)=>({
    root: {
        minWidth: 275,
        maxWidth: 400,
        margin: "auto",
        marginTop: 20,
      },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 12,
    },
    form:{
        marginTop: 20
    },
    error:{
        background: "#ffe1e1",
        padding: 5
    }
  }))

async function authenticateUser(email, password) {
    return new Promise((async(resolve, reject)=>{
        try {
            await auth.signInWithEmailAndPassword(email, password)
            console.log("Logged in");
            resolve()
        } catch (err) {
            console.log(err);
            reject(err)
        }
    }))
}

async function createUser(email, password, username) {
    return new Promise(async(resolve, reject) => {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            console.log("Created");
    
            db.collection("users").doc(email).set({
                name: username.charAt(0).toUpperCase() + username.slice(1).toLowerCase(),
                letter: username[0].toUpperCase()
            })
            .then(() => {
                db.collection("posts").doc(email).collection("posts").doc().set({})
                
                console.log("Document successfully written!");
                resolve()
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    
    
        } catch (err) {
            console.log(err);
            reject(err)
        }
    })
    
}



function AuthForm(props) {
    const classes = useStyles();

    const [isLogin, setIsLogin] = useState(true);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const [username, setUsername] = useState("");

    const [user, setUser] = useState("");

    const [error, setError] = useState(false)

    auth.onAuthStateChanged((user) => {
        setUser(user)
        if (user) {
            props.setLogged(true)
        }
        else{
            props.setLogged(false)
        }
    });
    
    return (
        <div className={classes.root}>
            <Fragment>
                <Card
                    className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title}>
                            Social Media auth page
                        </Typography>
                        { error ? 
                        (
                            <Typography className={classes.error}>
                                Oops, something went wrong... Please retry !
                            </Typography>
                        ):(<p></p>)} 
                        <Grid container direction="row" alignItems="center" justify="space-evenly">
                            <Grid item xs>
                                <Button
                                    fullWidth
                                    size="small"
                                    onClick={() => setIsLogin(true)}
                                    color={isLogin ? "primary" : "default"}
                                >Login</Button>
                            </Grid>
                            <Grid item xs>
                                <Button
                                    fullWidth
                                    size="small"
                                    color="primary"
                                    onClick={() => setIsLogin(false)}
                                    color={!isLogin ? "primary" : "default"}
                                >Sign up</Button>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" />
                        {isLogin ? (
                            <Fragment>
                                <Grid container className={classes.form} direction="column" justify="center" alignItems="center" spacing={3} alignContent="between">
                                    <Grid item sm={12}>
                                        <TextField id="standard-email-input" 
                                            fullWidth
                                            label="Email address" 
                                            type="email"
                                            variant="outlined" 
                                            autoComplete="email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}/>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TextField id="standard-password-input"
                                            label="Password"
                                            type="password"
                                            autoComplete="current-password" 
                                            variant="outlined" 
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}/>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                authenticateUser(loginEmail, loginPassword).then(()=>{
                                                    props.setLogged(true)  
                                                }).catch(err=>{
                                                    setError(true)
                                                })
                                            }}>Login</Button>
                                    </Grid>
                                </Grid>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Grid container className={classes.form} direction="column" justify="center" alignItems="center" spacing={3}>
                                    <Grid item sm={12}>
                                        <TextField id="standard-email-input" 
                                            label="Email address" 
                                            type="email"
                                            variant="outlined" 
                                            autoComplete="email"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}/>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TextField id="standard-password-input"
                                            label="Password"
                                            type="password"
                                            autoComplete="current-password" 
                                            variant="outlined" 
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}/>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TextField id="standard-username-input"
                                                label="Username"
                                                type="text"
                                                autoComplete="username" 
                                                variant="outlined" 
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}/>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            createUser(signupEmail, signupPassword, username).then(()=>{
                                                    props.setLogged(true)  
                                                }).catch(err=>{
                                                    setError(true)
                                                })
                                        }}>Sign up</Button>
                                </Grid>
                            </Fragment>
                        )}
                    </CardContent>
                </Card>
            </Fragment>
        </div>
    )
}

export default AuthForm;