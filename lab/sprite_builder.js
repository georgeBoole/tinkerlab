
var config = {
	bgcolor: '#000000',
	width: 1000,
	height: 800
}

var sprite_build = {
	name: 'sprite',
	width: config.width,
	height: config.height,
	objects: []
}

var gui_state = {
	brush: "rectangle" // Circle, Triangle

}

init();

function init() {
    var s = new CanvasState(document.getElementById('canvas'));
    window.canvasState = s;
    window.shapes = s.shapes;

    var cvs = s.canvas;
    cvs.addEventListener('dblclick', function(e) {
      var mouse = {x:e['offsetX'], y:e['offsetY']};
      console.log('got mouse:');
      console.log(mouse);
      console.log('event');
      console.log(e);
      var color = 'rgba(32, 32, 128, 0.6)';
      var shape = undefined;
      if (gui_state['brush'] == 'rectangle') {
      	shape = new Rect(mouse.x - 10, mouse.y - 10, 20, 20, color);
      }
      else if (gui_state['brush'] == 'triangle') {
        shape = new Triangle(mouse.x - 10, mouse.y, mouse.x + 10, mouse.y, mouse.x, mouse.y + 25);
        shape.fill = color;
      }
      else if (gui_state['brush'] == 'circle') {
      	shape = new Circle(mouse.x, mouse.y, 20, color);
      }
      if (shape != undefined) {
      	console.log('Creating new ' + gui_state['brush'] + ' shape');
      	s.addShape(shape);
      }
    }, true);
    
    
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
	sprite_builder.add(sprite_build, 'name');
	sprite_builder.add(gui_state, 'brush', {'Triangle':'triangle', 'Rectangle':'rectangle', 'Circle':'circle'}).name('Brush');

}

window.onload = function() {
	init_gui();
};

