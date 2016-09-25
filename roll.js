(function() {
/*
	Object.defineProperty(Function.prototype, 'extend', {
		value: function(){

		}
	});
*/
	/**
	 * 加速机
	 *
	 * @constructor
	 * @param {Number} pointer 初始位移
	 * @param {Number} max 最大值
	 * @param {Number} a 加速度(px/s^2)
	 * @param {boolean} gravity 是否有重力
	 */
	var Accelerator = function(pointer, max, v0, a) {
		this.pointer = pointer;
		this.max = max;
		this.min = 0;
		this.v0 = v0;
		this.a = a;

		this._unitTime = 0.005; // 单位时间(s)
		this._direction = true;
		this._value = 0;
	};

	Accelerator.prototype = {
		getValue() {
			var value = Math.max(Math.min(this._value, this.max), 0);

			if (value === this.max || value === 0) {
				this._direction = !this._direction;
			}

			return this._value = value;
		},

		stop() {
			return this.interval && clearInterval(this.interval);
		},

		speedUp() {
			var i = this.pointer;

			this.interval = setInterval(() => {

				if(this._direction){
					i += 1;
				} else {
					i -= 1;
				}

				this._value = this.gravity(i);
			}, this._unitTime * 1000);
		},

		gravity(x) {
			return this.v0 * x + this.a * Math.pow(x, 2)/2;
		}

	};



	/**
	 * 打点, 测试使用
	 */
	var Dot = function() {
		this.div = document.createElement('div');
		this.body = document.getElementById('wrap');

		this.div.className = 'dot';
	};

	Dot.prototype = {
		append(x, y) {
			//console.log(x, y);
			$(this.div).css({top: y, left: x})

			this.body.appendChild(this.div);

			return this;
		},

		remove(t) {
			setTimeout(() => {
				this.body.removeChild(this.div);
			}, t || 2000 );

			return this;
		}
	};

	var x = 0;
	var target = $('#ball');
	var wrap = $('#wrap');
	var h = wrap.outerHeight() - target.outerHeight();
	var w = wrap.outerWidth() - target.outerWidth();


	var actY = new Accelerator(0, h, 0, 0.2);
	var actX = new Accelerator(0, w, 2, 0);

	actX.speedUp();
	actY.speedUp();

	var dot = new Dot;
	var interval = setInterval(function() {

		var y = actY.getValue();
		var x = actX.getValue();

		target.css({top: y, left: x});
		new Dot().append(x+25, y+25).remove();

	}, 10);

	// clearInterval(interval);

})();