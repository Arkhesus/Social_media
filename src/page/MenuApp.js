import React from 'react'
import {auth} from "../firebase";
import * as AiIcons from 'react-icons/ai';


function MenuApp() {

    return (
        <div>
                <h1>Logged in !!! :) :) :)</h1>
                <AiIcons.AiOutlinePoweroff onClick={ () => auth.signOut()}/>
        </div>
    )
}

export default MenuApp
