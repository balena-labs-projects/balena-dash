from ft5406 import Touchscreen, TS_PRESS, TS_RELEASE, TS_MOVE
import time
import os

ts = Touchscreen()

def touch_handler(event, touch):
    if event == TS_PRESS:
        print("Got Press", touch)
    if event == TS_RELEASE:
        print("Got release", touch)

        # restart counter
        start_time = time.time()
     
for touch in ts.touches:
    touch.on_press = touch_handler
    touch.on_release = touch_handler


ts.run()

start_time = time.time()

while True:
    now = time.time()
    elapsed = now - start_time

    # restart container if time is more than one minute
    if elapsed >= 600:
        start_time = time.time()
        print(now - start_time)
        print("Restarting")
        os.system('curl --header "Content-Type:application/json" "$BALENA_SUPERVISOR_ADDRESS/v2/applications/$BALENA_APP_ID/restart-service?apikey=$BALENA_SUPERVISOR_API_KEY" -d \'{"serviceName": "wpe"}\'')
    try:
        pass
    except KeyboardInterrupt:
        ts.stop()
        exit()