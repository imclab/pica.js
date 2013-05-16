requirejs.config

  #baseUrl: "./"
  
  # Specify dependency libraries
  paths:
    jquery: "../vendor/jquery/jquery"
    jQueryXDomainRequest: "../vendor/jQuery.XDomainRequest/index"
    leaflet: "../vendor/leaflet/dist/leaflet"
    leaflet_draw: "../vendor/leaflet.draw/index"
    almond: "../node_modules/grunt-requirejs/node_modules/almond/almond"
    pica: "pica"


  # Not AMD-capable per default,
  # so we need to use the AMD wrapping of RequireJS.
  shim:
    jQueryXDomainRequest:
      exports: "jquery"

    # Leaflet has added AMD compatibility with this commit:
    # https://github.com/Leaflet/Leaflet/commit/323245ffc356683914f63fb9b70f6fe8627cdc69
    # But still not in distribution.
    leaflet:
      exports: "L"

    leaflet_draw:
      deps: ["leaflet"]
      exports: "L"

  name: "almond"
  include: ["pica"]
  
  #insertRequire: ["charter"] 

  wrap:
    startFile: "../wrap/start.frag"
    endFile: "../wrap/end.frag"