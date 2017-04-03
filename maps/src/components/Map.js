/* global google */
import React from "react";

import {
    withGoogleMap,
    GoogleMap,
    Marker,
    DirectionsRenderer,

} from "react-google-maps";

const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={7}
        defaultCenter={props.center}
    >
        {props.markers && props.markers.map((marker, index) => <Marker position={marker.position} key={index} />)

        }

        {props.directions && <DirectionsRenderer directions={props.directions}/>}

    </GoogleMap>

));

export default Map