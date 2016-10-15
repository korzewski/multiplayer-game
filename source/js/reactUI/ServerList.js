import React from 'react';
import PubSub from 'pubsub-js';
import PlayerName from './PlayerName';

let uiReady = false,
    playerName = localStorage.getItem('playerName');

export default class ServerList extends React.Component {
    constructor() {
        super();
        this.state = {
            serverRooms: [],
            editPlayerName: false
        }

        window.io.on('rooms-list', this.onRoomsList.bind(this));
    }

    onRoomsList(serverRooms) {
        this.setState({serverRooms});
    }

    joinRoom(roomName) {
        window.io.emit('join-room', roomName);
        this.props.closeModal();
    }

    editPlayerName() {
        this.setState({editPlayerName: true});
    }

    updatePlayerName(name) {
        console.log('updatePlayerName: ', name);
    }

    render() {
        if(!playerName || this.state.editPlayerName) {
            return <PlayerName callback={this.updatePlayerName.bind(this)} />
        }

        if(!uiReady) {
            uiReady = true;
            PubSub.publish('ui-ready', playerName);
        }

        let list = this.state.serverRooms.map((item, index) => {
            if(index === 0) return;

            return <ListItem key={index} data={item} clickHandle={this.joinRoom.bind(this, item.name)} />
        });

        return (
            <div className="server-list">
                <h3>Server list</h3>
                <div className="nick"><span>nick:</span> {playerName} <EditName clickHandle={this.editPlayerName.bind(this)} /></div>
                {list}
            </div>
        )
    }
}

const ListItem = (props) => {
    return (
        <div className="list-item" onClick={props.clickHandle}>
            <div className="name">{props.data.name}</div>
            <div className="count">players: {props.data.players.length}</div>
        </div>
    )
}

const EditName = (props) => {
    return (
        <div className="change" onClick={props.clickHandle}>
            change
        </div>
    )
}