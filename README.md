# WORK IN PROGRESS
This repo is currently a work in progress. It's a scratchpad while we finalize
the initial Cerebellum release. Please stand by.

# About
Cerebellum is a tiny library that provides a declarative way to build javascript
view hiearchies. It handles view nesting, DOM event binding, and re-rendering so
that you can focus on building the business logic.

# Dependencies
Cerebellum is a stand-alone library. It's more of a set of conventions that make
your life easier as a frontend web developer. Use it with any MVC framework you
like; Cerebellum is framework-agnostic.

# Installation

    bower install cerebellum

# Use
Cerebellum expects to receive a Javascript Object literal with your view
hiearchy defined as follows:

    {
      name: RootView, // class of View to render
      el: '#content', // element to render into
      if: true, // value or function that determines whether this view is shown
      renderMethod: 'render', // method to be called to render this view
      disposeMethod: 'dispose', // method to be caled to dispose this view
      childViews: [
        {
          name: ChildView,
          el: '#navbar',
          if: ChildView.signedIn,
          renderMethod: 'render',
          disposeMethod: 'dispose'
        }
      ]
    }

