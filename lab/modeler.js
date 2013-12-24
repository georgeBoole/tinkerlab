
var mouse = function(e) { return {x: e.offsetX, y: e.offsetY }; };
var randInt = function(n) {
	return Math.floor(Math.random() * n);
};

var randomColor = function() {
	var r = randInt(256), g = randInt(256), b = randInt(256);
	var a = Math.random() * 0.5 + 0.5;
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

var v = function(x, y) {
	return {'x':x, 'y':y};
}

var Graphic = Base.extend({
	constructor: function(name, shapes, zIndex) {
		this.name = name;
		this.shapes = shapes;
		this.zIndex = zIndex;
		var gui = new dat.GUI();
		if (this.shapes.length == 1) {
			var s = this.shapes[0];
			gui.add(s, 'x');
			gui.add(s, 'y');
			gui.add(s, 'orientation');
			gui.addColor(s, 'fill');
			gui.addColor(s, 'stroke');
		}
		gui.add(this, 'zIndex');
	},
	update: function() {
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].update();
		}
	},
	draw: function(ctx) {
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw(ctx);
		}
	},
	contains: function(x, y) {
		for (var i = 0; i < this.shapes.length; i++) {
			if (this.shapes[i].contains(x,y)) {
				return true;
			}
		}
		return false;
	}
});

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
		this.brush = 'circle'; // 'circle', 'rect', 'polygon', 'custom'
		var self = this;
		setInterval(function() { self.update(); self.draw(); }, this.interval);
	},
	update: function() {
		for (var i = 0; i < this.graphics.length; i++) {
			this.graphics[i].update(0);
		}
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
	addGraphic: function(x, y) {
		var shapes = null;
		if (this.brush == 'polygon' || this.brush == 'circle' || this.brush == 'rect') {
			var numSides = this.brush == 'polygon' ? randInt(8) + 3 : 40;
			var numSides = this.brush == 'rect' ? 4 : numSides;
			var angle = (Math.PI * 2) / numSides;
			var size = randInt(80) + 40;
			var center = v(x + size, y + size);
			vertices = [];
			for (var i = 0; i < numSides; i++) {
				vertices[i] = v((center.x - x) + size*Math.cos(angle * i + Math.PI/4), (center.y - y) + size*Math.sin(angle*i + Math.PI/4));
			}
			shapes = [new Polygon(x, y, randomColor(), randomColor(), vertices)];
		}
		else if (this.brush == 'custom') {
			console.log('not supported');
		}
		if (shapes) {
			var graphic = new Graphic(this.brush + shapes[0].id, shapes, 0);
			this.graphics.push(graphic);
		}
	},

});

var select = function(graphic) {

};

var deselect = function(graphic) {

};

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
			spriteCanvas.brush = 'circle';
		},
		rect: function() {
			spriteCanvas.brush = 'rect';
		},
		polygon: function() {
			spriteCanvas.brush = 'polygon';
		},
		custom: function() {
			spriteCanvas.brush = 'custom';
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
	var gfx = spriteCanvas.graphics;
	var sc = spriteCanvas;

	var events = ['selectstart', 'mousedown', 'mousemove', 'mouseup', 'dblclick'];
	var useCapture = [false, true, true, true, true];

	var selectstart = function(e) {
		e.preventDefault(); 
		return false;
	};

	var mousedown = function(e) {
		var m = mouse(e);
		for (var i = 0; i < gfx.length; i++) {
			if (gfx[i].contains(m.x, m.y)) {
				var selection = gfx[i];
				sc.dragoffx = m.x - selection.x;
				sc.dragoffy = m.y - selection.y;
				sc.dragging = true;
				if (sc.selection) {
					deselect(sc.selection);
				}
				sc.selection = selection;
				select(selection);
				return;
			}
		}
	};

	var mousemove = function(e) {
		if (sc.dragging) {
			var m = mouse(e);
			if (sc.selection) {
				var s = sc.selection;
				s.x = m.x - sc.dragoffx;
				s.y = m.y - sc.dragoffy;
			}
		}
	};

	var mouseup = function(e) {
		sc.dragging = false;
	};

	var dblclick = function(e) {
		var m = mouse(e);
		sc.addGraphic(m.x, m.y);
	};

	for (var i = 0; i < events.length; i++) {
		try {
			cvs.addEventListener(events[i], eval(events[i]), useCapture[i]);
		}
		catch(err) {
			console.log('No implementation of event listener for ' + events[i]);
		}
	}
}

function init() {

	var spriteCanvas = new SpriteCanvas();
	initGUI(spriteCanvas);
	initInput(spriteCanvas);

}

window.onload = function() {
	init();
}