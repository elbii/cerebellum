var Book = Backbone.Model.extend({});
var BooksCollection = Backbone.Collection.extend({ model: Book });
var Dispatch = _.clone(Backbone.Events);

var Toolbar = Backbone.View.extend({
  events: {
    'submit form': 'submit'
  },
  render: function () {
    this.$el.html(this.template());
  },
  submit: function () {
    var title = $('input').val();

    if (title.length > 0) {
      delete this.error;
      window.user.books.add(new Book({ title: title }));
      Dispatch.trigger('toolbar:add');
    } else {
      this.error = 'Invalid title.';
      this.render();
    }
  },
  template: _.template($('#toolbar').html())
});

var List = Backbone.View.extend({
  dispose: function () {
    Dispatch.off('toolbar:add', this.render);
  },
  initialize: function () {
    Dispatch.on('toolbar:add', this.render, this);
  },
  render: function () {
    this.$el.html(this.template());
  },
  template: _.template($('#list').html())
});

var BooksContainer = Backbone.View.extend({
  children: [
    { view: Toolbar },
    { view: List }
  ],
  initialize: function () {
    _.each(this.children, function (child) {
      child.instance = new child.view();
    });
  },
  render: function () {
    _.each(this.children, function (child) {
      child.instance.render();
      this.$el.append(child.instance.el);
    }, this);
  },
  conditional: function () {
    return window.user !== undefined;
  }
});

var Landing = Backbone.View.extend({
  render: function () {
    this.$el.html(this.template());
  },
  conditional: function () {
    return window.user === undefined;
  },
  template: _.template($('#landing').html())
});

var ContentContainer = Backbone.View.extend({
  children: [
    { view: BooksContainer },
    { view: Landing }
  ],
  dispose: function () {
    Dispatch.off('sign_in', this.render);
  },
  initialize: function () {
    Dispatch.on('sign_in', this.render, this);
    _.each(this.children, function (child) {
      child.instance = new child.view();
    });
  },
  render: function () {
    this.$el.empty();
    _.each(this.children, function (child) {
      if (child.instance.conditional()) {
        child.instance.render();
        this.$el.append(child.instance.el);
      }
    }, this);
  }
});

var Navbar = Backbone.View.extend({
  className: 'navbar navbar-inverse',
  dispose: function () {
    Dispatch.off('sign_in', this.render);
  },
  events: {
    'submit form': 'submit'
  },
  initialize: function () {
    Dispatch.on('sign_in', this.render, this);
  },
  render: function () {
    this.$el.html(this.template());
  },
  submit: function () {
    var email = $('[type=email]').val();

    if (email.length > 0) {
      delete this.error;
      window.user = {
        email: email,
        books: new BooksCollection()
      };
      Dispatch.trigger('sign_in');
    } else {
      this.error = 'Invalid login.';
      this.render();
    }
  },
  template: _.template($('#navbar').html())
});

var AppContainer = Backbone.View.extend({
  children: [
    { view: Navbar },
    { view: ContentContainer }
  ],
  className: 'container',
  initialize: function () {
    _.each(this.children, function (child) {
      child.instance = new child.view();
    });

    this.render();
  },
  render: function () {
    _.each(this.children, function (child) {
      child.instance.render();
      this.$el.append(child.instance.el);
    }, this);

    $('body').append(this.el);
  }
});

$(document).ready(function () {
  new AppContainer();
});

