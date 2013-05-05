lazyload-responsive
===================

If you're lazyloading images, you might as well add features to load responsive images while you're at it

## What you get

- TBD :)


## How it works
### Responsive

	<img data-lzld-src="real-image-src.jpg" src="" />


- It loads larger images as viewport is resized larger.
- Will not load smaller images as viewport is resized smaller unless it has the `data-lzld-smaller` attribute. Sometimes, when images are shrunk they lose the impact they have because you can't see anything in them. So for some images, you may have a cropped version you'd like to use for a smaller viewport. In such a case, remember to add the `data-lzld-smaller` attribute.
- You set the lzldWidthfactor (default is 200). Then onload and window resize, the script will check for largest image that's less than the current viewport width. 
	- Images are resized up by default to save bandwidth. To resize an image down (load an image just larger than current viewport width), include `data-resize-down` attribute. 
	- For example, the viewport width is 768px. 
		- The script looks for (via ajax request) for real-image-src_600.jpg (or real-image-src_600@2x.jpg for high-res displays). 
		- If the above file doesn't exist, it will load the original: real-image-src.jpg (or real-image-src@2x.jpg for high-res).
		- When the viewport is less than the imageWidthFactor, it will look for real-image-src_small.jpg (or real-image-src_small@2x.jpg) before loading the original image
		 


### Lazyload

I will pull some ideas from [https://github.com/fasterize/lazyload](https://github.com/fasterize/lazyload) for a library-agnostic/raw javascript/standalone lazyloading experience. 

## TODO

- do something about images being requested while other images are loading
	- perhaps use some sort of promise-type OnReadyStateChange with the urlExists method so images aren't being requested while others are being loaded
- Optimize when everything gets initilized and isolate the things that need dom loaded
- Do Roadmap

## Roadmap

- Rewrite this with coffeescript to prepare for plugins
- Create a jquery plugin version

## How to Contribute

1. run `npm install` which will concatenate and minify the distribution files
- send me a pull request