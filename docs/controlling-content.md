# Controlling content

## Loading a URL

To configure the URL displayed by webkit, set the **`WPE_URL`** environment
variable. If nothing is set, balenaDash will display the balenaOS logo on the screen.

## Switching URLs quickly using your web browser or Slack

Your balenaDash device is also running a small webserver on port 8080. The screen will show the URL configured at `WPE_URL` normally, but the webserver allows you to put other URLs on screen quickly and easily. If you tell balenaCloud to expose your device's public URL, then you can even control it with Slack (or `curl`, or anything that can use webhooks).  [More details](https://github.com/mozz100/tohora/blob/master/README.md)