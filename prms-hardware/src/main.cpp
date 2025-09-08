#include <Arduino.h>

#include <WiFi.h>

#include "customWifi.h"
#include "gps-module.h"
#include "led.h"
#include "env.h"
#include "api.h"


int pins[2] = {POWER_INDICATOR, GPS_INDICATOR};
LED_Struct powerIndicator(POWER_INDICATOR, 500);
LED_Struct sdsd(GPS_INDICATOR, 1000);

void setup()
{
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  delay(100);

  apiSetup();
  initLEDPins(pins, 2);
  changeLEDState(powerIndicator, 1);

  initializeWifi();
  gpssetup();
}

unsigned long lastSendTime = 0;
unsigned long lastGpsReadTime = 0;
unsigned long currentTime = 0;

void loop()
{
  currentTime = millis();

  gpsloop();
  
  if (currentTime - lastGpsReadTime > 1000) {
    getLocation();
    lastGpsReadTime = currentTime;
  }

  if (locationUpdated && (currentTime - lastSendTime >= 10000)) {
    sendLocationData(locationData);
    
    lastSendTime = currentTime;
    locationUpdated = false;
  }
}
