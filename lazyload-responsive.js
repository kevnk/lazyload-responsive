(function(window, document){
    
    window.LazyloadResponsive = {
        // Options
        _o: {
            srcAttr: 'data-lzld-src',
            widthfactor: 200, // looks for images with the following naming convention [real-image-src]_[factor of widthfactor].[file-extenstion]
            smaller: false, // forces script to look for and load smaller images as viewport is resized to a smaller size
            lowres: false, // forces script to **not** look for high-res images
            longfallback: false, // will look for all smaller images before loading the original (and largest image)
            loadevent: ['scroll','resize'] // you may want to load the images on a custom event; this is where you do that
            offset: 200
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
            that.domReady();
            // TODO - when to call showImages
            // TODO - when to call resizeImages
        },
        domReady: function() {
            var that = this;
            that._u.contentLoaded(window, function(e){
                that.showImages();
            });
        },
        showImages: function() {
            var that = this;
            for (var i = that.lzldImages.length - 1; i >= 0; i--){
                var img = that.lzldImages[i];
                // TODO optimize: put faster one first
                if (img.getAttribute('data-lzld-done') === null && that._u.isVisible(img)) {
                    that.imagesToLoad.push(img);
                };
            };
            that.loadImages();
        },
        loadImages: function() {
            var that = this;
            for (var i = that.imagesToLoad.length - 1; i >= 0; i--){
                var img = that.imagesToLoad[i];

                // TODO: get and set image src

                // mark as done
                that._u.writeAttribute(img, 'data-lzld-done', 'done');
                that.imagesLoaded.push(img);
            };
        },
        resizeImages: function() {
            var that = this;
            for (var i = that.imagesLoaded.length - 1; i >= 0; i--){
                var img = that.imagesLoaded[i];

                // TODO: get and set image src
            };
        },
        // @var img - dom element
        getImageSrc: function(img) {
            // check if already parsed, else parse it
            // get base filename
            // getCurrentFactoredWidth
        },
        getCurrentFactoredWidth: function() {
            
        },
        // should only be done once and stored on the img
        parseImageFilename: function() {
            // check image parsed
        }
    };
    
    // utility methods that a javascript library might have
    window.LazyloadResponsive._u = {
        lzld: window.LazyloadResponsive,
        getLzldAttr: function(img, attr) {
            var that = this;
            return img.getAttribute("data-lzld-"+attr) || that.lzld._o[attr];
        },
        writeAttribute: function(elem, attr, value) {
            var a = document.createAttribute(attr);
            attr.value = value;
            elem.setAttributeNode(attr);
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
            return (that.contains(document.documentElement, img) && img.getBoundingClientRect().top < winH + offset);
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
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
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
        },
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
        contentLoaded: function(win, fn) {

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
    };
    
    window.LazyloadResponsive.initialize();
    
})(this, document);