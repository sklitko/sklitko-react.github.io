/* global google */

import React from 'react';

class Inputs extends React.Component {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.renderInputs = this.renderInputs.bind(this);
    }

    addPoints(key) {
        this.props.updatePoints(key.name, key.value);
    }

    componentDidMount() {
        const start = new google.maps.places.Autocomplete(
            (this.origin), {
                types: ['geocode']
            });
        start.addListener('place_changed', () => {
            this.addPoints(this.origin);
            this.props.addMarkers(start.getPlace());
        });

        const end = new google.maps.places.Autocomplete(
            (this.destination), {
                types: ['geocode']
            });
        end.addListener('place_changed', () => {
            this.addPoints(this.destination);
            this.props.addMarkers(end.getPlace());
            this.props.drawDirections();
        });
    }

    handleClick(e, key) {
        const place = new google.maps.places.Autocomplete(e.target);
        place.addListener('place_changed', () => {
            this.props.updateWaipts(key, place.getPlace().geometry.location);
            this.props.addMarkers(place.getPlace());
            this.props.drawDirections();

        });
    }

    renderInputs(key) {
        return (
            <p className="waipts" key={key}>
                <input  name="location" placeholder="" type="text"
                       ref={(input) => this.location = input}
                       onClick={(e) => this.handleClick(e, key)}/>
            </p>
        )
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 inputs">
                        <p>
                            <b>Адрес отправки:</b> <input id="start" name="origin" ref={(input) => this.origin = input}
                                                          placeholder="" type="text"

                        />
                        </p>
                        {Object.keys(this.props.waipts).map(this.renderInputs)}
                        <p>
                            <b>Адрес прибытия:</b>
                            <input id="end" name="destination" ref={(input) => this.destination = input}
                                   placeholder="" type="text"/>
                        </p>
                        <button className="btn btn-primary" onClick={() => this.props.addWaipts()}>Добавить точку
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Inputs