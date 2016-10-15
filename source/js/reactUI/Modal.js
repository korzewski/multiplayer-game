import React from 'react';
import ServerList from './ServerList';

export default class Modal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            openModal: true
        };
    }

    render() {
        const closeButton = this.props.noCloseButton ? '' : (<div className="close" onClick={this.closeModal.bind(this)}>close</div>);

        const extendedChildren = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {closeModal: this.closeModal.bind(this)})
        );

        return (
            <div className={'modal ' + (this.state.openModal ? 'open' : '')}>
                <div className="modal-content">
                    {extendedChildren}
                </div>
                {closeButton}
            </div>
        )
    }

    closeModal() {
        this.setState({ openModal: false });
    }
}