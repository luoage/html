(function() {

	/**
	 * 创建类
	 *
	 * @param {function} Sup
	 * @return function
	 */
	var inherit = function(Sup){
		Sup = Sup || function() {};

		var F = function() {
			this.initialize && this.initialize.apply(this, arguments);
		};

		F.prototype = new Sup;
		F.prototype.constructor = F;
		F.prototype.$parent = Sup;

		F.$extend = function(proto) {
			Object.assign(F.prototype, proto);

			return F;
		};

		F.$exec = function(...args) {
			return new F(...args);
		};

		return F;
	};

	/**
	 * 加速机
	 *
	 * @constructor
	 * @param {Number} pointer 初始位移
	 * @param {Number} v0 初始速度
	 * @param {Number} a 加速度(px/s^2)
	 * @param {Number} max 最大值
	 * @param {Number} min 最小值
	 */
	var Accelerator = inherit().$extend({
		initialize(v0, a, pointer, max, min) {

			if (pointer > max || pointer < min) {
				throw new Error('pointer param is wrong in Accelerator class');
			}

			this.min = 0;
			this.v0 = v0;
			this.pointer = pointer;
			this.a = a;
			this.max = max;
			this.min = min;

			this._unitTime = 0.005; // 单位时间(s)
			this._direction = true;
			this._value = 0;

			this._ctime = 0;
		},
		getValue() {
			var value = Math.max(Math.min(this._value, this.max), this.min);

			if (value === this.max || value === this.min) {
				this._direction = !this._direction;
			}

			return this._value = value;
		},

		stop() {
			return this.interval && clearInterval(this.interval);
		},

		speedUp() {
			this.interval = setInterval(() => {

				this._direction ? this._ctime++ : this._ctime--;

				this._value = this._displacement();
			}, this._unitTime * 1000);
		},

		getVt() {
			return this.v0 + this.a * this._ctime;
		},

		_displacement(t) {
			var t = this._ctime;

			return this.v0 * t + this.a * Math.pow(t, 2)/2;
		}
	});

	/**
	 * 给元素增加重力
	 *
	 * @constructor
	 * @parent Accerator
	 * @return
	 */
	var Gravity = inherit(Accelerator).$extend({
		initialize(v0, a, pointer, max, min) {
			new this.$parent().initialize.call(this, v0, a, pointer, max, min||0);

			this.mass = 1;
			this.energyPercent = 0.2; // 每次撞击默认减少20%的能量
		},

		// E = M * vt ^2/2 能量
		// W = FS
		// S = v0t + at^2/2
		getEnergy() {
			return this.mass * Math.pow(this.getVt(), 2)/2;
		},

		/**
		 * 撞击后能量减少，影响初始速度
		 *
		 * @param {number} energyPercent 减少百分比
		 */
		impact(energyPercent) {

		}

	});


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


	var actY = new Gravity(0, 0.2, 0, h);
	var actX = new Gravity(2, 0, 0, w);


	actX.speedUp();
	actY.speedUp();

	var dot = new Dot;
	var interval = setInterval(function() {

		var y = actY.getValue();
		var x = actX.getValue();

		target.css({top: y, left: x});
		new Dot().append(x+25, y+25).remove();

		//console.log(actY.getEnergy());

	}, 10);

	// clearInterval(interval);

})();