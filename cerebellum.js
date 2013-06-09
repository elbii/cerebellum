var ChildView = Backbone.View.extend({
  events: {
    'click': 'logClick'
  },

  logClick: function (e) {
    console.log(e);
  },

  render: function () {
    this.$el.html(this.template());
  },

  template: _.template($('#template').html())
});

var ParentView = Backbone.View.extend({
  initialize: function (children) {
    this.childViews = [];

    _.each(children, function (child) {
      this.childViews.push(new child());
    }, this);
  },

  render: function () {
    _.each(this.childViews, function (view) {
      view.render();
      this.$el.append(view.el);
    }, this);
  }
});

var root = new ParentView([
  ParentView,
  ParentView,
  ChildView,
  ChildView
]);

root.render();

$(document).ready(function () {
  $('body').html(root.el);
});

