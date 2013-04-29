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
            lzldSrcAttr: 'data-lzld-src'
        },
        // Flags
        _f: {},
        lzldImages: [],
        imagesToLoad: [],
        imagesToResize: [],
        initialize: function() {
            var that = this;
            // find all imgs with lzldSrcAttr
            var imgs = document.getElementsByTagName( "img" );
            for( var i = 0, il = imgs.length; i < il; i++ ){
                if( imgs[ i ].getAttribute( that._o.lzldSrcAttr ) !== null ){
                    that.lzldImages.push( imgs[ i ] );
                    // Go ahead and load the images above the fold
                    // Check before each image if it's below the fold
                }
            }
            
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
            this._u.getViewportWidth();
            // 
        }
        // should only be done once and stored on the img
        parseImageFilename: function() {
            // check image parsed
        },
        getViewportWidth: function() {
            
        },
        // set a flag to use high-res
        getViewportResolution: function() {
            
        }
    };
    
    // utility methods that a javascript library might have
    window.LazyloadResponsive._u = {
    	// @see: http://stackoverflowindow.com/questions/3646914/how-do-i-check-if-file-exists-in-jquery-or-javascript
        urlExists: function(url) {
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
        }
    };
    
    window.LazyloadResponsive.init();
    
})(this, document);