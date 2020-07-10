# Customization

## Using WiFi Connect

The balenaDash project includes [wifi-connect](https://github.com/balena-io/wifi-connect) which enables your device to operate as a WiFi access point and allow you to join a different WiFi network using captive portal functionality. Although you can specify a WiFi network to join when you first add your device and download the image from the balenaCloud dashboard, there may be situations where you need to change that.

WiFi Connect periodically tests for a functional internet connection. If nothing is found, the device sets itself up as a WiFi access point named `balenaDash` that you can join with a mobile device.

To use WiFi Connect you need to join the `balenaDash` network and you should see a captive portal popup. The passphrase is `balenaDash`. If not, ensure that you remain connected to the `balenaDash` network and visit the IP address of the device in a browser on port `80`. For example `http://<ip of balenaDash device>`. This will allow you to access WiFi Connect, perform a site survey and join a different WiFi network.

## Controlling content

### Loading a URL

To configure the URL displayed by webkit, set the **`LAUNCH_URL`** environment
variable. If nothing is set, balenaDash will display the balenaOS logo on the screen.

### Switching URLs quickly using your web browser or Slack

Your balenaDash device is also running a small webserver on port 8080. The screen will show the URL configured at `LAUNCH_URL` normally, but the webserver allows you to put other URLs on screen quickly and easily. If you tell balenaCloud to expose your device's public URL, then you can even control it with Slack (or `curl`, or anything that can use webhooks). [More details](https://github.com/mozz100/tohora/blob/master/README.md)

## Automate backlight switching

To use automatic backlight switching you’ll need to configure a few service variables for the scheduler service.

`ENABLE_BACKLIGHT_TIMER=1`
`BACKLIGHT_ON=0 8 * * *`
`BACKLIGHT_OFF=0 23 * * *`

The `BACKLIGHT_ON` and `BACKLIGHT_OFF` variables accept standard cron syntax; take a look at https://crontab.guru if you’re not familiar. For more instructions check out [our blog post](https://www.balena.io/blog/automate-the-backlight-timer-on-your-balenadash-display/).

To change the timezone for the scheduler, set the `TZ` service variable to something from the [TZ database list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

## Photo slideshow feature

One extra feature implemented on balenaDash is the ability to use it to display a photo slideshow. Out of the box you can use [Google Photo Albums](https://photos.google.com), [Dropbox Photo Album](https://www.dropbox.com) and [Apple Photos](https://www.icloud.com/). The images are downloaded automatically and auto updated in case of changes.

The main objective of this project is to create a physical photo album that is easy to build, configure, and maintain. Once configured, there is nothing else you need to worry about. If you edit the album, add new or delete photos, as soon as the device restarts, it will be updated with the last changes.

This is the perfect gift for family and friends. Give a smart photo album to your mother or grandmother so that they can keep up with your baby pictures, for example.

#### Google Photos Albums

![](https://raw.githubusercontent.com/balena-io-playground/balena-dash-google-photos/master/media/google_photos.gif)

Go to [https://photos.google.com](https://photos.google.com) and select the album that you want to share.

Click in the share button, click in the `Create link` button and copy the the url.
Example: **https://photos.app.goo.gl/rAnDoMvAlUe123**.

#### Dropbox Photo Albums

![](https://raw.githubusercontent.com/balena-io-playground/balena-dash-google-photos/master/media/dropbox.gif)

On the [dropbox](https://www.dropbox.com/home) website, go to the folder that contains the photos and click on `Share Folder` and then `Copy link`. This will the URL you will need to add to balenaCloud.

#### Apple iCloud Photo Album

Create a photo album and copy the share url, similar to `https://www.icloud.com/sharedalbum/#ALBUM-ID`

#### USB drive Photo Album

Place your photos on a USB stick and plug it into the Raspberry Pi. Each time all previous existing photos will be removed and replaced by the new ones.
- Set ```GALLERY_URL``` to ```USBDRIVE``` to use this mode.
- Make sure to update ```CRON_SCHEDULE``` accordingly or else image changes will only be picked up at reboot.


#### Setting up the photo album

* On balenaCloud, go to **Device variables D(x)** and add the following:

| ENV VAR                 | Description                                                                                                                                           | Options                                        | Default       |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|---------------|
| GALLERY_URL             | Gallery URL for **google photos**, **dropbox images**, **apple photos** or **usb drive**.                                                                             |                                                |               |
| GALLERY_SLIDESHOW_DELAY | Slideshow delay in milliseconds                                                                                                                       |                                                | 10000         |
| GALLERY_IMAGE_STYLE     | `Contain` shows the entire image on the screen. `Cover` zooms the image filling the entire screen.                                                    | contain,  cover                                | cover         |
| GALLERY_EFFECT          | Transition effects                                                                                                                                    | fade,  horizontal,  vertical,  kenburns, false | fade          |
| CRON_SCHEDULE           | Cron scheduler to reload images to get changes                                                                                                        |                                                | 0 */12 * * *  |
| SHUFFLE_SLIDESHOW       | Shiffle images to display randomly                                                                                                                    | true, false                                    | false         |
| RESIZE_WIDTH            | * Resize image width or height (larger side) in pixels                                                                                                |                                                | 1000px        |
| COMPRESS_QUALITY        | * Image compression                                                                                                                                   | 0 - 100                                        | 90            |


    * Only available for iCloud photos

Note that after some performance tests on the Raspberry Pi 2 & 3, the combination of `GALLERY_IMAGE_STYLE = contain` and `GALLERY_EFFECT = fade or kenburns` can make the transition effects choppy.