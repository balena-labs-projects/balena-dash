# Controlling content

## Loading a URL

To configure the URL displayed by webkit, set the **`LAUNCH_URL`** environment
variable. If nothing is set, balenaDash will display the [browser block](https://github.com/balenablocks/browser#choosing-what-to-display) local webpage.

## Switching URLs quickly using your web browser or Slack

Your balenaDash device is also running a small webserver on port 8080. The screen will show the URL configured at `LAUNCH_URL` normally, but the webserver allows you to put other URLs on screen quickly and easily. If you tell balenaCloud to expose your device's public URL, then you can even control it with Slack (or `curl`, or anything that can use webhooks). [More details](https://github.com/mozz100/tohora/blob/master/README.md)

## Accessing your balenaDash remotely

Devices on balenaCloud use the platform's built in VPN and can be assigned a public URL for remote access. Click into your application, and then into the device, and turn on the `Public Device URL` option. You can use that URL to access the balenaDash service on your device. Learn more about the Public Device URL feature [here](https://www.balena.io/docs/learn/manage/actions/#enable-public-device-url).