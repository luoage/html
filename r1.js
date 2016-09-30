(function() {

	// 这种方法虽然也能实现，但是精确度较低
	var Accelerator = utils.inherit().$extend({

		initialize(opts) {

			this.max = opts.max;
			this.a = opts.a;
			this.v0 = opts.v0;

			this._unitTime = 0.005;
			this._aTime = 0;
			this._cTime = 0;

			this._direction = true; // true向下, false向上
			this._loses = 0;
			this._remains = this.max;
		},

		god() {
			this.interval = setInterval(() => {
				this._aTime += 1;
				this._cTime += 1;
			}, this._unitTime * 1000);
		},

		die() {
			this.interval && clearInterval(this.interval);
		},

		endVt(v0, a) {
			return v0 + a * this._cTime;
		},

		shifting(v0, a) {
			return v0 * this._cTime + a * Math.pow(this._cTime, 2) / 2;
		},

		reset() {
		},


		down() {
			var s = this.shifting(this.v0, this.a) + this._loses;

			console.log(s, 'down');
			if(s >= this.max){
				s = this.max;
				this._direction = false;
				this.vt = Math.log2(this.a * (this.max - this._loses)* 2);
				//this.vt = this.v0 + this.a * this._cTime;
				this._cTime = 0;
			}

			return s;
		},

		up() {
			var vt = this.vt;

			var s = this.shifting(vt, this.a * -1);

			var endVt = this.endVt(vt, this.a * -1);
			console.log(endVt, 'endVt');


			console.log(s, 'up');

			if (endVt <= 0) {
				this._loses = this.max - s;
				this._direction = true;
				this._cTime = 0;
			}

			s = this.max - s;

			return s;
		},

		toggle() {
			return this._direction ? this.down() : this.up();
		}

	});

	/*
	var ball = $('#ball');
	var wrap = $('#wrap');

	var h = wrap.outerHeight() - ball.outerHeight();
	var w = wrap.outerWidth() - ball.outerWidth();

	var actY = new Accelerator({max:h, a: 0.01, v0: 0});
	var actX = new Accelerator({max:w, a: 0, v0: 1.5});

	actY.god();
	actX.god();


	var interval = setInterval(function() {

		var y = actY.toggle();
		//var x = actX.toggle();

		ball.css({top: y});

	}, 10);

	clearInterval(interval);
	*/

})();
