import React from 'react';
import { Card } from "semantic-ui-react";

const CardPost = () => {
    return (
        <div>
            <Card 
                className="teams_card">
                <Card.Content>    
                <Card.Header className="title">Nom</Card.Header>
                    <h2>Message</h2>
                    <p>aaaaa</p>
                </Card.Content>
            </Card>
        </div>
    );
}

export default CardPost;
