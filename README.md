lazyload-responsive
===================

If you're lazyloading images, you might as well add features to load responsive images while you're at it

## What you get

- Lazyloading images
- High impact responsive images (don't just resize the image, use a smaller, cropped image to keep the design impact of the image)
- High-Res support
- Lots of options


## How it works
### Responsive

**Markup**

	<img data-lzld-src="path/to/real-image-src.jpg" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
	<noscript>
		<img src="path/to/real-image-src.jpg" />
	</noscript>

**Options**

**srcAttr**: 'data-lzld-src', // the attribute the script uses to find images to lazyload-respond to  
**offset**: 200, // distance (px) below the fold where images will be loaded  
**highResThreshold**: 1.5, // any pixel ratio >= this number will be flagged as high-res  
**throttleInterval**: 20, // throttled interval for scroll and resize events  
**useGlobalImgConfig**: false, // if `false`, the script will look for the following imgConfig on each lzld img (e.g. img.getAttribute('data-lzld-highressuffix') || imgConfig.highressuffix - which takes the script longer to process); setting to `true` is the fastest option  
**findSmallerImgs**: true, // forces script to look for and load smaller images as viewport is resized to a smaller size  
**highressuffix**: '@2x', // e.g. imagename@2x.jpg or imagename_400@2x.jpg would be the high-res images  
**longfallback**: true, // will look for all smaller images before loading the original (and largest image)  
**lowres**: false, // forces script to **not** look for high-res images  
**sizedown**: false, // by default images are sized up; this option forces it to get an image larger than the viewport and shrink it; NOTE: setting to `true` will load larger images and increase pageload  
**widthfactor**: 200 // looks for images with the following naming convention [real-image-src]_[factor of widthfactor].[file-extenstion]  

**Options in progress**

**loadevent**: ['scroll','resize'], // you may want to load the images on a custom event; this is where you do that


**Process**

- You make images for different breakpoimts (default is every 200px: see `widthfactor` option).
	- So you've created your set of images: `real-image-src_smaller.jpg`, `real-image-src_200.jpg`, `real-image-src_400.jpg`, `real-image-src_600.jpg`, and `real-image-src.jpg`
	- Then when the viewport is resized to somewhere between 601px and 800px: 
		- The script looks for (via ajax request) for real-image-src_600.jpg (or real-image-src_600@2x.jpg for high-res displays). 
		- If that file doesn't exist and you have the `longfallback` option set to `true`, it will continue to check for `real-image-src_400.jpg`, `real-image-src_200.jpg`, and `real-image-src_smaller.jpg` before finally falling back to the original: real-image-src.jpg (or real-image-src@2x.jpg for high-res).
		- If the `longfallback` option is set to `false`, it falls back to `real-image-src_smaller.jpg` (or `real-image-src_smaller@2x.jpg` for high-res) before looking for the original: real-image-src.jpg (or real-image-src@2x.jpg for high-res).


### Lazyload

With some ideas from [https://github.com/fasterize/lazyload](https://github.com/fasterize/lazyload), you get images loaded just below the fold. You can set the distance below the fold at which images are loaded with the `offset` option.


## TODO

- add ability to load/resize images with a declared custom event
- drop grunt and add coffee-script and CakeFile
- Do roadmap

## Roadmap

- Rewrite this with coffeescript to prepare for plugins
- Create a jquery plugin version

## How to Contribute

1. run `npm install` which will concatenate and minify the distribution files
- send me a pull request