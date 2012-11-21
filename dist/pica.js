/*! pica - v0.1.0 - 2012-11-21
* https://github.com/unepwcmc/pica.js
* Copyright (c) 2012 UNEP-WCMC; */


window.Pica = {};

Pica.Models = {};

Pica.Views = {};

Pica.Application = (function() {

  function Application(config) {
    this.config = config;
    Pica.config = this.config;
    $.support.cors = true;
    $.ajaxSetup({
      headers: {
        'X-Magpie-AppId': Pica.config.appId
      }
    });
  }

  Application.prototype.newWorkspace = function() {
    return this.currentWorkspace = new Pica.Models.Workspace();
  };

  return Application;

})();


Pica.Events = (function() {

  function Events() {}

  Events.prototype.on = function(event, callback) {
    var _base;
    this.events || (this.events = {});
    (_base = this.events)[event] || (_base[event] = []);
    return this.events[event].push(callback);
  };

  Events.prototype.off = function(event, callback) {
    var eventCallback, index, _i, _len, _ref, _results;
    if (this.events == null) {
      return;
    }
    if (event != null) {
      if (this.events[event] != null) {
        if (callback != null) {
          _ref = this.events[event];
          _results = [];
          for (eventCallback = _i = 0, _len = _ref.length; _i < _len; eventCallback = ++_i) {
            index = _ref[eventCallback];
            if (eventCallback === callback) {
              _results.push(delete this.events[event][index]);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else {
          return delete this.events[event];
        }
      }
    } else {
      return this.events = [];
    }
  };

  Events.prototype.trigger = function(event, args) {
    var callback, _results;
    if ((this.events != null) && (this.events[event] != null)) {
      _results = [];
      while (callback = this.events[event].shift()) {
        _results.push(callback.apply(this, [].concat(args)));
      }
      return _results;
    }
  };

  return Events;

})();

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Model = (function(_super) {

  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  Model.prototype.url = function() {};

  Model.prototype.get = function(attribute) {
    return this.attributes[attribute];
  };

  Model.prototype.set = function(attribute, value) {
    return this.attributes[attribute] = value;
  };

  Model.prototype.sync = function(options) {
    var callback,
      _this = this;
    if (options == null) {
      options = {};
    }
    callback = options.success || function() {};
    options.success = function(data, textStatus, jqXHR) {
      var attr, val;
      if (data.id != null) {
        for (attr in data) {
          val = data[attr];
          _this.set(attr, val);
        }
        return callback(_this, textStatus, jqXHR);
      }
    };
    return $.ajax($.extend(options, {
      dataType: 'json',
      data: this.attributes
    }));
  };

  Model.prototype.save = function(options) {
    if (options == null) {
      options = {};
    }
    options.url = this.url().create != null ? this.url().create : this.url();
    options.type = 'post';
    return this.sync(options);
  };

  Model.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    options.url = this.url().read != null ? this.url().read : this.url();
    return this.sync(options);
  };

  return Model;

})(Pica.Events);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Models.Workspace = (function(_super) {

  __extends(Workspace, _super);

  function Workspace() {
    this.save = __bind(this.save, this);
    this.attributes = {};
    this.areas = [];
    this.currentArea = new Pica.Models.Area();
    this.addArea(this.currentArea);
  }

  Workspace.prototype.url = function() {
    return "" + Pica.config.magpieUrl + "/workspaces";
  };

  Workspace.prototype.addArea = function(area) {
    area.on('requestWorkspaceId', this.save);
    return this.areas.push(area);
  };

  Workspace.prototype.save = function(options) {
    return Workspace.__super__.save.call(this, options);
  };

  return Workspace;

})(Pica.Model);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Models.Area = (function(_super) {

  __extends(Area, _super);

  function Area(options) {
    this.save = __bind(this.save, this);
    this.attributes = {};
    this.polygons = [];
    this.set('name', 'My Lovely Area');
  }

  Area.prototype.setName = function(name) {
    return this.set('name', name);
  };

  Area.prototype.addPolygon = function(polygon) {
    polygon.on('requestAreaId', this.save);
    return this.polygons.push(polygon);
  };

  Area.prototype.drawNewPolygonView = function(finishedCallback) {
    this.currentPolygon = new Pica.Models.Polygon();
    this.addPolygon(this.currentPolygon);
    return new Pica.Views.NewPolygonView({
      finishedCallback: finishedCallback,
      polygon: this.currentPolygon
    });
  };

  Area.prototype.stats = function() {};

  Area.prototype.fetchStats = function(callback) {
    return this.fetch({
      success: callback
    });
  };

  Area.prototype.url = function() {
    return {
      create: "" + Pica.config.magpieUrl + "/workspaces/" + (this.get('workspace_id')) + "/areas_of_interest/",
      read: "" + Pica.config.magpieUrl + "/areas_of_interest/" + (this.get('id'))
    };
  };

  Area.prototype.save = function(options) {
    var _this = this;
    options || (options = {});
    if (this.get('workspace_id') != null) {
      return Area.__super__.save.call(this, options);
    } else {
      return this.trigger('requestWorkspaceId', {
        success: function(workspace, textStatus, jqXHR) {
          _this.set('workspace_id', workspace.get('id'));
          if (_this.get('workspace_id')) {
            return _this.save(options);
          } else {
            return options.error(_this, {
              error: "Could not save workspace, so cannot save area"
            }, jqXHR);
          }
        }
      });
    }
  };

  return Area;

})(Pica.Model);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Models.Polygon = (function(_super) {

  __extends(Polygon, _super);

  function Polygon() {
    this.save = __bind(this.save, this);
    this.attributes = {};
  }

  Polygon.prototype.setGeomFromPoints = function(points) {
    var point;
    points = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        _results.push([point.lng, point.lat]);
      }
      return _results;
    })();
    points.push(points[0]);
    return this.set('geometry', [[points]]);
  };

  Polygon.prototype.url = function() {
    return {
      read: "" + Pica.config.magpieUrl + "/polygons",
      create: "" + Pica.config.magpieUrl + "/areas_of_interest/" + (this.get('area_id')) + "/polygons"
    };
  };

  Polygon.prototype.save = function(options) {
    var _this = this;
    options || (options = {});
    if (this.get('area_id') != null) {
      return Polygon.__super__.save.call(this, options);
    } else {
      return this.trigger('requestAreaId', {
        success: function(area, textStatus, jqXHR) {
          _this.set('area_id', area.get('id'));
          if (_this.get('area_id')) {
            return _this.save(options);
          } else {
            if (options.error != null) {
              return options.error(_this, {
                error: "Could not save area, so cannot save polygon"
              }, jqXHR);
            }
          }
        },
        error: function() {
          console.log("Unable to save polygon:");
          return console.log(error);
        }
      });
    }
  };

  return Polygon;

})(Pica.Model);


Pica.Views.NewPolygonView = (function() {

  function NewPolygonView(options) {
    var _this = this;
    this.finishedCallback = options.finishedCallback;
    this.polygon = options.polygon;
    this.polygonDraw = new L.Polygon.Draw(Pica.config.map, {});
    this.polygonDraw.enable();
    Pica.config.map.on('draw:poly-created', function(e) {
      var mapPolygon;
      mapPolygon = e.poly;
      return _this.createPolygon(mapPolygon);
    });
  }

  NewPolygonView.prototype.createPolygon = function(mapPolygon) {
    var _this = this;
    this.polygon.setGeomFromPoints(mapPolygon.getLatLngs());
    return this.polygon.save({
      success: function() {
        _this.close();
        return _this.finishedCallback();
      }
    });
  };

  NewPolygonView.prototype.close = function() {
    this.polygonDraw.disable();
    return Pica.config.map.off('draw:poly-created');
  };

  return NewPolygonView;

})();