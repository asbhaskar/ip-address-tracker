import React from 'react';
import './InfoDisplay.css';

export interface Props {
    infoDescription: String;
    infoText: String
}

const  InfoDisplay: React.FC<Props> = (props) => {
    return (
        <div className="info__item">
            <div className="info__description">{props.infoDescription}</div>
            <div className="info__text">{props.infoText}</div>
        </div>
    )
}

export default InfoDisplay
