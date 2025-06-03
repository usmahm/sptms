#include "gps-module.h"

static const int RXPin = 14, TXPin = 12;
static const uint32_t GPSBaud = 9600;

SoftwareSerial ss(RXPin, TXPin);

// The TinyGPSPlus object
TinyGPSPlus gps;


void gpssetup() {
  ss.begin(GPSBaud);

  Serial.println(F("FullExample.ino"));
};

location getLocation()
{
  location locationData;

  locationData.lat = gps.location.lat();
  locationData.lng = gps.location.lng();

  return locationData;
}

// void sendLocationData(location locationData)
// {
//   sendData<location>(locationData, "/path", "Send_Location");
// }


void gpsloop()
{
  // static const double LONDON_LAT = 51.508131, LONDON_LON = -0.128002;
  
  smartDelay(1000);

  if (millis() > 5000 && gps.charsProcessed() < 10)
    Serial.println(F("No GPS data received: check wiring"));
}

// This custom version of delay() ensures that the gps object
// is being "fed".
void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}
