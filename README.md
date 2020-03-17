![balenaDash](https://www.balena.io/blog/content/images/2019/03/balenaDash_logo.png)

Try our simple [balenaCloud](https://www.balena.io/cloud) starter project to set up a Raspberry Pi and LCD or monitor to display any webpage or web-based dashboard. We’re creatively calling it balenaDash! Follow along with our guide to get up and running in under 30 minutes.

* [Introduction](#introduction)
* [Hardware required](#hardware-required)
* [Using WiFi Connect](#using-wifi-connect)
* [Controlling content](#controlling-content)
* [Automate backlight switching](#automate-backlight-switching)
* [Photo slideshow feature](#photo-slideshow-feature)

## Introduction

This is the perfect introductory project to try out [balenaCloud](https://www.balena.io/cloud) and see how everything works.

At the most basic level, this project allows you to display any webpage using a lightweight web browser. This means that you can build a device dedicated to showing anything that runs in a normal web browser, it will boot up and automatically start displaying what you choose.

Some examples of what you could use this for include:

* [Instagram](https://instagram.com) photo stream (based on hashtag or user)
* Data-centric dashboards using [Grafana](https://grafana.com/) or [Datadog](https://www.datadoghq.com/)
* Live digital photo frame feeding from [Google Photos](https://photos.google.com/)
* Display for services such as [Flightradar24](https://www.flightradar24.com/) or  [Flightaware](https://flightaware.com/)
* Digital [fishtank](http://www.fishgl.com/) or [jellyfish](https://arodic.github.io/p/jellyfish/)
* Streaming webcam display
* 24 hour live [animated cat](http://www.nyan.cat/) display
* [Home automation](https://www.home-assistant.io) dashboard

## Hardware required

We’ve partnered with our friends at [PiSupply](https://pisupp.ly/) to make it easy for you to get ahold of all the hardware you need to build this project in a single package. We’ve created two packages, one that includes everything you’ll need, and a second that includes everything apart from the display for if you’ve already got a monitor you want to use.

* **[balenaDash kit](https://uk.pi-supply.com/products/balenadash-kit)**
* **[balenaDash kit - barebones](https://uk.pi-supply.com/products/balenadash-kit-barebones)**

The list of items you’ll need is also included below:

* Raspberry Pi 3B/3B+ (**Note:** this project will not work with the Pi Zero or older devices with < 1GB RAM)
* 16GB Micro-SD Card (we recommend Sandisk Extreme Pro SD cards)
* Display (any Raspberry Pi display will work for this project)
* Micro-USB cable
* Power supply
* Case (optional)

![](https://www.balena.io/blog/content/images/2018/11/image17.jpg)

## Setup and configuration

Use of balenaDash requires that you allocate more memory to the GPU. This is achieved by adding (or editing the existing) the **Device configuration variable** `RESIN_HOST_CONFIG_gpu_mem`, for this project we recommend setting it to `396`.

### Official Raspberry Pi 7-inch display

If you are using the official [Raspberry Pi 7 inch display](https://www.raspberrypi.org/products/raspberry-pi-touch-display/), you can follow [this tutorial](https://www.balena.io/blog/assembling-the-official-raspberry-pi-touchscreen) to assemble and configure the screen.

Depending on the orientation of the majority of your content or photos, you can choose to have the display in horizontal or vertical mode. On **Fleet Configuration** add a variable called `BALENA_HOST_CONFIG_display_lcd_rotate` with value `2` for horizontal (180º rotation) or `1` for vertical (90º clockwise rotation). More details about the options for this are available [on the Raspberry Pi site](https://www.raspberrypi.org/documentation/configuration/config-txt/video.md).

### Using a PiTFT

The PiTFT LCD screens [from Adafruit (and others)](https://www.adafruit.com/?q=pitft) are supported, too. In order to use these displays you're required to add additional configuration by setting the `BALENA_HOST_CONFIG_dtoverlay` variable within the dashboard. This variable should be set to `pitft35-resistive,rotate=90,speed=32000000,fps=60` for the 3.5" resistive display and `pitft28-resistive,rotate=270,speed=62000000,fps=60` for the 2.8" resistive display. Other displays are also likely to work perfectly, but may need small changes to the configuration variables - we recommend checking the documentation for your particular display.

## Using WiFi Connect

The balenaDash project includes [wifi-connect](https://github.com/balena-io/wifi-connect) which enables your device to operate as a WiFi access point and allow you to join a different WiFi network using captive portal functionality. Although you can specify a WiFi network to join when you first add your device and download the image from the balenaCloud dashboard, there may be situations where you need to change that.

WiFi Connect periodically tests for a functional internet connection, if nothing is found the device sets itself up as a WiFi access point named `balenaDash` that you can join with a mobile device.

To use WiFi Connect you need to join the `balenaDash` network and you should see a captive portal popup. The passphrase is `balenaDash`. If not, ensure that you remain connected to the `balenaDash` network and visit the IP address of the device in a browser on port `80`. For example `http://<ip of balenaDash device>`. This will allow you to access WiFi Connect, perform a site survey and join a different WiFi network.

## Controlling content

### Loading a URL

To configure the URL displayed by webkit, set the **`LAUNCH_URL`** environment
variable. If nothing is set, balenaDash will display the balenaOS logo on the screen.

### Switching URLs quickly using your web browser or Slack

Your balenaDash device is also running a small webserver on port 8080. The screen will show the URL configured at `LAUNCH_URL` normally, but the webserver allows you to put other URLs on screen quickly and easily. If you tell balenaCloud to expose your device's public URL, then you can even control it with Slack (or `curl`, or anything that can use webhooks).  [More details](https://github.com/mozz100/tohora/blob/master/README.md)

## Automate backlight switching

To use automatic backlight switching you’ll need to configure a few service variables for the scheduler service.

`ENABLE_BACKLIGHT_TIMER=1`
`BACKLIGHT_ON=0 8 * * *`
`BACKLIGHT_OFF=0 23 * * *`

The `BACKLIGHT_ON` and `BACKLIGHT_OFF` variables accept standard cron syntax; take a look at https://crontab.guru if you’re not familiar. For more instructions check out [our blog post](https://www.balena.io/blog/automate-the-backlight-timer-on-your-balenadash-display/).

To change the timezone for the scheduler, set the `TZ` service variable to something from the [TZ database list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

## Photo slideshow feature

One extra feature implemented on balenaDash is the ability to use it to display a photo slideshow. Out of the box you can use [Google Photo Albums](https://photos.google.com), [Dropbox Photo Album](https://www.dropbox.com) and [Apple Photos](https://www.icloud.com/). The images are downloaded automatically and auto updated in case of changes.

The main objective of this project is to create a physical photo album that is easy to build, configure, and maintain. Once configured, there is nothing else you need to worry about. If you edit the album, add new or delete photos, as soon as the device restarts it will be updated with the last changes.

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

### For a complete tutorial on how to use balenaDash, please check out our blog post at [https://www.balena.io/blog/make-a-web-frame-with-raspberry-pi-in-30-minutes/](https://www.balena.io/blog/make-a-web-frame-with-raspberry-pi-in-30-minutes/)
