import React from 'react';
import {
    useParams
  } from "react-router-dom";

const Test = (props) => {
    let { msg } = useParams();

    return (
        <div>
            <h1>Hello in test: {msg}</h1>
            <h3>{props.logged}</h3>
            <button onClick={() => {
                props.setLogged(true)
            }}>change</button>
        </div>
    );
}

export default Test;
