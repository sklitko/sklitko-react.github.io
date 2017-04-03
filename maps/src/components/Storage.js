/* global google */

import React from 'react';

class Storage extends React.Component {


    render() {
        return (
            <ul>
                {this.props.myStorage.map((result, key) => <li key={key}><a href="#"
                                                                            onClick={() => this.props.loadDirection(result.name)}>{result.name}</a>
                </li>)}
            </ul>
        )
    }

}

export default Storage