/*
 * lazyload-responsive
 * https://github.com/kevinkirchner/lazyload-responsive
 *
 * Copyright (c) 2013 Kevin Kirchner
 * Licensed under the MIT license.
 */

!(function($, window, undefined) {
    
    "use strict"
    
    /* LAZYLOADRESPONSIVE PUBLIC CLASS DEFINITION
     * ========================================== */
    
    var LazyloadResponsive = function( element, options ) {
        this.init(element, options);
    };
    
    LazyloadResponsive.prototype = {
        constructor: LazyloadResponsive,
        init: function( element, options ) {
            this.$element = $(element);
            this.options = this.getOptions(options);
        },
        getOptions: function( options ) {
            return $.extend({}, $.fn.lazyloadResponsive.defaults, options, this.$element.data());
        }
    };
    
    /* LAZYLOADRESPONSIVE PLUGIN DEFINITION 
     * ==================================== */
    
    // Collection method
    $.fn.lazyloadResponsive = function( option ) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('lzldrspv')
              , options = typeof option == 'object' && option
            if (!data) $this.data('lzldrspv', (data = new LazyloadResponsive(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.lazyloadResponsive.Constructor = LazyloadResponsive;

    // Static method default options.
    $.fn.lazyloadResponsive.defaults = {
        srcAttr: 'data-lzld-src',
        offset: 200, // distance (px) below the fold where images will be loaded
        highResThreshold: 1.5, // any pixel ratio >= this number will be flagged as high-res
        throttleInterval: 20, // throttled interval for scroll and resize events
        useGlobalImgConfig: false, // if `false`, the script will look for the following imgConfig on each lzld img (e.g. img.getAttribute('data-lzld-highressuffix') || imgConfig.highressuffix - which takes the script longer to process); setting to `true` is the fastest option
        findSmallerImgs: true, // forces script to look for and load smaller images as viewport is resized to a smaller size
        imgConfig: {
            highressuffix: '@2x', // e.g. imagename@2x.jpg or imagename_400@2x.jpg would be the high-res images
            loadevent: ['scroll','resize'], // you may want to load the images on a custom event; this is where you do that
            longfallback: true, // will look for all smaller images before loading the original (and largest image)
            lowres: false, // forces script to **not** look for high-res images
            sizedown: false, // by default images are sized up; this option forces it to get an image larger than the viewport and shrink it; NOTE: setting to `true` will load larger images and increase pageload
            widthfactor: 200 // looks for images with the following naming convention [real-image-src]_[factor of widthfactor].[file-extenstion]
        }
    };
    
    /* LAZYLOADRESPONSIVE DATA API
     * =========================== */
    
    $(function () {
        // Onload
        // Scroll
        // Resize
    /*
        $('body').on(function (e) {
            var $this = $(this);
            if ($this.data('lzldrspv')) return;
            e.preventDefault();
            $this.lazyloadResponsive($this.data());
        })
    */
    });

}(jQuery, this));
