import React from 'react';
import ReactDOM from 'react-dom';
import ServerList from './ServerList';
import Modal from './Modal';
import PubSub from 'pubsub-js';

window.io = io();

class Init extends React.Component {
    constructor() {
        super();
        this.state = {
            eventsReady: false
        }

        PubSub.subscribe('manager-ready', this.onEventsReady.bind(this));
    }

    onEventsReady() {
        this.setState({eventsReady: true});
    }

    render() {
        if(!this.state.eventsReady) {
            return (
                <Modal>
                    <Loading />
                </Modal>
            )
        }

        return (
            <Modal>
                <ServerList />
            </Modal>
        )
    }
};

const Loading = (props) => {
    return <span className="loading">loading...!</span>
};

ReactDOM.render(<Init />, document.getElementById('ui'));