# Photo slideshow feature

One extra feature implemented on balenaDash is the ability to use it to display a photo slideshow. Out of the box you can use [Google Photo Albums](https://photos.google.com), [Dropbox Photo Album](https://www.dropbox.com) and [Apple Photos](https://www.icloud.com/). The images are downloaded automatically and auto updated in case of changes.

The main objective of this project is to create a physical photo album that is easy to build, configure, and maintain. Once configured, there is nothing else you need to worry about. If you edit the album, add new or delete photos, as soon as the device restarts it will be updated with the last changes.

This is the perfect gift for family and friends. Give a smart photo album to your mother or grandmother so that they can keep up with your baby pictures, for example.

## Google Photos Albums

![](https://raw.githubusercontent.com/balena-io-playground/balena-dash-google-photos/master/media/google_photos.gif)

Go to [https://photos.google.com](https://photos.google.com) and select the album that you want to share.

Click in the share button, click in the `Create link` button and copy the the url.
Example: **https://photos.app.goo.gl/rAnDoMvAlUe123**.

## Dropbox Photo Albums

![](https://raw.githubusercontent.com/balena-io-playground/balena-dash-google-photos/master/media/dropbox.gif)

On the [dropbox](https://www.dropbox.com/home) website, go to the folder that contains the photos and click on `Share Folder` and then `Copy link`. This will the URL you will need to add to balenaCloud.

## Apple iCloud Photo Album

Create a photo album and copy the share url, similar to `https://www.icloud.com/sharedalbum/#ALBUM-ID`

## Setting up the photo album

* On balenaCloud, go to **Device variables D(x)** and add the following:

| ENV VAR                 | Description                                                                                                                                           | Options                                        | Default       |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|---------------|
| GALLERY_URL             | Gallery URL for **google photos**, **dropbox images**, or **apple photos**                                                                            |                                                |               |
| GALLERY_SLIDESHOW_DELAY | Slideshow delay in milliseconds                                                                                                                       |                                                | 10000         |
| GALLERY_IMAGE_STYLE     | `Contain` shows the entire image on the screen. `Cover` zooms the image filling the entire screen.                                                    | contain,  cover                                | cover         |
| GALLERY_EFFECT          | Transition effects                                                                                                                                    | fade,  horizontal,  vertical,  kenburns, false | fade          |
| CRON_SCHEDULE           | Cron scheduler to reload images to get changes                                                                                                        |                                                | 0 */12 * * *  |
| SHUFFLE_SLIDESHOW       | Shiffle images to display randomly                                                                                                                    | true, false                                    | false         |
| RESIZE_WIDTH            | * Resize image width or height (larger side) in pixels                                                                                                |                                                | 1000px        |
| COMPRESS_QUALITY        | * Image compression                                                                                                                                   | 0 - 100                                        | 90            |


    * Only available for iCloud photos

Note that after some performance tests on the Raspberry Pi 2 & 3, the combination of `GALLERY_IMAGE_STYLE = contain` and `GALLERY_EFFECT = fade or kenburns` can make the transition effects choppy.

### For a complete tutorial on how to use balenaDash, please check out our blog post at [https://www.balena.io/blog/make-a-web-frame-with-raspberry-pi-in-30-minutes/](https://www.balena.io/blog/make-a-web-frame-with-raspberry-pi-in-30-minutes/)
