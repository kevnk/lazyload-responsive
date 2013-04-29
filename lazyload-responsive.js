// loadImage method
// resizeImage method
    // getImageSrc method
    // parseImageFilename method and store on the object
// object of images to load
// object of images to resize

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
        },
        // Flags
        _f: {},
        lzldImages: [],
        imagesToLoad: [],
        imagesToResize: [],
        initialize: function() {
            var that = this;
            
            // set flags
            that.setFlags();
            
            // find all imgs with srcAttr
            var imgs = document.getElementsByTagName( "img" );
            for( var i = 0, il = imgs.length; i < il; i++ ){
                if( imgs[ i ].getAttribute( that._o.srcAttr ) !== null ){
                    that.lzldImages.push( imgs[ i ] );
                    that._u.contentLoaded(window, function(e){
                        // Go ahead and load the images above the fold
                        // Check before each image if it's below the fold
                        
                    });
                }
            }
            
            return that;
        },
        setFlags: function() {
            var that = this;
            that._f.isHighRes = that._u.getPixelRatio() > 1;
        },
        attachEvents: function() {
            // when to loadImage
            // when to resizeImage
            // when to manageImages
        },
        // @var img - dom element to manage
        // @var imageArray Array - array to manage
        // @var adding bool - `true` to add to imageArray; `false` to remove from imageArray
        manageImage: function(img, imageArray, adding) {
            
        },
        loadImage: function() {
            // loop through imagesToLoad
            // getImageSrc
        },
        resizeImage: function() {
            // loop through imagesToResize
            // getImageSrc
        },
        // @var img - dom element
        getImageSrc: function(img) {
            // check if already parsed, else parse it
            // get base filename
            // getCurrentFactoredWidth
        },
        getCurrentFactoredWidth: function() {
            var that = this;
            // that._u.getViewportWidth();
            // 
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
    	// @see: http://stackoverflowindow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
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