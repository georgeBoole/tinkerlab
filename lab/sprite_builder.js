
var config = {
	bgcolor: '#000000',
	width: 1000,
	height: 800
}

function SpriteBuild() {
	this.name = "Sprite.json";
	this.layers = [];
}

init();

function init() {
    var s = new CanvasState(document.getElementById('canvas'));
    window.canvasState = s;

    var cvs = s.canvas;
    
}

function init_gui() {
	// display the general app config panel
	var app_config = new dat.GUI();

	var canvas_config = app_config.addFolder('Canvas');
	var cs = window.canvasState;
	canvas_config.add(config, 'width').name('Width').onFinishChange(function(new_value) {
		cs.canvas.width = new_value;
	});
	canvas_config.add(config, 'height').name('Height').onFinishChange(function(new_value) {
		cs.canvas.height = new_value;
	});
	canvas_config.addColor(config, 'bgcolor').name('BG Color').onChange(function(new_color) {
		window.canvasState.bgcolor = new_color;
	});
	canvas_config.open();

	// display the sprite creation management panel
	var sprite_builder = new dat.GUI();
	var sprite = new SpriteBuild();
	sprite_builder.add(sprite, 'name');


}

window.onload = function() {
	init_gui();
};

