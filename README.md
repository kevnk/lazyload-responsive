lazyload-responsive
===================

If you're lazyloading images, might as well add features to load responsive images while you're at it

## What you get

- TBD :)


## How it works
### Responsive

	<img data-lzld-src="real-image-src.jpg" src="" />


- It loads larger images as viewport is resized larger.
- Will not load smaller images as viewport is resized smaller unless it has the `data-lzld-smaller` attribute. Sometimes, when images are shrunk they lose the impact they have because you can't see anything in them. So for some images, you may have a cropped version you'd like to use for a smaller viewport. In such a case, remember to add the `data-lzld-smaller` attribute.
- You set the imageWidthFactor (default is 200).
- Onload and window resize, the script will check for largest image that's less than the current viewport width. Images are resized up by default to save bandwidth. To resize an image down (load an image just larger than current viewport width), include `data-resize-down` attribute. 


### Lazyload

I will pull some ideas from [https://github.com/fasterize/lazyload](https://github.com/fasterize/lazyload) for a library-agnostic/raw javascript/standalone lazyloading experience. 


## Roadmap

It would be nice to create a library-agnostic/raw javascript/standalone version and a jquery plugin version.