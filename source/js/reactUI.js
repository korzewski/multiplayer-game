import React from 'react';
import ReactDOM from 'react-dom';
import ServerList from './reactUI/ServerList';
import Modal from './reactUI/Modal';

window.io = io();

ReactDOM.render(
	<Modal noCloseButton>
		<ServerList />
	</Modal>,
document.getElementById('ui'));