#include "gps-module.h"
#include "led.h"

#define RXD2 16
#define TXD2 17
static const uint32_t GPSBaud = 9600;

location locationData = {"", "", ""};
bool locationUpdated = false;

unsigned long lastReceived = 0;

HardwareSerial gpsSerial(2);

TinyGPSPlus gps;

LED_Struct gpsIndicator(GPS_INDICATOR, 300);

void gpssetup() {
  gpsSerial.begin(GPSBaud, SERIAL_8N1, RXD2, TXD2);

  Serial.println("Serial 2 started at 9600 baud rate");
};

void getLocation()
{
  if (gps.location.isValid() && gps.date.isValid()) {
    if (gpsIndicator.ledState == 0) {
      changeLEDState(gpsIndicator, 1);
    }

    // Don't block getting location here,
    // Call to this function should always get location
    // handle delay outside
    // if (gps.location.isUpdated() && gps.date.isUpdated()) {
      locationData.lat = String(gps.location.lat(), 8);
      locationData.lng = String(gps.location.lng(), 8);
      String time = String(gps.date.year()) + "/" + String(gps.date.month()) + "/" + String(gps.date.day()) + "," + String(gps.time.hour()) + ":" + String(gps.time.minute()) + ":" + String(gps.time.second());
      locationData.time = time;
  
      locationUpdated = true;

      Serial.print(locationData.lat);
      Serial.print(" ");
      Serial.println(locationData.lng);
    // } else {
    //   Serial.println("LOCATION DATA NOT UPDATED");
    // }
  } else {
    // gpsIndicator.interval = 500;
    blinkLED(gpsIndicator);
    // Serial.println("INVALID LOCATION DATA");
  }
}



void gpsloop()
{
  // boolean isGPSConnected = false;

  while (gpsSerial.available() > 0) {

    gps.encode(gpsSerial.read());
    lastReceived = millis();
    // isGPSConnected = true;
  }

  if (millis() > 2000 && gps.charsProcessed() < 10) {
    Serial.println(F("No GPS data received: check wiring"));
    // gpsIndicator.interval = 300;
    // isGPSConnected = false;
    // blinkLED(gpsIndicator);
  }

  // return isGPSConnected;
}
