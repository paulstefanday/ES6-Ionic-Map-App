(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fs":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (app) {

  app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.StatusBar) StatusBar.styleDefault();
    });
  });
};

module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

var _app$config$service, _app$config;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var app = angular.module('map', ['ionic', 'ngCordova']);
require('./config')(app);

(_app$config$service = (_app$config = app.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/find");

	$stateProvider.state('find', {
		url: "/find",
		controller: require('./js/components/find.js'),
		template: require('./js/components/find.jade')
	}).state('map', {
		url: "/map",
		controller: require('./js/components/map.js'),
		template: require('./js/components/map.jade')
	}).state('report', {
		url: "/report",
		controller: require('./js/components/report.js'),
		template: require('./js/components/report.jade')
	});
})).service.apply(_app$config, _toConsumableArray(require('./js/services/map')))).directive.apply(_app$config$service, _toConsumableArray(require('./js/directives/map')));

},{"./config":3,"./js/components/find.jade":5,"./js/components/find.js":6,"./js/components/map.jade":7,"./js/components/map.js":8,"./js/components/report.jade":9,"./js/components/report.js":10,"./js/directives/map":11,"./js/services/map":12}],5:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<ion-view animation=\"slide-left-right\"><ion-header-bar class=\"bar-stable\"><h1 class=\"title\">Find Incidents</h1></ion-header-bar><ion-content padding=\"true\"><button ng-click=\"setCurrent()\" class=\"button button-block button-positive\">Use Current Location</button><p style=\"text-align:center;\">OR</p><div class=\"list\"><label class=\"item item-input\"><input type=\"text\" ng-model=\"loc\" placeholder=\"Location\"/></label></div><button ng-click=\"setCustom(loc)\" class=\"button button-block\">Find</button></ion-content></ion-view>");;return buf.join("");
};
},{"jade/runtime":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function ($scope, mapService, $state) {

  $scope.setCurrent = function () {
    mapService.getGeo().then(function (res) {
      return $state.go('map');
    });
  };

  $scope.setCustom = function (loc) {
    mapService.setCustom(loc);
  };
};

module.exports = exports['default'];

},{}],7:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<ion-view animation=\"slide-left-right\"><ion-header-bar class=\"bar-stable\"><h1 class=\"title\">Incidents Map</h1></ion-header-bar><ion-content scroll=\"false\"><map></map></ion-content></ion-view>");;return buf.join("");
};
},{"jade/runtime":2}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function ($scope, $ionicLoading) {};

module.exports = exports["default"];

},{}],9:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<ion-view animation=\"slide-left-right\"><ion-header-bar class=\"bar-stable\"><h1 class=\"title\">Report Incidents</h1></ion-header-bar><ion-content padding=\"true\"><button ui-sref=\"find\" class=\"button button-block button-positive\">Connect with facebook</button><p style=\"text-align:center;\">OR</p><div class=\"list\"><label class=\"item item-input\"><input type=\"text\" placeholder=\"Email\"/></label></div><button ui-sref=\"find\" class=\"button button-block\">Join with Email</button></ion-content></ion-view>");;return buf.join("");
};
},{"jade/runtime":2}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function ($scope, $ionicLoading) {};

module.exports = exports["default"];

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ['map', function () {

  return {
    restrict: 'E',
    scope: {},
    controller: function controller($scope, mapService) {
      $scope.getGeo = mapService.getGeo;
    },
    link: function link($scope, $element, $attr) {
      var load = function load() {
        $scope.getGeo().then(function (res) {
          return initialize(res, $element);
        });
      };
      if (document.readyState === "complete") load();else google.maps.event.addDomListener(window, 'load', load());
    }
  };

  function initialize(res, el) {

    console.log('init called', res);

    var mapOptions = {
      center: new google.maps.LatLng(res.latitude, res.longitude), zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(el[0], mapOptions);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(el[0], 'mousedown', function (e) {
      e.preventDefault();return false;
    });
  }
}];
module.exports = exports['default'];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = ['mapService', function ($q, $state, $ionicLoading, $cordovaGeolocation) {
    var _this = this;

    this.pos = false;
    this.loading = function () {
        return $ionicLoading.show({ content: 'Getting current location...', showBackdrop: true });
    };
    this.loaded = function () {
        return $ionicLoading.hide();
    };
    ;

    this.getGeo = function () {
        var q = $q.defer();

        if (_this.pos) q.resolve(_this.pos);else _this.setCurrent().then(function (res) {
            return q.resolve(res);
        });

        return q.promise;
    };

    this.setCurrent = function () {
        var q = $q.defer();

        _this.loading();

        // navigator.geolocation.getCurrentPosition(pos => {
        //     this.pos = pos.coords;
        //     this.loaded();
        //     q.resolve(this.pos);
        // }, error => {
        //     this.loaded();
        //     alert('Unable to get location: ' + error.message);
        //     q.reject(error);
        // });

        $cordovaGeolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false }).then(function (position) {
            _this.pos = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            _this.loaded();
            q.resolve(_this.pos);
        }, function (err) {
            _this.loaded();
            alert('Unable to get location: ' + err.message);
            q.reject(err);
        });

        return q.promise;
    };

    this.setCustom = function (loc) {

        _this.loading();

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': loc, 'partialmatch': true }, function (results, status) {
            _this.loaded();
            if (status == 'OK' && results.length > 0) {
                _this.pos = { latitude: results[0].geometry.location.G, longitude: results[0].geometry.location.K };
                $state.go('map');
            } else alert("Geocode was not successful for the following reason: " + status);
        });
    };
}];
module.exports = exports['default'];

},{}]},{},[4])


//# sourceMappingURL=index.js.map