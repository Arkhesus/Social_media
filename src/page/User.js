import React from 'react';
import {
    useParams
  } from "react-router-dom";
import {auth, db} from "../firebase";
import { useState } from "react";
import CardPost from "../components/Card";
import { withRouter } from "react-router";

// const User = () => {
//     let { name } = useParams();

//     const [mail, setMail] = useState("");

//     db.collection("users").where("name", "==", name)
//     .get()
//     .then(doc => {
//         console.log(doc.docs[0].id)
//         setMail(doc.docs[0].id)
//     })
//     .catch(error => console.log(error))  


//     console.log("**", mail)
//     console.log("//", name);
//     return (
        
//         <div>
//             {mail ? 
//             (
//             <CardPost mail_user={{"mail" : mail}}/>
//             )
//             :(<p/>)
            
//             }
            
//         </div>
//     );
// }

// export default User;

class User extends React.Component {

    state = {
        user: null,
        mail : null
    };

    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.setState({ "user" : this.props.match.params.name})
        this.getMail(this.props.match.params.name);
        console.log("1.", this.state.user)
    }

   componentDidUpdate(){
       if(this.state.user != this.props.match.params.name){
        this.setState({ "user" : this.props.match.params.name})
        // this.setState({ "mail" : this.getMail() })
        this.getMail(this.props.match.params.name)
        console.log("Mail :", this.state.mail)
        
        
       }


    console.log("2", this.state.user)
   }

    getMail(name){

        db.collection("users").where("name", "==", name)
            .get()
            .then(doc => {
                console.log(doc.docs[0].id)
                this.setState({ "mail" : doc.docs[0].id })
                return (doc.docs[0].id);
            })
            .catch(error => console.log(error))  
   }

   render(){

    return(
        

        <div>
        <h1>Bienvenue sur le fil d'actualité de  {this.state.user}</h1>
        {this.state.mail ? 
        (<div>
        <CardPost mail_user={{"mail" : this.state.mail}}/>
        </div>
        )
        :(<p></p>)
        
        }
        
    </div>
    )
        
   }

}

export default withRouter(User);