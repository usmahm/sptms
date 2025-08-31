#include <Arduino.h>

#include <WiFi.h>

#include "customWifi.h"
#include "gps-module.h"
#include "api.h"

void setup()
{
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  delay(100);

  initializeWifi();
  gpssetup();
}


void loop()
{
  gpsloop();

  getLocation();
  if (locationUpdated) {
    sendLocationData(locationData);

    locationUpdated = false;
  }

  delay(30000);
}



