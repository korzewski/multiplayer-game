const fontStyle = { font: "bold 16px Arial", fill: "#fff" };

export default class Menu extends Phaser.State {
    create(){
    	this.menuText = this.game.add.text(100, 30, 'rooms list', fontStyle);
    	this.menuText.anchor.setTo(0, 0.5);

    	this.updateText = this.game.add.text(this.game.width - 20, 30, 'update rooms', fontStyle);
    	this.updateText.anchor.setTo(1, 0.5);
    	this.updateText.inputEnabled = true;

    	this.updateText.events.onInputDown.add(this.game.manager.updateRoomsList, this);
    	this.game.events.onRoomsList.add(this.showRoomList, this);

    	this.game.manager.connect();
    }

    showRoomList(rooms) {
    	if(this.roomsButtons) {
    		this.roomsButtons.destroy();
    	}

    	this.roomsButtons = this.game.add.group();
    	this.roomsButtons.position.setTo(100, 50);

    	for(let i = 0; i < rooms.length; i++) {
	    	const button = this.game.add.text(0, i * 30, `${rooms[i].name} [${rooms[i].players.length}]`, fontStyle);
	    	button.inputEnabled = true;
	    	button.events.onInputDown.add(this.changeRoom.bind(this, rooms[i].name));
	    	this.roomsButtons.add(button);
    	}
    }

    changeRoom(roomName) {
    	console.log('changeRoom: ', roomName);
    	this.game.manager.changeRoom(roomName);
    }
}