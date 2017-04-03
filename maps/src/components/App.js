/* global google */
import React from 'react';
import ReactModal from 'react-modal';
import Map from './Map';
import Inputs from './Inputs';
import Storage from './Storage';



class App extends React.Component {

    constructor() {
        super();
        this.updatePoints = this.updatePoints.bind(this);
        this.drawDirections = this.drawDirections.bind(this);
        this.addWaipts = this.addWaipts.bind(this);
        this.updateWaipts = this.updateWaipts.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this._loadDirection = this._loadDirection.bind(this);
    }


    state = {
        points: {
            origin: null,
            destination: null,
        },
        directions: null,
        center: new google.maps.LatLng(49.079591, 30.927628),
        markers: [],
        waipts: [],
        showModal: false,
        myStorage: []
    };

    componentWillMount() {
        const localStorageRef = localStorage.getItem('directions');

        if (localStorageRef) {
            const directions = JSON.parse(localStorageRef);
            const dirMyStorage = [...this.state.myStorage];
            directions.map((direction)=>dirMyStorage.push(direction));
            this.setState({
                myStorage: dirMyStorage
            });
        }
    }

    _loadDirection (name) {
        const direction = localStorage.getItem(name);
        this.setState({
            directions: JSON.parse(direction),
        });
    }


    updatePoints(key, value) {
        const points = {...this.state.points};
        points[key] = value;
        this.setState({
            points
        });
    }

    addMarkers(place) {
        this.setState({
            markers: [
                ...this.state.markers,
                { position: place.geometry.location },
            ],
        });
    }

    addWaipts() {
        const waipts = this.state.waipts;
        if (waipts.length < 4) {
            waipts.push({
                location: null,
                stopover: true
            });
            this.setState({waipts});
        } else {
            this.handleOpenModal();
        }
    }

    updateWaipts(key, value) {
        const waipts = [...this.state.waipts];
        waipts[key]= {location: value};
        this.setState({waipts});
    }

    drawDirections() {

        if (this.state.points.origin && this.state.points.destination) {
            const DirectionsService = new google.maps.DirectionsService();


            DirectionsService.route({
                origin: this.state.points.origin,
                destination: this.state.points.destination,
                waypoints: this.state.waipts,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {

                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        myStorage: [
                            ...this.state.myStorage,
                            {name: this.state.points.origin + ' - ' + this.state.points.destination},
                        ],
                        markers: null
                    });
                    const name = this.state.points.origin + ' - ' + this.state.points.destination;
                    localStorage.setItem(name, JSON.stringify(result));

                    localStorage.setItem('directions', JSON.stringify(this.state.myStorage));
                    this.setState({
                        directions: result,
                    });
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    componentDidMount() {

    }

    render() {
        return (
            <div style={{height: `100vh`}}>
                <Map
                    containerElement={
                        <div style={{height: `75%`}}/>
                    }
                    mapElement={
                        <div style={{height: `100%`}}/>
                    }
                    center={this.state.center}
                    directions={this.state.directions}
                    markers={this.state.markers}
                />
                <Inputs points={this.state}
                        updatePoints={this.updatePoints}
                        drawDirections={this.drawDirections}
                        addWaipts={this.addWaipts}
                        waipts={this.state.waipts}
                        updateWaipts={this.updateWaipts}
                        addMarkers={this.addMarkers}
                />
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Error"
                >
                    <p>Нельзя больше 5 точек!</p>
                    <button onClick={this.handleCloseModal}>Close Modal</button>
                </ReactModal>
                <Storage
                    myStorage={this.state.myStorage}
                    loadDirection={this._loadDirection}
                />
            </div>
        );
    }
}

export default App