
/*
  File: onecup.coffee
  Based on Mark Hahn's DryKup, which is based CoffeeKup.
*/

(function() {
  var Onecup, elements, escape, merge_elements,
    __slice = Array.prototype.slice,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty;

  elements = {
    regular: "a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small span strong sub summary sup table tbody td textarea tfoot th thead time title tr u ul video",
    "void": "area base br col command embed hr img input keygen link meta param source track wbr",
    obsolete: "applet acronym bgsound dir frameset noframes isindex listing nextid noembed plaintext rb strike xmp big blink center font marquee multicol nobr spacer tt",
    obsolete_void: "basefont frame"
  };

  merge_elements = function() {
    var a, args, element, result, _i, _j, _len, _len2, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    result = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      _ref = elements[a].split(/\W+/);
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        element = _ref[_j];
        if (__indexOf.call(result, element) < 0) result.push(element);
      }
    }
    return result;
  };

  escape = function(text) {
    return text.toString().replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/\"/g, "&quot;");
  };

  Onecup = (function() {

    function Onecup() {
      this.render = __bind(this.render, this);
      var tagName, _fn, _fn2, _i, _j, _len, _len2, _ref, _ref2,
        _this = this;
      this.text = function(s) {
        return _this._add(escape("" + s));
      };
      this.raw = function(s) {
        return _this._add(s);
      };
      _ref = merge_elements('regular', 'obsolete');
      _fn = function(tagName) {
        return _this[tagName] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this._tag(tagName, args);
        };
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        _fn(tagName);
      }
      _ref2 = merge_elements('void', 'obsolete_void');
      _fn2 = function(tagName) {
        return _this[tagName] = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return _this._closing_tag(tagName, args);
        };
      };
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        tagName = _ref2[_j];
        _fn2(tagName);
      }
      this.htmlOut = [];
    }

    Onecup.prototype.render = function() {
      var htmlOut;
      htmlOut = this.htmlOut.join("");
      this.htmlOut = [];
      return htmlOut;
    };

    Onecup.prototype.reset = function(html) {
      if (html == null) html = '';
      return this.htmlOut = [html];
    };

    Onecup.prototype._add = function(s) {
      if (s) return this.htmlOut.push(s);
    };

    Onecup.prototype._obj_to_css = function(obj) {
      var key, value;
      return ((function() {
        var _results;
        _results = [];
        for (key in obj) {
          if (!__hasProp.call(obj, key)) continue;
          value = obj[key];
          _results.push("" + key + ": " + value);
        }
        return _results;
      })()).join(';');
    };

    Onecup.prototype._attrstr = function(obj) {
      var attrstr, name, val, val_str;
      attrstr = [];
      for (name in obj) {
        val = obj[name];
        if (name === 'style' && typeof val === 'object') {
          val_str = this._obj_to_css(val);
        } else if (name === 'selected' || name === 'disabled') {
          if (val) {
            val_str = name;
          } else {
            continue;
          }
        } else {
          val_str = "" + val;
        }
        attrstr.push(" " + name + "=\"" + (val_str.replace('"', '\\"')) + "\" ");
      }
      return attrstr.join("");
    };

    Onecup.prototype._idclass = function(args) {
      var classes, i, id, inter_symbol, _i, _len, _ref;
      inter_symbol = [];
      if (typeof args[0] === 'string' && args[0].length > 1) {
        classes = [];
        if ("#" !== args[0][0] && "." !== args[0][0]) return "";
        _ref = args.shift().split('.');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          if (i.length === 0) continue;
          if ("#" === i[0]) {
            id = i.slice(1);
          } else {
            classes.push(i);
          }
        }
        if (id) inter_symbol.push(" id=\"" + id + "\" ");
        if (classes.length > 0) {
          inter_symbol.push(" class=\"" + (classes.join(' ')) + "\" ");
        }
      }
      return inter_symbol.join("");
    };

    Onecup.prototype._tag = function(tagName, args) {
      var arg, attrstr, func, innertext, inter_symbol, _i, _len;
      attrstr = [];
      innertext = [];
      func = null;
      inter_symbol = this._idclass(args);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        switch (typeof arg) {
          case 'string':
            if ("#" !== arg[0] && "." !== arg[0] && "" !== arg) {
              innertext.push(escape(arg));
            }
            break;
          case 'number':
            this._add("" + arg);
            break;
          case 'function':
            func = arg;
            break;
          case 'object':
            attrstr.push(this._attrstr(arg));
            break;
          default:
            throw 'Onecup: invalid argument for tag ' + tagName + ': ' + arg;
        }
      }
      this.htmlOut.push("<" + tagName + " " + inter_symbol + " " + (attrstr.join("")) + ">");
      this._add(innertext.join(""));
      if (func && tagName !== 'textarea') if (typeof func === "function") func();
      return this.htmlOut.push("</" + tagName + ">");
    };

    Onecup.prototype._closing_tag = function(tagName, args) {
      var arg, attrstr, inter_symbol, _i, _len;
      attrstr = [];
      inter_symbol = this._idclass(args);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (typeof arg === 'object') {
          attrstr.push(this._attrstr(arg));
        } else {
          throw 'Onecup: invalid argument, tag ' + tagName + ', ' + arg;
        }
      }
      return this._add("<" + tagName + " " + inter_symbol + " " + (attrstr.join("")) + "/>");
    };

    return Onecup;

  })();

  window.onecup = new Onecup();

}).call(this);
