/*
Object.prototype.lengs = function() {
	return Object.keys(this).length;
};

var a = /[1, 2]/;

console.log( a.lengs(), a.length);
*/

/*
var a = function(){
	this.a = 1;
};

a.prototype.b = 2;

var b = new a;

console.log(b.lengs());
*/

/*
Object.defineProperty(Object.prototype, 'lengs', {
	value : function() {
		return Object.keys(this).length;
	},
	enumerable: false,
	configurable: false
});
*/

/*
var a = function() {
};

a.prototype = {
};

var m = new a;
*/

//console.log(Object.prototype.isPrototypeOf(m));

//console.log(m.lengs());

/*

Object.prototype.lengs = function(num) {
	return Object.keys(this).length + num;
};

Object.lengs = function(num) {
	return this.keys(this).length + num;
};
*/



/*
var m = {a: 1, b: 3, d: 4};

var len = m.lengs(9);

console.log(len);

for(var i in m){
	console.log(i, m[i]);
}
*/

/*
Array.defineProperty(Array.prototype, 'fuck', {
	get: function(num) {
		return this.slice(0, num);
	},
	enumerable: false
});

var a = [1,2, 3,4,5,6,8];

for(var i in a ){
	console.log(i, a[i]);
}
console.log(a.fuck);
*/


/*
var fn = function() {
	var x = 1;

	return function() {
		this.a = function() {
			return ++x;
		};
	};
};

var f1 = fn();

console.log( (new f1).a() );
*/


/*
	var x = 2;

	var obj = {
		x: 3,
		a1: function (){
			console.log(this.x);
			this.x ++;
			console.log(this.x++);
		}
	};

	obj.a1();

	var m = obj.a1

	m();
*/

/*
var a = function(){};
var b = new a;


console.log(b.__proto__ === a.prototype);
console.log(a.prototype.__proto__ === Object.prototype);
console.log(Object.prototype.__proto__ === null);


var c = function(){};
c.prototype = new a;

var d = new c;

console.log(d.__proto__ === c.prototype);
console.log(c.prototype.__proto__ === a.prototype);
console.log(a.prototype.__proto__ === Object.prototype); // ...
*/

/*
var f1 = function(){};
var f2 = function(){};

f2.prototype = new f1;

var obj = new f2();


	console.log(obj.__proto__ === f2.prototype);
	console.log(f2.prototype.__proto__ === f1.prototype);
	console.log(f1.prototype.__proto__ === Object.prototype);
	console.log(Object.prototype.__proto__ === null);
*/

/*
var a = function() {};
var b = function() {};

a.price = 100;

b.prototype = a;

var d = new b();

console.dir(b.prototype);

console.log( d.__proto__ === b.prototype );
console.log( b.prototype.__proto__ === a.__proto__ );
console.log( a.__proto__ === Function.prototype);
console.log( Function.prototype.__proto__ === Object.prototype );
console.log( Object.prototype.__proto__ === null);
*/

/*
var a = '../var/../www/html/../../webpack/../src/../etc/nginx/site-available/yunniao/../..';

while(a.indexOf('.') !== -1){
	a = a.replace(/\.\.\/[^\/\.]+\/?/g, '');
}

console.log(a);
*/

/*
var c = [];

a.split('/').forEach(function(item) {
	item === '..' ? c.pop() : c.push(item);
});

console.log( c.join('/') );
*/

/*
var a = function() {
	var arr = [1, 2, 3];


	arr.arr = function() {
		return arr.join('|');
	};

	return 1;
};

a.prototype = {
	arr: function() {

		return this.arr.join('|');

		return this;
	}
};



var b = new a();
var c = a();

console.log(b instanceof a);


console.log(c instanceof Number);
*/

/*
var a = function() {
	Array.apply(this);

	this.arr = Array.prototype.slice.call(arguments, 0);

	return this;
};

a.prototype = Array.prototype;

a.constructor = a;


a.prototype.xxx= function() {
	console.log(this.arr.toString());
};


var b = new a(1,2,3);

b.xxx();
*/

// 工厂模式

/*
var bike = function() {};

bike.prototype = {
	constructor: bike,

	f1: function() {
		this.f2();
	},

	f2: function() {
		console.log('bike');
	},

	extend: function(Sub) {
		var F = function() {};

		F.prototype = this;
		Sub.prototype = new F();
		Sub.prototype.constructor = Sub;
	}
};

var factory = function(o, Sup) {
	var F = function() {};

	F.prototype = new Sup;
};
*/

/*

var Sub = function() {
};

new bike().extend(Sub);

Sub.prototype.f2 = function() {
	console.log('b1');
};



var b1 = new Sub();
*/



/*
var factory = function(o) {

	var a = new bike();

	Object.assign(a, o);

	return a;
};




var b1 = factory({
	f2: function() {
		console.log('b1');
	}
});
*/

//b1.f1();

var f = function(arr) {

	this.arr = arr;

};

f.prototype = {
	toString: function() {
		console.log('toString');
		return this.arr.toString();
	}
};

var m = new f([1,2,3,4]);

var str = m.toString();


console.log(str);
