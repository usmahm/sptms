#include "gps-module.h"

#define RXD2 16
#define TXD2 17
static const uint32_t GPSBaud = 9600;

location locationData = {"", "", ""};
bool locationUpdated = false;

HardwareSerial gpsSerial(2);

TinyGPSPlus gps;


void gpssetup() {
  gpsSerial.begin(GPSBaud, SERIAL_8N1, RXD2, TXD2);

  Serial.println("Serial 2 started at 9600 baud rate");
};

void getLocation()
{
  if (gps.location.isValid() && gps.date.isValid()) {
    if (gps.location.isUpdated() && gps.date.isUpdated()) {
      locationData.lat = String(gps.location.lat(), 8);
      locationData.lng = String(gps.location.lng(), 8);
      String time = String(gps.date.year()) + "/" + String(gps.date.month()) + "/" + String(gps.date.day()) + "," + String(gps.time.hour()) + ":" + String(gps.time.minute()) + ":" + String(gps.time.second());
      locationData.time = time;
  
      locationUpdated = true;
    } else {
      Serial.print("LOCATION DATA NOT UPDATED");
    }
  } else {
    Serial.print("INVALID LOCATION DATA");
  }
}


void gpsloop()
{
  while (gpsSerial.available() > 0)
    gps.encode(gpsSerial.read());

  if (millis() > 5000 && gps.charsProcessed() < 10)
    Serial.println(F("No GPS data received: check wiring"));
}
