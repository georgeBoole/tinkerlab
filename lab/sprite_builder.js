
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

	return sprite_builder;
}

var shape_gui_map = {};

function select(shape) {
	// initialize a gui for it
	var shape_gui = new dat.GUI();
	for (var key in shape) {
		if (shape.hasOwnProperty(key)) {
			if (key == "color") {
				continue; // wait until end for color
			}
			shape_gui.add(shape, key);
		}
	}
	shape_gui.addColor(shape, 'color');
	shape_gui_map[shape] = shape_gui;
}

function deselect(shape) {
	if (shape in shape_gui_map) {
		shape_gui = shape_gui_map[shape];
		if (shape_gui) {
			shape_gui.destroy();
			delete(shape_gui_map[shape]);
		}
	}
}

function init_input(sprite_builder_gui) {
	var myState = window.canvasState;
	var canvas = myState.canvas;
	canvas.addEventListener('selectstart', function(e) {e.preventDefault(); return false;}, false);
	canvas.addEventListener('mousedown', function(e) {
		var mouse = { x: e.offsetX, y: e.offsetY };
		var mx = mouse.x;
		var my = mouse.y;
		var shapes = myState.shapes;
		for(var i = 0; i < shapes.length; i++) {
			if(shapes[i].contains(mx,my)) {
				var mySel = shapes[i];
				//Make sure we're grabbing it at the right spot
				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				select(mySel);
				return;
			}
		}
		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		if (myState.selection) {
			deselect(myState.selection);
			myState.selection = null;
		}
	}, true);

	var cvs = myState.canvas;
    cvs.addEventListener('dblclick', function(e) {
      var mouse = {x:e['offsetX'], y:e['offsetY']};
      var col = function() { return String(Math.floor(Math.random() * 255)); };
      var color = 'rgba(' + col() + ',' + col() + ',' + col() + ', ' + String(.70 + .30 * Math.random()) + ')';
      console.log(color);
      var shape = undefined;
      if (gui_state['brush'] == 'rectangle') {
      	shape = new Rect(mouse.x - 40, mouse.y - 40, 80, 80, color);
      }
      else if (gui_state['brush'] == 'triangle') {
        shape = new Triangle(mouse.x - 40, mouse.y, mouse.x + 40, mouse.y, mouse.x, mouse.y + 55, color);
      }
      else if (gui_state['brush'] == 'circle') {
      	shape = new Circle(mouse.x, mouse.y, 30, color);
      }
      if (shape != undefined) {
      	myState.addShape(shape);
      }
    }, true);
    var state_map = {91:'triangle', 93:'rectangle', 92:'circle'};
    window.addEventListener('keypress', function(e) {
    	keycode = e.which;
    	if (keycode in state_map) {
    		gui_state['brush'] = state_map[keycode];
    		for (var i in sprite_builder_gui.__controllers) {
    			sprite_builder_gui.__controllers[i].updateDisplay();
    		}
    		console.log('Changed brush to ' + state_map[keycode]);
    	}
    });
}

window.onload = function() {
	sprite_builder_gui = init_gui();
	init_input(sprite_builder_gui);
};
