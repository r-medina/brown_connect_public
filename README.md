# BrownConnect

"a web app for brown students to find mentorship, internships, and funding"

## installation

make sure you have `git`, `gem` (ruby package manager), and `node` installed then run:

    git clone git@github.com:r-medina/internship_initiative.git

or

    git clone https://github.com/r-medina/internship_initiative.git

if you don't have ssh set up. finally, run

    cd internship_initiative && make

## development

to start the development server run `grunt` which runs the development server and watches
the assets for live reload. upon doing a `git pull`, it is advisable to do a `npm install`
to make sure any new dependancies are updated. also, when you pull run `grunt githooks`
unless you're doing a clean install. running `grunt test` makes sure the server starts up
normally, so make sure to do that before/after pulling (all tests are broken right now).

see [Kraken docs](http://krakenjs.com/) for information about directory structure etc.

## about

The technology powering BrownConnect is a dynamic ensemble of the tried, tested, and
trendy libraries that helped shape the moden web.

The back-end is made possible by the web-framework that the folks at
[PayPay](http://paypal.github.io/) habe developed:
[Kraken](http://krakenjs.com/). The appeal of Kraken comes largely from the fact that
it builds on the supremely popular [Express](http://expressjs.com/) library for
NodeJS. Express, which enjoys a large marketshare of the NodeJS ecosystem, exposes a
very easy-to-use API for developiing middleware. As a result, there exist countless
projects and libraries that anyone can hook into to add powerfull features to their
webapp. All of these, of course, are available on Kraken as well.

Kraken differentiates itself from Expres in several ways. On an abstract level,
Kraken is more opinionated and thus lends itself to organization in an immediately
obvious way. Generating a blank Kraken project (using their (Yeoman)[http://yeoman.io/]
generator) gives you the following directory structure:

    /config
    Application and middleware configuration
    
    /controllers
    Routes and logic
    
    /locales
    Language specific content bundles
    
    /models
    Models
    
    /public
    Web resources that are publicly available
    
    /public/templates
    Server and browser-side templates
    
    /tests
    Unit and functional test cases
    
    index.js
    Application entry point

To be sure, the business logic of your app will fall into one of these categories.

Lower-level advantages to Kraken include ease-of-configuration. See [this
page](https://github.com/lmarkus/Kraken_Example_Configuration) for examples. Things
like common Express middlewares (Session for example), can simply be configured by
including the proper fields in your configuration JSON files.

Yet another big advantage (that we have admittedly not fully integrated) is the
security options that come out-of-the-box with Paypal's
[Lusca](https://github.com/krakenjs/lusca) module. This module provides an API
for protecting your web app from things like Cross Site Request Forgery as well as
tightening your X-FRAME-OPTIONS for stronger security.

The other big features that Kraken exposes are slightly less useful for our purposes
(regionally specific content and template compilation). Nevertheless, we do use the
template compiling and will expand on that feature as the product matures and we
differentiate user permissions.

Kraken also comes with an easy way to minify and compile assets for production
environments. This is extremely helpful, as serving many large files definitely
strains the server. Kraken also comes with
[Mocha](http://visionmedia.github.io/mocha/), a server-side JavaScript testing
framework, which, at first at least, allowed for easy testing of our developement
environment installations.

Another thing to take note of with Kraken, is that it still is not at a 1.0 release
yet. We took a chance (although, a tecnology that Paypal has proudly put its name on
is not much of a gamble, really) in the sense that we were excited by the
possibilities Kraken presented us, and we ran with it.

We also used a slew of other modules while developing BrownConnect. Thanks to
[Grunt](http://gruntjs.com/), we were able to automate a lot of our workflow during
development. Grunt watches all server and front-end files and carefull reloads the
code dynamically such that things like restarting the server or refreshing browser
pages were are thing of the past. Also, since we used SASS to make the stylesheets
(contrary to Kraken's insistence on LESS), Grunt was able to watch our SASS
stylesheets and compile them before refreshing the browser. Grunt also runs our
front-end and back-end tests.

For a front-end testing suite, we used Karma. Karma simulates a browser allows for
easy testing of browser-specific javascript code.

For a plethora of reasons that are beyond the scope of this description, we decided
to use [MongoDB](https://www.mongodb.org/) as our database layer. Despite some
frustration, the NodeJS package [Mongoose](http://mongoosejs.com/) was instrumental
in our integration of MongoDB with our back-end.

The last big technology that we proudly use is (AngularJS)[angularjs.org]. The
"superheroic" front-end MV* framework helped make writing our front-end as modular as
the back-end code. We at BrownConnect our big beleivers that two-way data-binding is
the future of front-end web developement and our using AngularJS as extensively as we
do is a temstament to that fact. Hooking into our RESTful HTTP endpoints and
generating models that were bound to the DOM is a powerful luxury that we cannot
imagine having worked without (or, rather, we certainly _can_, but this
fantasy seems altogether more unpleasent and less bad-ass than using AngularJS).

## todo/bugs

1. Front-end
    - filters for search results
    - pagination for messages and search results
    - modal dialogue for messages yeee
    - make some sort of home page for logged in users (messages, starred users, similar posts)
    - bypass /#/ page if user is logged in
    - make search take urls for persistent state
    - make messages page template
    - make block user list with option of unblocking users
    - fix mobile version + move index code to ng-animate?
    - refactor angular stuff. specially search/ac-tags/peer search stuff

2. Back-end
    - serve different templates to angular based on if user is logged in or not/brown affiliate
    - make back end serve templates with csrf tokens!!!
    - search shouldn't return logged in user

## dev todo

1. write tests!

## wishlist

1. https
2. memcache
3. rabbitmq
