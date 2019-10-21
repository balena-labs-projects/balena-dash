## Setup and configuration

Use of balenaDash requires that you allocate more memory to the GPU. This is achieved by adding (or editing the existing) the **Device configuration variable** `RESIN_HOST_CONFIG_gpu_mem`, for this project we recommend setting it to `396`.

### Official Raspberry Pi 7-inch display

If you are using the official [Raspberry Pi 7 inch display](https://www.raspberrypi.org/products/raspberry-pi-touch-display/), you can follow [this tutorial](https://www.balena.io/blog/assembling-the-official-raspberry-pi-touchscreen) to assemble and configure the screen.

Depending on the orientation of the majority of your content or photos, you can choose to have the display in horizontal or vertical mode. On **Fleet Configuration** add a variable called `BALENA_HOST_CONFIG_display_lcd_rotate` with value `2` for horizontal (180º rotation) or `1` for vertical (90º clockwise rotation). More details about the options for this are available [on the Raspberry Pi site](https://www.raspberrypi.org/documentation/configuration/config-txt/video.md).
