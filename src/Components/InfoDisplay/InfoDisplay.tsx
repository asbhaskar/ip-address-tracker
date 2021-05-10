import React from 'react';
import './InfoDisplay.css';

export interface Props {
    infoDescription: String;
    infoText: String
}

const  InfoDisplay: React.FC<Props> = (props) => {
    return (
        <div className="info-item-holder">
            <div className="info-item-description">{props.infoDescription}</div>
            <div className="info-item-text">{props.infoText}</div>
        </div>
    )
}

export default InfoDisplay
