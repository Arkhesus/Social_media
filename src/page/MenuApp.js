import React from 'react'
import CardPost from "../components/Card"
import Header from "../components/Header"


function MenuApp() {

    return (
        <div>
            <Header logout={true}/>
                {/* <h1>Logged in !!! :) :) :)</h1> */}
                {/* <AiIcons.AiOutlinePoweroff onClick={ () => auth.signOut()}/> */}

                <CardPost/>
        </div>
    )
}

export default MenuApp
