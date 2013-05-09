(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

    // Lazyload-Responsive
    module('LazyloadResponsive', {
        setup: function() {
            this.elems = $('img[data-lzld-src]');
        }
    });
    
    test('is chainable', function() {
      expect(1);
      // Not a bad test to run on collection methods.
      strictEqual(this.elems.lazyloadResponsive(), this.elems, 'should be chainable');
    });
    
    module('Request Management', {
        setup: function() {
            var that = this;
            that.requestedSrcs = [];
            // @see http://stackoverflow.com/questions/3596583/javascript-detect-an-ajax-event
            that.ajaxListener = new Object();
            that.ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
            that.ajaxListener.tempSend = XMLHttpRequest.prototype.send;
            that.ajaxListener.callback = function () {
                // TODO: if method was one to look for an image, then run this
                if (true) {
                    that.requestedSrcs.push(this.url);
                }
              // this.method :the ajax method used
              // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
              // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)
            }

            XMLHttpRequest.prototype.open = function(a,b) {
              if (!a) var a='';
              if (!b) var b='';
              that.ajaxListener.tempOpen.apply(this, arguments);
              that.ajaxListener.method = a;  
              that.ajaxListener.url = b;
              if (a.toLowerCase() == 'get') {
                that.ajaxListener.data = b.split('?');
                that.ajaxListener.data = that.ajaxListener.data[1];
              }
            }

            XMLHttpRequest.prototype.send = function(a,b) {
              if (!a) var a='';
              if (!b) var b='';
              that.ajaxListener.tempSend.apply(this, arguments);
              if(that.ajaxListener.method.toLowerCase() == 'post')that.ajaxListener.data = a;
              that.ajaxListener.callback();
            }
        }
    });

    // No file should ever be requested more than once
    asyncTest('has no duplicate image requests', 1, function(){
        // TODO: make this an on method that makes sense
        that.ajaxListener.on('readystatechange', function(data){
            QUnit.log(data)
            start();
        })
    })

// Event: Onload
// Images within range should be loaded AND resized

// Event: Scroll
// Images within range should be loaded AND resized
// Call on scroll should be throttled
// Option related tests

// Event: Resize
// Images within range should be loaded AND resized
// Call on resize should be throttled
// Option related tests

// Dynamically Added Content
// Images within range should be loaded AND resized


/*
  module('jQuery#awesome', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.lazyloadResponsive(), this.elems, 'should be chainable');
  });

  test('is awesome', function() {
    expect(1);
    strictEqual(this.elems.lazyloadResponsive().text(), 'awesome0awesome1awesome2', 'should be awesome');
  });

  module('jQuery.lazyloadResponsive');

  test('is awesome', function() {
    expect(2);
    strictEqual($.lazyloadResponsive(), 'awesome.', 'should be awesome');
    strictEqual($.lazyloadResponsive({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  });

  module(':awesome selector', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', function() {
    expect(1);
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });
*/

}(jQuery));
