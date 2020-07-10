## Introduction

Try our simple [balenaCloud](https://www.balena.io/cloud) starter project to set up a Raspberry Pi and LCD or monitor to display any webpage or web-based dashboard. We’re creatively calling it balenaDash! Follow along with our guide to get up and running in under 30 minutes.

This is the perfect introductory project to try out [balenaCloud](https://www.balena.io/cloud) and see how everything works.

At the most basic level, this project allows you to display any webpage using a lightweight web browser. This means that you can build a device dedicated to showing anything that runs in a normal web browser. It will boot up and automatically start displaying what you choose.

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

We’ve partnered with our friends at [PiSupply](https://pisupp.ly/) to make it easy for you to get ahold of all the hardware you need to build this project in a single package. We’ve created two packages: one that includes everything you’ll need, and a second that includes everything apart from the display for if you’ve already got a monitor you want to use.

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

You can deploy this project to a new balenaCloud application in one click using the button below:
[![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/balenalabs/balena-dash)

Or, you can create an application in your balenaCloud dashboard and `balena push` this code to it the traditional way. Just be aware that balenaDash requires that you allocate more memory to the GPU. This is achieved by adding (or editing the existing) the **Device configuration variable** `RESIN_HOST_CONFIG_gpu_mem`, for this project we recommend setting it to `128`.

### Official Raspberry Pi 7-inch display

If you are using the official [Raspberry Pi 7 inch display](https://www.raspberrypi.org/products/raspberry-pi-touch-display/), you can follow [this tutorial](https://www.balena.io/blog/assembling-the-official-raspberry-pi-touchscreen) to assemble and configure the screen.

Depending on the orientation of the majority of your content or photos, you can choose to have the display in horizontal or vertical mode. On **Fleet Configuration** add a variable called `BALENA_HOST_CONFIG_display_lcd_rotate` with value `2` for horizontal (180º rotation) or `1` for vertical (90º clockwise rotation). More details about the options for this are available [on the Raspberry Pi site](https://www.raspberrypi.org/documentation/configuration/config-txt/video.md).

### Using a PiTFT

The PiTFT LCD screens [from Adafruit (and others)](https://www.adafruit.com/?q=pitft) are supported, too. In order to use these displays you're required to add additional configuration by setting the `BALENA_HOST_CONFIG_dtoverlay` variable within the dashboard. This variable should be set to `pitft35-resistive,rotate=90,speed=32000000,fps=60` for the 3.5" resistive display and `pitft28-resistive,rotate=270,speed=62000000,fps=60` for the 2.8" resistive display. Other displays are also likely to work perfectly, but may need small changes to the configuration variables - we recommend checking the documentation for your particular display.

### For a complete tutorial on how to use balenaDash, please check out our blog post at [https://www.balena.io/blog/make-a-web-frame-with-raspberry-pi-in-30-minutes/](https://www.balena.io/blog/make-a-web-frame-with-raspberry-pi-in-30-minutes/)