#!/bin/bash

echo "--- udev-plug-usb rule triggered ---" >> /usr/src/app/usb.log
echo "$(date) $(ls -1 | wc -l)" >> /usr/src/app/usb.log
echo "Serial id is $ID_SERIAL" >> /usr/src/app/usb.log
echo "Usec id is $USEC_INITIALIZED" >> /usr/src/app/usb.log
echo "Vendor id is $ID_VENDOR" >> /usr/src/app/usb.log
echo "File system type $ID_FS_TYPE" >> /usr/src/app/usb.log

# Mount device
if findmnt -rno SOURCE,TARGET $DEVNAME >/dev/null; then
    echo "Device $DEVNAME is already mounted!" >> /usr/src/app/usb.log
else
    echo "Mounting device: $DEVNAME" >> /usr/src/app/usb.log
    echo "Mounting destination: /mnt/storage-$USEC_INITIALIZED" >> /usr/src/app/usb.log    
    mkdir -p /mnt/storage-$USEC_INITIALIZED >> /usr/src/app/usb.log
    mount -t $ID_FS_TYPE -o rw $DEVNAME /mnt/storage-$USEC_INITIALIZED >> /usr/src/app/usb.log
fi

# Sync files
echo "Sync: /mnt/storage-$USEC_INITIALIZED" >> /usr/src/app/usb.log
rsync -a --delete /mnt/storage-$USEC_INITIALIZED/ /usbstorage >> /usr/src/app/usb.log

# Unmount device
if findmnt -rno SOURCE,TARGET $DEVNAME >/dev/null; then
    echo "Unmounting device: $DEVNAME" >> /usr/src/app/usb.log
    umount -f $DEVNAME
else
    echo "No deviced named $DEVNAME was found." >> /usr/src/app/usb.log
fi
