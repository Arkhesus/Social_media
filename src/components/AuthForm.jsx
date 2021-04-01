import { useState, Fragment } from "react";
import { Card, Menu, Form, Button } from "semantic-ui-react";
import './css/Authform.css';
import { db, auth } from "../firebase";
import MenuApp from "../page/MenuApp";
import Header from './Header';
//importer CSS peut encore se faire ici :) 


async function authenticateUser(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password)
        console.log("Logged in");
    } catch (err) {
        console.log(err);
    }
}

async function createUser(email, password, username) {

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        console.log("Created");

        db.collection("users").doc(email).set({
            name: username,
        })
        .then(() => {

            db.collection("posts").doc(username).collection("posts").doc().set({
            })

            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });


    } catch (err) {
        console.log(err);
    }
}




function AuthForm() {

    //declaration de variable et constante
    const [isLogin, setIsLogin] = useState(true);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const [username, setUsername] = useState("");

    const [user, setUser] = useState("");

    auth.onAuthStateChanged((user) => setUser(user));

    //On retourne l'affichage qu'on veut
    return (
        <div className="page">
            {
                user ? 
                <MenuApp mail={user.email} />
                    : (
                        <Fragment>
                            <Header />
                            <Card
                                className="card"
                                style={{ marginTop: "30vh", margin: "auto" }}>
                                <Card.Content>
                                    <Card.Header className="title">Auth form</Card.Header>
                                    <Menu>
                                        <Menu.Item
                                            name="Login"
                                            onClick={() => setIsLogin(true)}
                                            active={isLogin}
                                            className="undertitle"
                                        ></Menu.Item>
                                        <Menu.Item
                                            name="Sign up"
                                            onClick={() => setIsLogin(false)}
                                            active={!isLogin}
                                            className="undertitle"
                                        ></Menu.Item>
                                    </Menu>
                                    {isLogin ? (
                                        <Fragment>
                                            <Form>
                                                <Form.Field>
                                                    <div className="position">
                                                        <label className="text">Email</label><br />
                                                        <input
                                                            placeholder="Email Address"
                                                            name="loginEmail"
                                                            type="email"
                                                            className="fields"
                                                            value={loginEmail}
                                                            onChange={(e) => setLoginEmail(e.target.value)}
                                                        ></input><br />
                                                    </div>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div className="position">
                                                        <label className="text">Password</label><br />
                                                        <input
                                                            placeholder="Password"
                                                            name="loginPassword"
                                                            type="password"
                                                            className="fields"
                                                            value={loginPassword}
                                                            onChange={(e) => setLoginPassword(e.target.value)}
                                                        ></input><br />
                                                    </div>
                                                </Form.Field>
                                                <Button
                                                    className="button"
                                                    onClick={() => authenticateUser(loginEmail, loginPassword)}
                                                >
                                                    Login
                                </Button>
                                            </Form>
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Form>
                                                <Form.Field>
                                                    <div className="position">
                                                        <label className="text">Email</label><br />
                                                        <input
                                                            placeholder="Email Address"
                                                            name="signUpEmail"
                                                            type="email"
                                                            className="fields"
                                                            value={signupEmail || ""}
                                                            onChange={(e) => setSignupEmail(e.target.value)}
                                                        ></input><br />
                                                    </div>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div className='position'>
                                                        <label className="text">Password</label><br />
                                                        <input
                                                            placeholder="Password"
                                                            name="signUpPassword"
                                                            type="password"
                                                            className="fields"
                                                            value={signupPassword || ""}
                                                            onChange={(e) => setSignupPassword(e.target.value)}
                                                        ></input><br />
                                                    </div>
                                                </Form.Field>
                                                <Form.Field>
                                                    <div className="position">
                                                        <label className="text">Name</label><br />
                                                        <input
                                                            placeholder="Username"
                                                            name="username"
                                                            type="test"
                                                            className="fields"
                                                            value={username || ""}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                        ></input><br />
                                                    </div>
                                                </Form.Field>
                                                <Button
                                                    className="button"
                                                    onClick={() => createUser(signupEmail, signupPassword,username, true)}
                                                >
                                                    Sign up
                            </Button>
                                            </Form>
                                        </Fragment>
                                    )
                                    }
                                </Card.Content>
                            </Card>
                        </Fragment>
                    )}

        </div>
    )
}

export default AuthForm;