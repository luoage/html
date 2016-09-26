(function() {

	//
	// E = m * v^2/2
	// 能量(J) = 质量(kg) * 速度(米)的平方
	//
	// W = FS
	// 力(N) * 米(m) = 焦耳(J)
	//
	// W = Mgh
	// 质量(m) * 重力(g) * 高度(h) = 势能(J)
	//
	// S = v0t + at^2/2
	// 位移 = 初始速度 * 时间 + 加速度 * 时间平方 / 2
	// m = m/s * s + m/s^2 * s^2 /2
	//
	// 单位时间 = 0.005s, 高度 = 450px， 加速度 a = 0.2px/s^2, 质量 m = 1kg
	//
	// 单位时间内速度的变化量是加速度
	//
	//
	//

	/**
	 * 创建类
	 * @param {function|class|constructor} Sup
	 * @return constructor
	 */
	function inherit(Sup){
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
	 * 动能
	 * W = FS, F = mg = 1kg * 0.2
	 *
	 * @param {object} opts
	 * @example {max: 最大边界, v0: 初始速度, acceleration: 加速度}
	 *
	 */
	var Work = inherit().$extend({
		initialize(opts) {
			this.initMax = opts.max; // 最大边界
			this.acceleration = opts.acceleration; // 加速度/重力 (m/s^2)
			this.initV0 = opts.v0; //初始速度

			this.weight = 1; // 重量(kg)
			this.impactLoss = 0.02; // 每次撞击能量减少百分比

			this._unitTime = 0.005; // 单位时间(s)
			this._ctime = 0; // 时间
			this._atime = 0;
			this._impactTime = 0; // 是否撞击
		},

		/**
		 * 获取当前的物体能量
		 * E = mv^2/2
		 *
		 * @param {Number} v 速度
		 * @return number 单位焦耳(J)
		 */
		vEnergy(v) {
			return this.weight * Math.pow(v, 2) / 2;
		},

		/**
		 * 能量 = 动能 + 势能
		 * W = mgh
		 *
		 * @param {Number} s 高度或者长度
		 * @return number 单位焦耳(J)
		 */
		energy(v0, s) {
			return this.weight * this.acceleration * s + this.vEnergy(v0);
		},

		/**
		 * 物体下落一段距离后速度
		 *
		 * @param {number} v0 初始速度
		 * @param {number} s 位移
		 * @return
		 */
		realVelocity(v0, s) {
			return Math.log2(this.energy(v0, s) * 2 / this.weight);
		},

		/**
		 * 上帝
		 *
		 * @return void
		 */
		god() {
			this._interval = setInterval(() => {

				this._ctime ++;
				this._atime ++;

			}, this._unitTime * 1000);
		},

		/**
		 * 上帝已死
		 *
		 * @return void
		 */
		die() {
			this._interval && clearInterval(this._interval);
		},

		/**
		 * 位移
		 *
		 * @return {number}
		 */
		shift() {
			var v0 = this._impactTime ? this.vt : this.initV0;
			var max = this.max === undefined ? this.initMax : this.max;


			var s = v0 * this._ctime + this.acceleration * Math.pow(this._ctime, 2)/2;

			s = Math.min(max, s);

			if(s === max) {
				this.impact(v0);
			}

			return s;
		},

		// 向下为正向, 否则为反向
		direction() {
			return this._impactTime % 2 ? 1 : -1;
		}

		/**
		 * 撞击
		 *
		 * @param s 位移
		 * @return {number} 初始速度
		 */
		impact(v0) {
			debugger;

			var max = this.max || this.initMax;
			var energy = this.energy(v0, max) * (1 - this.impactLoss);

			console.log(energy, this.weight);

			this.vt = Math.log2(energy * 2 /this.weight);
			this.max = energy / (this.weight * this.acceleration);

			this._impactTime ++;
			this._ctime = 0;
		}


	});

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

	var workY = new Work({max: h, v0: 0, acceleration: 0.05});

	workY.god();

	var interval = setInterval(function() {

		var y = workY.shift();
		console.log(y);

		target.css({top: y});

	}, 10);

	clearInterval(interval);


	/*
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

	}, 10);

	// clearInterval(interval);
	*/

})();
