
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# Homebridge Balboa Spa Plugin

This plugin will connect some Balboa Spas over their wifi, and expose a set of controls (pumps, lights) and its temperature, and temperature control, in HomeKit.  It also exposes a "Leak Sensor" which acts as a sensor for whether the heater water flow in the spa is all good.

Configure the plugin with Homebridge ConfigUI

## Here is a sample config

```
{
            "name": "My Hot Tub",
            "host": "192.168.1.151",
            "devices": [
                {
                    "name": "Pump 1",
                    "pumpRange": 2,
                    "deviceType": "Pump 1"
                },
                {
                    "name": "Pump 2",
                    "pumpRange": 2,
                    "deviceType": "Pump 2"
                },
                {
                    "name": "Pump 3",
                    "pumpRange": 1,
                    "deviceType": "Pump 3"
                },
                {
                    "name": "Spa Lights",
                    "deviceType": "Lights"
                },
                {
                    "name": "Spa Temperature",
                    "deviceType": "Temperature Sensor"
                },
                {
                    "name": "Temperature Control",
                    "deviceType": "Thermostat"
                },
                {
                    "name": "Flow",
                    "deviceType": "Water Flow Problem Sensor"
                }
            ],
            "platform": "Balboa-Spa"
        }
```

It supports pumps that are single speed (off or high) and 2-speed (off or low or high).

## Limitations?

The "Thermostat" device type exposes control of the spa's target temperature and high (="HEAT" in Home app) vs low (="Off" in Home app), heating mode (flipping between high/low not yet supported).  The Spa's current temperature is visible both in the Thermostat device and in the read-only Temperature Sensor. Up to you if you want/need both devices.

You can control one light and up to 4 pumps. The code does not know how many pumps your spa has - you define that in the items you set up in your config. I believe it would be possible to automate this, given the Balboa Spa app knows it, but am not sure how.

The pumps have a minStep of 50% or 100% depending on their number of speed settings that you define in the config. I think this should work correctly.  Again theoretically I imagine this could be automated.

Lights are simply on/off.  Balboa provide no capability to control the colour.  So this limitation will never be rectified.

The flow sensor has 3 states: normal (all good), failed (which triggers a "leak" alarm - and you should be able to configure Home to send you a notification when this happens), or low water flow which triggers a status fault with the sensor.  This is useful to alert you if filters need cleaning (when they are dirty the flow slows/fails, heating is turned off, and the spa cools down).  The Balboa app doesn't alert you to any problems there, so this capability is very useful. Currently the sensor code only updates once an hour.  So even when you fix the issue (change filters, reset spa, etc) it won't reset in Homekit for some time without you manually restarting homebridge - this could be improved in the code in the future.

## Thanks

The homebridge plugin template project was the basis for this, and some Python code for connecting to balboa helped a lot.  The
node-red/MQTT/Balboa implementation served as some inspiration, but I really wanted something simpler to install and configure, and customise more precisely to deal with things like faults.

My first Typescript or Homebridge project...