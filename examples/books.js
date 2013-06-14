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
      window.user.books.add(new Book({ title: title }));
      Dispatch.trigger('toolbar:add');
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
  }
});

var Landing = Backbone.View.extend({
  render: function () {
    this.$el.html(this.template());
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
    Dispatch.on('app_router:books', this.renderBooks);
    Dispatch.on('app_router:index', this.renderLanding);
  },
  initialize: function () {
    Dispatch.on('sign_in', this.render, this);
    Dispatch.on('app_router:books', this.renderBooks, this);
    Dispatch.on('app_router:index', this.renderLanding, this);
    _.each(this.children, function (child) {
      child.instance = new child.view();
    });
  },
  render: function () {
    // this.$el.empty();
    // _.each(this.children, function (child) {
    //   child.instance.render();
    //   this.$el.append(child.instance.el);
    // }, this);
  },
  renderBooks: function () {
    this.$el.empty();
    this.children[0].instance.render();
    this.$el.append(this.children[0].instance.el);
  },
  renderLanding: function () {
    this.$el.empty();
    this.children[1].instance.render();
    this.$el.append(this.children[1].instance.el);
  }
});

var Navbar = Backbone.View.extend({
  className: 'navbar navbar-inverse',
  dispose: function () {
    Dispatch.off('sign_in', this.render);
  },
  events: { 'submit form': 'submit' },
  initialize: function () {
    Dispatch.on('sign_in', this.render, this);
  },
  render: function () {
    this.$el.html(this.template());
  },
  submit: function () {
    var email = $('[type=email]').val();
    window.user = {
        email: email,
        books: new BooksCollection()
    };
    Dispatch.trigger('sign_in');
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

var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'books': 'books'
  },
  index: function () {
    Dispatch.trigger('app_router:index');
  },
  books: function () {
    if (window.user) {
      window.user.books = new BooksCollection();
      Dispatch.trigger('app_router:books');
    } else {
      Backbone.history.navigate('/', true);
    }
  }
});

$(document).ready(function () {
  Backbone.history.start({pushState: true});

  new AppContainer();
  new AppRouter();
});
