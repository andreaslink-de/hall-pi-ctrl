# Hall-pi control

Turns on/off rpi HDMI display on mqtt messages.

# Install

   $ git clone https://github.com/etobi/hall-pi-ctrl.git
   $ cd hall-pi-ctrl
   $ npm install

## /etc/rc.local

    sudo vcgencmd display_power 0
    sudo bash -c "cd /home/pi/hall-pi-ctrl ; /usr/bin/npm start > /var/log/hall-pi-ctrl.log 2>&1 &"


