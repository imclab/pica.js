Pica.Views ||= {}

class Pica.Views.MapEditView extends Backbone.View
  el: '#side_panel'

  initialize: (map) ->
    @map = map
    @polygon = new Pica.Models.Polygon()

    # TODO: bind to map polygon methods

  render: =>
    return this