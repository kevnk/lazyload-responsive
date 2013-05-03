/*!
* contentloaded.js
*
* Author: Diego Perini (diego.perini at gmail.com)
* Summary: cross-browser wrapper for DOMContentLoaded
* Updated: 20101020
* License: MIT
* Version: 1.2
*
* URL:
* http://javascript.nwbox.com/ContentLoaded/
* http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
*
*/

// @win window reference
// @fn function reference
function contentLoaded(win, fn) {

    var done = false, top = true,

    doc = win.document, root = doc.documentElement,

    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',

    init = function(e) {
        if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
        (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
        if (!done && (done = true)) fn.call(win, e.type || e);
    },

    poll = function() {
        try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
        init('poll');
    };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (doc.createEventObject && root.doScroll) {
            try { top = !win.frameElement; } catch(e) { }
            if (top) poll();
        }
        doc[add](pre + 'DOMContentLoaded', init, false);
        doc[add](pre + 'readystatechange', init, false);
        win[add](pre + 'load', init, false);
    }

}



/*!
* lazyload-responsive.js
*
* Author: Kevin Kirchner (kirchner.kevin at gmail.com)
* Summary: cross-browser lazy and responsive image loader
* Version: 0.2.1
*
* URL:
* https://github.com/kevinkirchner/lazyload-responsive
*
*/

// TODO:
// use some sort of promise-type OnReadyStateChange with the urlExists method so images aren't being requested while others are being loaded
    // have baseSrc saved in a queue while image is loading
// Optimize when everything gets initilized and isolate the things that need dom loaded

(function(window, document){
    
    // Set default configuration
    var config = {
        srcAttr: 'data-lzld-src',
        highressuffix: '@2x', // e.g. imagename@2x.jpg or imagename_400@2x.jpg would be the high-res images
        widthfactor: 200, // looks for images with the following naming convention [real-image-src]_[factor of widthfactor].[file-extenstion]
        smaller: false, // forces script to look for and load smaller images as viewport is resized to a smaller size
        lowres: false, // forces script to **not** look for high-res images
        longfallback: true, // will look for all smaller images before loading the original (and largest image)
        loadevent: ['scroll','resize'], // you may want to load the images on a custom event; this is where you do that
        sizedown: false, // by default images are sized up; this option forces it to get an image larger than the viewport and shrink it; NOTE: setting to `true` will load larger images and increase pageload
        offset: 200, // distance (px) below the fold where images will be loaded
        throttleInterval: 20 // throttled interval for scroll and resize events
    };
    
    var domReady = false;
    contentLoaded(window,function(){ domReady = true; });
    
    var LazyloadResponsive = {
        // Options
        _o: config,
        // Flags
        _f: {},
        // Init variables
        imgs: [],
        loadImgsQ: [], // All images start here
        loadedImgs: [], // All loaded (and correctly sized) images end here; Also doubles as the array of images that need to be checked when browser is resized
        requestingBaseImgs: [], // Store base file name (e.g. 'path/to/image.jpg') of image srcs currently being requested to prevent multiple requests for different sizes of the same image
        requestImgsQ: [], // Full src queue of different sizes of an image currently being requested in case it 404s
        availableImgs: [], // Store all successful requests to reuse when needed
        unavailableImgs: [], // Store all unsuccessful requests to prevent an unnecessary 404 request
        initilize: function() {
            
        }
    }
    
    // Utility methods - more library-like methods
    LazyloadResponsive._u = {
        lzld: LazyloadResponsive,
        _o: config,
        throttle: function(fn, minDelay) {
            var lastCall = 0;
            return function() {
                var now = +new Date();
                if (now - lastCall < minDelay) {
                    return;
                }
                lastCall = now;
                // we do not return anything as
                // https://github.com/documentcloud/underscore/issues/387
                fn.apply(this, arguments);
            };
        },
        urlExists: function(url) {
            var req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            return req.status==200;
        },
        addEvent: function(el, type, fn) {
          if (el.attachEvent) {
            el.attachEvent && el.attachEvent( 'on' + type, fn );
          } else {
            el.addEventListener( type, fn, false );
          }
        },
        removeEvent: function(el, type, fn) {
          if (el.detachEvent) {
            el.detachEvent && el.detachEvent( 'on' + type, fn );
          } else {
            el.removeEventListener( type, fn, false );
          }
        },
        // https://github.com/jquery/jquery/blob/f3515b735e4ee00bb686922b2e1565934da845f8/src/core.js#L610
        // We cannot use Array.prototype.indexOf because it's not always available
        inArray: function(elem, array, i) {
            var len;
            if ( array ) {
                if ( Array.prototype.indexOf ) {
                    return Array.prototype.indexOf.call( array, elem, i );
                }
                len = array.length;
                i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
                for ( ; i < len; i++ ) {
                    // Skip accessing in sparse arrays
                    if ( i in array && array[ i ] === elem ) {
                        return i;
                    }
                }
            }
            return -1;
        },
        isVisible: function(img) {
            var that = this;
            var winH = that.getViewport("Height");
            return (that.contains(document.documentElement, img) && img.getBoundingClientRect().top < winH + that._o.offset);
        },
        getViewport: function(dimension) {
            if (document.documentElement["client"+dimension] >= 0) {
              return document.documentElement["client"+dimension];
            } else if (document.body && document.body["client"+dimension] >= 0) {
              return document.body["client"+dimension];
            } else if (window["inner"+dimension] >= 0) {
              return window["inner"+dimension];
            } else {
              return 0;
            }
        },
        // https://github.com/jquery/sizzle/blob/3136f48b90e3edc84cbaaa6f6f7734ef03775a07/sizzle.js#L708
        contains: function(a,b) {
            if (document.documentElement.compareDocumentPosition) {
                return !!(a.compareDocumentPosition( b ) & 16);
            };
            if (document.documentElement.contains) {
                return a !== b && ( a.contains ? a.contains( b ) : false );
            };
            while ( (b = b.parentNode) ) {
              if ( b === a ) {
                return true;
              }
            }
            return false;
        },
        getPixelRatio: function() {
            return !!window.devicePixelRatio ? window.devicePixelRatio : 1;
        }
    }
    
    // Bind to window
    window.LazyloadResponsive = LazyloadResponsive;
    // Engage!
    if (domReady) {
        window.LazyloadResponsive.initialize();
    } else {
        contentLoaded(window, function(){
            window.LazyloadResponsive.initialize();
        });
    }
    
})(this,document);