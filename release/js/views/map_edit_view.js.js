(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Pica.module('Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.MapEditView = (function(_super) {

      __extends(MapEditView, _super);

      function MapEditView() {
        this.render = __bind(this.render, this);
        MapEditView.__super__.constructor.apply(this, arguments);
      }

      MapEditView.prototype.render = function() {
        return this;
      };

      return MapEditView;

    })(Backbone.View);
  });

}).call(this);