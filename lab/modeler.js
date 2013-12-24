

var SpriteCanvas = Base.extend({
	constructor: function() {
		this.canvas = $("#canvas")[0];
		this.context = this.canvas.getContext('2d');
		this.graphics = [];
		this.dragging = false;
		this.selection = null;
		this.dragoffx = 0;
		this.dragoffy = 0;
		this.interval = 1000 / 60;
		this.bgColor = '#000000';
		this.name = 'sprite1';
		var self = this;
		setInterval(function() { self.update(); self.draw(); }, this.interval);
	},
	update: function() {
	},
	draw: function() {
		this.drawBackground();
		for (var i = 0; i < this.graphics.length; i++) {
			var graphic = this.graphics[i];
			graphic.draw(this.context);
		}
	},
	drawBackground: function() {
		this.context.save();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = this.bgColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.restore();
	},
	addGraphic: function(graphic) {
		this.graphics.push(graphic);
	}

});

function initGUI(spriteCanvas) {
	var mainGUI = new dat.GUI();
	var workspaceGUI = mainGUI.addFolder('Workspace');
	var cvs = spriteCanvas.canvas;
	workspaceGUI.add(cvs, 'width').max(cvs.width);
	workspaceGUI.add(cvs, 'height').max(cvs.height);
	workspaceGUI.addColor(spriteCanvas, 'bgColor');

	var toolGUI = mainGUI.addFolder('Tools');
	var tools = {
		circle: function() {

		},
		rect: function() {

		},
		polygon: function() {

		},
		custom: function() {

		}
	};
	toolGUI.add(tools, 'circle');
	toolGUI.add(tools, 'rect');
	toolGUI.add(tools, 'polygon');
	toolGUI.add(tools, 'custom');

	var fileGUI = mainGUI.addFolder('File');
	fileGUI.add(spriteCanvas, 'name');
}

function initInput(spriteCanvas) {
	var cvs = spriteCanvas.canvas;
}

function init() {

	var spriteCanvas = new SpriteCanvas();
	initGUI(spriteCanvas);
	initInput(spriteCanvas);

}

window.onload = function() {
	init();
}