// TODO: rewrite this whole this with coffeescript

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
* https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
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

(function(window, document){
    var domReady = false;
    contentLoaded(window,function(){
        domReady = true;
    });
    window.LazyloadResponsive = {
        // Options
        _o: {
            srcAttr: 'data-lzld-src',
            highressuffix: '@2x', // e.g. imagename@2x.jpg or imagename_400@2x.jpg would be the high-res images
            widthfactor: 200, // looks for images with the following naming convention [real-image-src]_[factor of widthfactor].[file-extenstion]
            smaller: false, // forces script to look for and load smaller images as viewport is resized to a smaller size
            lowres: false, // forces script to **not** look for high-res images
            longfallback: true, // will look for all smaller images before loading the original (and largest image)
            loadevent: ['scroll','resize'], // you may want to load the images on a custom event; this is where you do that
            sizedown: false, // by default images are sized up; this option forces it to get an image larger than the viewport and shrink it; NOTE: setting to `true` will load larger images and increase pageload
            offset: 200 // distance (px) below the fold where images will be loaded
        },
        // Flags
        _f: {},
        lzldImages: [],
        imagesToResize: [],
        imagesLoaded: [],
        imagesToLoad: [],
        initialize: function() {
            var that = this;
            
            // set flags
            that.setFlags();
            
            // find all imgs with srcAttr
            var imgs = document.getElementsByTagName( "img" );
            for( var i = 0, il = imgs.length; i < il; i++ ){
                if( imgs[ i ].getAttribute( that._o.srcAttr ) !== null ){
                    that.lzldImages.push( imgs[ i ] );
                }
            }
            // dom ready, resize, and scroll events
            that.attachEvents();
            
            return that;
        },
        setFlags: function() {
            var that = this;
            that._f.isHighRes = that._u.getPixelRatio() > 1;
        },
        attachEvents: function() {
            var that = this;
            if (domReady) {
                that.showImages();
            } else {
                contentLoaded(window,function(){
                    that.showImages();
                })
            };
            var winW = that._u.getViewportWidth();
            // TODO: throttle these
            // FIXME
/*
            window.onresize = function() {
                var newWinW = that._u.getViewportWidth();
                if (that._o.smaller || newWinW > winW) {
                    that.resizeImages();
                };
                if (newWinW > winW) {
                    that.showImages();
                };
                winW = newWinW;
            };
*/
            // TODO: throttle these
            // FIXME
/*
            window.onscroll = function() {
                that.showImages();
            }
*/
        },
        showImages: function() {
            var that = this;
            for (var i = that.lzldImages.length - 1; i >= 0; i--){
                var img = that.lzldImages[i];
                // TODO optimize: put faster one first
                if (!img.getAttribute('data-lzld-done') && that._u.isVisible(img)) {
                    that.imagesToLoad.push(img);
                };
            };
            that.loadImages();
        },
        loadImages: function() {
            var that = this;
            for (var i = that.imagesToLoad.length - 1; i >= 0; i--){
                var img = that.imagesToLoad[i],
                    imgSrc = that.getImageSrc(img)
                    
                if (imgSrc) {
                    img.src = imgSrc;
                    // mark as done
                    img.setAttribute('data-lzld-done', 'done');
                    that.imagesLoaded.push(img);
                };
            };
        },
        resizeImages: function() {
            var that = this;
            for (var i = that.imagesLoaded.length - 1; i >= 0; i--){
                var img = that.imagesLoaded[i],
                    imgSrc = that.getImageSrc(img)
                    
                if (imgSrc) {
                    img.src = imgSrc;
                };
            };
        },
        // @var img - dom element
        getImageSrc: function(img) {
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
                viewportW = that._u.getViewportWidth(),
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
                    if (that._u.urlExists(imgSrc)) {
                        return imgSrc;
                    };
                };
                // Low-res
                imgSrc = filePath + fileName + widthPart + fileExt;
                if (that._u.urlExists(imgSrc)) {
                    return imgSrc;
                };
            };
            
            // add the src that was added and at what width so we can easily switch it again later
            
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
            img.setAttribute('data-lzld-isparsed',"true");
            return true;
        }
    };
    
    // utility methods that a javascript library might have
    window.LazyloadResponsive._u = {
        lzld: window.LazyloadResponsive,
        getLzldAttr: function(img, attr) {
            var that = this;
            return img.getAttribute("data-lzld-"+attr) || that.lzld._o[attr];
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
        isVisible: function(img) {
            var that = this;
            var winH = that.getViewportHeight();
            return (that.contains(document.documentElement, img) && img.getBoundingClientRect().top < winH + that.lzld._o.offset);
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
        // http://stackoverflowindow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
        urlExists: function(url) {
            var req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            return req.status==200;
        },
        getViewportWidth: function() {
            if (document.documentElement.clientWidth >= 0) {
              return document.documentElement.clientWidth;
            } else if (document.body && document.body.clientWidth >= 0) {
              return document.body.clientWidth;
            } else if (window.innerWidth >= 0) {
              return window.innerWidth;
            } else {
              return 0;
            }
        },
        getViewportHeight: function() {
            if (document.documentElement.clientHeight >= 0) {
              return document.documentElement.clientHeight;
            } else if (document.body && document.body.clientHeight >= 0) {
              return document.body.clientHeight;
            } else if (window.innerHeight >= 0) {
              return window.innerHeight;
            } else {
              return 0;
            }
        },
        getPixelRatio: function() {
            return !!window.devicePixelRatio ? window.devicePixelRatio : 1;
        }
    };
    
    window.LazyloadResponsive.initialize();
    
})(this, document);