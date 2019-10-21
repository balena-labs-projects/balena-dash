## Using WiFi Connect

The balenaDash project includes [wifi-connect](https://github.com/balena-io/wifi-connect) which enables your device to operate as a WiFi access point and allow you to join a different WiFi network using captive portal functionality. Although you can specify a WiFi network to join when you first add your device and download the image from the balenaCloud dashboard, there may be situations where you need to change that.

WiFi Connect periodically tests for a functional internet connection, if nothing is found the device sets itself up as a WiFi access point named `balenaDash` that you can join with a mobile device.

To use WiFi Connect you need to join the `balenaDash` network and you should see a captive portal popup. The passphrase is `balenaDash`. If not, ensure that you remain connected to the `balenaDash` network and visit the IP address of the device in a browser on port `80`. For example `http://<ip of balenaDash device>`. This will allow you to access WiFi Connect, perform a site survey and join a different WiFi network.