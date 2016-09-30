var utils = (function() {
	/**
	 * 创建类
	 * @param {function|class|constructor} Sup
	 * @return constructor
	 */
	function inherit(Sup){
		Sup = Sup || function() {};

		var F = function() {
			return this.initialize && this.initialize.apply(this, arguments);
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

	return {
		inherit: inherit
	};

})();
