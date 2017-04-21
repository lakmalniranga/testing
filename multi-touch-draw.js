lastOnDrawedPolyline = []

function MultiTouchDraw(canvas) {
	this.canvas = canvas;
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;

	this.context = canvas.getContext("2d");
	this.context.lineCap = "round";
	this.context.lineWidth = 20;

	console.log(this.context);

	this.ballpoints = {};
	this.counter = 0;

	canvas.addEventListener("mousedown", (function (e) {
		this.onDrawStart(e);
		console.log('mousedown');
		canvas.onmousemove = this.onDraw.bind(this);
	}).bind(this));

	canvas.addEventListener("mouseup", (function (e) {
		this.onDrawEnd(e);
		console.log('mouseup');
		canvas.onmousemove = null;
	}).bind(this));

	canvas.addEventListener("touchstart", (function (e) {
		console.log('touchstart');
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDrawStart(e.changedTouches[i]);
		}
	}).bind(this));

	canvas.addEventListener("touchmove", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDraw(e.changedTouches[i]);
		}
	}).bind(this));

	canvas.addEventListener("touchend", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDrawEnd(e.changedTouches[i]);
		}
	}).bind(this));
}

MultiTouchDraw.randomPastel = function () {
	var r = Math.floor(Math.random() * 4 + 1) * 64,
		g = Math.floor(Math.random() * 4 + 1) * 64,
		b = Math.floor(Math.random() * 4 + 1) * 64;
	return "rgb(" + r + ", " + g + ", " + b + ")";
};

MultiTouchDraw.prototype = {
	onDrawStart: function (e) {
		var ballpoint = {
			x: e.pageX - this.canvas.offsetLeft,
			y: e.pageY - this.canvas.offsetTop,
			color: MultiTouchDraw.randomPastel()
		};
		this.ballpoints[e.identifier || ++this.counter] = ballpoint;
		this.drawLine(ballpoint.x - 1, ballpoint.y, ballpoint.x, ballpoint.y, ballpoint.color);
	},

	onDraw: function (e) {
		var ballpoint = this.ballpoints[e.identifier || this.counter],
			x = e.pageX - this.canvas.offsetLeft,
			y = e.pageY - this.canvas.offsetTop;

		this.drawLine(ballpoint.x, ballpoint.y, x, y, ballpoint.color);

		lastOnDrawedPolyline.push([e.clientX, e.clientY])
		ballpoint.x = x;
		ballpoint.y = y;
		// console.log(ballpoint)
	},

	onDrawEnd: function (e) {
		console.log(lastOnDrawedPolyline)
		console.log(this.ballpoints)
		delete this.ballpoints[e.identifier || this.counter];
	},

	drawLine: function (x0, y0, x1, y1, color) {
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x0, y0);
		this.context.lineTo(x1, y1);
		this.context.stroke();
	}
};
