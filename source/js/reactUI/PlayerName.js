import React from 'react';

export default class PlayerName extends React.Component {
    constructor() {
        super();
        this.state = {
            correctName: false
        };
    }

    componentDidMount() {
        this.refs.nameInput.focus();
    }

    onChange(e) {
        if(e.target.value.length > 2) {
            this.setState({correctName: true});
        } else {
            this.setState({correctName: false});
        }
    }

    submit() {
        if(this.state.correctName) {
            const playerName = this.refs.nameInput.value;
            localStorage.setItem('playerName', playerName);
            this.props.callback(playerName);
        }
    }

    render() {
        const button = <button onClick={this.submit.bind(this)} disabled={!this.state.correctName}>ok</button>;

        return (
            <div className="player-name">
                <h3>your nickname</h3>
                <form onSubmit={this.submit}>
                    <input type="text" ref="nameInput" defaultValue={this.state.name} onChange={this.onChange.bind(this)} />
                    {button}
                </form>
            </div>
        )
    }
}