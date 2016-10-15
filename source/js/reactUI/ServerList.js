import React from 'react';

export default class ServerList extends React.Component {
    constructor() {
        super();
        this.state = {
            serverRooms: []
        }
    }

    componentDidMount() {
        window.io.on('rooms-list', this.onRoomsList.bind(this));
    }

    onRoomsList(serverRooms) {
        this.setState({serverRooms});
    }

    joinRoom(roomName) {
        window.io.emit('join-room', roomName);
        this.props.closeModal();
    }

    render() {
        let list = this.state.serverRooms.map((item, index) => {
            if(index === 0) return;

            return <ListItem key={index} data={item} clickHandle={this.joinRoom.bind(this, item.name)} />
        });

        return (
            <div className="server-list">
                <h3>Server list</h3>
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