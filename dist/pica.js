/*! pica - v0.1.0 - 2012-11-26
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
    var callback, _i, _len, _ref, _results;
    if ((this.events != null) && (this.events[event] != null)) {
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
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
    var _ref;
    if ((_ref = this.attributes) == null) {
      this.attributes = {};
    }
    return this.attributes[attribute];
  };

  Model.prototype.set = function(attribute, value) {
    var _ref;
    if ((_ref = this.attributes) == null) {
      this.attributes = {};
    }
    return this.attributes[attribute] = value;
  };

  Model.prototype.sync = function(options) {
    var callback, data,
      _this = this;
    if (options == null) {
      options = {};
    }
    callback = options.success || function() {};
    options.success = function(data, textStatus, jqXHR) {
      if (data.id != null) {
        _this.parse(data);
        _this.trigger('sync', _this);
        return callback(_this, textStatus, jqXHR);
      }
    };
    data = this.attributes;
    if (options.type === 'post') {
      data = JSON.stringify(data);
    }
    return $.ajax($.extend(options, {
      dataType: "json",
      contentType: "application/json",
      data: data
    }));
  };

  Model.prototype.parse = function(data) {
    var attr, val, _results;
    _results = [];
    for (attr in data) {
      val = data[attr];
      _results.push(this.set(attr, val));
    }
    return _results;
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

    this.fetch = __bind(this.fetch, this);
    this.polygons = [];
    this.set('name', 'My Lovely Area');
  }

  Area.prototype.setName = function(name) {
    return this.set('name', name);
  };

  Area.prototype.addPolygon = function(polygon) {
    polygon.on('requestAreaId', this.save);
    polygon.on('sync', this.fetch);
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

  Area.prototype.newShowAreaPolygonsView = function() {
    return new Pica.Views.ShowAreaPolygonsView({
      area: this
    });
  };

  Area.prototype.url = function() {
    return {
      create: "" + Pica.config.magpieUrl + "/workspaces/" + (this.get('workspace_id')) + "/areas_of_interest/",
      read: "" + Pica.config.magpieUrl + "/areas_of_interest/" + (this.get('id'))
    };
  };

  Area.prototype.fetch = function() {
    return Area.__super__.fetch.apply(this, arguments);
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

  Polygon.prototype.isComplete = function() {
    return this.get('geometry') != null;
  };

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

  Polygon.prototype.geomAsLatLngArray = function() {
    var latLngs, point, _i, _len, _ref;
    latLngs = [];
    if (this.isComplete()) {
      _ref = this.get('geometry')[0][0];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        latLngs.push(new L.LatLng(point[1], point[0]));
      }
    }
    return latLngs;
  };

  Polygon.prototype.url = function() {
    return {
      read: "" + Pica.config.magpieUrl + "/polygons/" + (this.get('id')),
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
        error: function(error) {
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
        if (typeof finishedCallback !== "undefined" && finishedCallback !== null) {
          return _this.finishedCallback();
        }
      }
    });
  };

  NewPolygonView.prototype.close = function() {
    this.polygonDraw.disable();
    return Pica.config.map.off('draw:poly-created');
  };

  return NewPolygonView;

})();

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pica.Views.ShowAreaPolygonsView = (function(_super) {

  __extends(ShowAreaPolygonsView, _super);

  function ShowAreaPolygonsView(options) {
    this.triggerPolyClick = __bind(this.triggerPolyClick, this);

    this.render = __bind(this.render, this);
    this.area = options.area;
    this.mapPolygons = [];
    this.area.on('sync', this.render);
    this.render();
  }

  ShowAreaPolygonsView.prototype.render = function() {
    var mapPolygon, polygon, _i, _len, _ref, _results,
      _this = this;
    this.removeAllPolygonsAndBindings();
    _ref = this.area.polygons;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      polygon = _ref[_i];
      if (!polygon.isComplete()) {
        continue;
      }
      mapPolygon = new L.Polygon(polygon.geomAsLatLngArray()).addTo(Pica.config.map);
      mapPolygon.on('click', (function() {
        var thatPolygon;
        thatPolygon = polygon;
        return function(event) {
          return _this.triggerPolyClick(thatPolygon, event);
        };
      })());
      polygon.on('delete', function() {
        return removeMapPolygonAndBindings(mapPolygon);
      });
      _results.push(this.mapPolygons.push(mapPolygon));
    }
    return _results;
  };

  ShowAreaPolygonsView.prototype.close = function() {
    return this.removeAllPolygonsAndBindings();
  };

  ShowAreaPolygonsView.prototype.removeAllPolygonsAndBindings = function() {
    var mapPolygon, _results;
    _results = [];
    while (mapPolygon = this.mapPolygons.shift()) {
      _results.push(this.removeMapPolygonAndBindings(mapPolygon));
    }
    return _results;
  };

  ShowAreaPolygonsView.prototype.removeMapPolygonAndBindings = function(mapPolygon) {
    mapPolygon.off('click', this.triggerPolyClicked);
    return Pica.config.map.removeLayer(mapPolygon);
  };

  ShowAreaPolygonsView.prototype.triggerPolyClick = function(polygon, event) {
    return this.trigger('polygonClick', [polygon, event]);
  };

  return ShowAreaPolygonsView;

})(Pica.Events);
