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
* Version: 0.2
*
* URL:
* https://github.com/kevinkirchner/lazyload-responsive
*
*/

// TODO:
// use some sort of promise-type OnReadyStateChange with the urlExists method so images aren't being requested while others are being loaded
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
        imgsToLoad: [],
        imgsToResize: [],
        imgsComplete: [],
        availableSrcs: [],
        unavailableSrcs: [],
        requestedSrcs: [],
        // Initialize
        initialize: function() {
            var that = this;
            that._f.isHighRes = that._u.getPixelRatio() >= 2;
            // Collect images
            that.collectImgs();
            // Load first batch of images
            that.loadImgs();
            // Attach Events
            that.attachEvents();
        },
        // This can be run after adding new images to the page to make them lazyload-responsive
        collectImgs: function() {
            var that = this;
            var allImgs = document.getElementsByTagName( "img" );
            for ( var i = 0, il = allImgs.length; i < il; i++ ){
                if ( allImgs[i].getAttribute( that._o.srcAttr ) !== null ) {
                    var img = allImgs[i];
                    if (that._u.inArray(img, that.imgs) === -1) {
                        that.imgs.push( img );
                    };
                    if (!img.getAttribute('data-lzld-complete') && that._u.isVisible(img)) {
                        that.imgsToLoad.push( img )
                    };
                }
            }
        },
        loadImgs: function() {
            var that = this;
            for (var i = that.imgsToLoad.length - 1; i >= 0; i--){
                var img = that.imgsToLoad[i],
                    imgSrc = that.getImgSrc(img)
                    
                if (imgSrc) {
                    img.src = imgSrc;
                    // mark as done
                    img.setAttribute('data-lzld-complete', 'true');
                    that.imgsComplete.push(img);
                    that.imgsToLoad.splice(i,1)
                };
            };
        },
        resizeImgs: function() {
            var that = this;
            for (var i = that.imgsComplete.length - 1; i >= 0; i--){
                var img = that.imgsComplete[i],
                    imgSrc = that.getImgSrc(img)
                    
                if (imgSrc) {
                    img.src = imgSrc;
                };
            };
        },
        attachEvents: function() {
            var that = this;
            var winW = that._u.getViewport("Width");
            var throttleLoad = that._u.throttle( function(){
                that.collectImgs();
                that.loadImgs();
            }, 20);
            var throttleResize = that._u.throttle( function(){
                that.resizeImgs();
            }, 20);

            // onresize
            that._u.addEvent(window,"resize",function(){
                var newWinW = that._u.getViewport("Width");
                if (that._o.smaller || newWinW > winW) {
                    throttleResize();
                };
                if (newWinW > winW) {
                    throttleLoad();
                };
                winW = newWinW;
            });
            // onscroll
            that._u.addEvent(window,"scroll",function(){
                (that._u.throttle( function(){
                    that.collectImgs();
                    that.loadImgs();
                }, 20))();
            });
        },
        getImgSrc: function(img) {
            var that = this,
                imgSrc,
                isParsed = img.getAttribute('data-lzld-isparsed') || that.parseImageSrc( img ),
                filePath = img.getAttribute('data-lzld-filepath'),
                fileName = img.getAttribute('data-lzld-filename'),
                fileExt = img.getAttribute('data-lzld-fileext'),
                longfallback = img.getAttribute('data-lzld-longfallback') || that._o.longfallback,
                sizedown = img.getAttribute('data-lzld-sizedown') || that._o.sizedown,
                widthfactor = img.getAttribute('data-lzld-widthfactor') || that._o.widthfactor
                lowres = img.getAttribute('data-lzld-lowres') || that._o.lowres,
                highressuffix = img.getAttribute('data-lzld-highressuffix') || that._o.highressuffix,
                useHighRes = that._f.isHighRes && !lowres,
                viewportW = that._u.getViewport('Width'),
                imgSearch = [],
                widthfactorFactor = Math.floor(viewportW / widthfactor),
                firstWidth = !sizedown ? widthfactorFactor * widthfactor : (widthfactorFactor+1) * widthfactor
            // figure out the image src(s) names and put in array
            imgSearch.push( '_'+firstWidth );
            // if longfallback then add to imgSearch
            if (longfallback) {
                for (var i = widthfactorFactor-1; i >= 0; i--){
                    var w = !sizedown ? i * widthfactor : (i+1) * widthfactor
                    imgSearch.push( '_'+w );
                };
            };
            // look for the smallest image
            imgSearch.push( '_small' );
            // final fallback to the original image
            imgSearch.push( '' );

            // loop through imgSearch and check for files
            for (var i=0,il=imgSearch.length; i < il; i++) {
                // TODO: store the paths that do exist and use them instead
                var widthPart = imgSearch[i];
                // High-res
                if (useHighRes) {
                    imgSrc = filePath + fileName + widthPart + highressuffix + fileExt;
                    if (that.checkSrc(imgSrc)) {
                        return imgSrc;
                    }
                };
                // Low-res
                imgSrc = filePath + fileName + widthPart + fileExt;
                if (that.checkSrc(imgSrc)) {
                    return imgSrc;
                }
            };
            return false;
        },
        // Check and store image sources
        checkSrc: function(imgSrc) {
            var that = this;
            if (that._u.inArray(imgSrc, that.availableSrcs) !== -1) {
                return true;
            };
            if (that._u.inArray(imgSrc, that.unavailableSrcs) === -1) {
                if (that._u.inArray(imgSrc, that.requestedSrcs) === -1 && that.urlExists(imgSrc)) {
                    that.availableSrcs.push( imgSrc );
                    return true;
                } else {
                    that.unavailableSrcs.push( imgSrc );
                };
            };
            return false;
        },
        // should only be done once and stored on the img
        parseImageSrc: function(img) {
            // check image parsed
            var that = this,
                imgSrc = img.getAttribute( that._o.srcAttr ),
                lastSlash = imgSrc.lastIndexOf('/')+1,
                filePath = imgSrc.substring(0,lastSlash),
                file = imgSrc.substring(lastSlash),
                lastPeriod = file.lastIndexOf('.'),
                fileName = file.substring(0,lastPeriod),
                fileExt = file.substring(lastPeriod);
            
            img.setAttribute('data-lzld-filepath',filePath);
            img.setAttribute('data-lzld-filename',fileName);
            img.setAttribute('data-lzld-fileext',fileExt);
            img.setAttribute('data-lzld-isparsed','true');
            return true;
        },
        // http://stackoverflow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
        urlExists: function(url) {
            var that = this;
            that.requestedSrcs.push(url);
            var req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            return req.status==200;
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