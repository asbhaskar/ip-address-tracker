import { LatLngExpression } from 'leaflet';
import React from 'react'
import {MapContainer, TileLayer, Marker, useMap} from 'react-leaflet';

export interface Props {
    coords: LatLngExpression
}

const SetViewOnClick: React.FC<Props> = (props) => {
    const map = useMap();
    map.setView(props.coords, map.getZoom(), {
        animate: true
    });
  
    return null;
}

const  Map: React.FC<Props> = (props) => {
    return (
        <MapContainer center={props.coords} zoom={10} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={props.coords} />
            <SetViewOnClick coords={props.coords} />
        </MapContainer>
    )
}

export default Map
