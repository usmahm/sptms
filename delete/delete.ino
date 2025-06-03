#include <TinyGPS++.h>
#include <SoftwareSerial.h>

//static const int RXPin = 4, TXPin = 3;
static const int RXPin = 14, TXPin = 12;
static const uint32_t GPSBaud = 9600;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
//SoftwareSerial ss(RXPin, TXPin);

#include <SoftwareSerial.h>

// The serial connection to the GPS module
SoftwareSerial ss(RXPin, TXPin);

void setup(){
  Serial.begin(9600);
  ss.begin(9600);
}

void loop(){
  while (ss.available() > 0){
    // get the byte data from the GPS
    byte gpsData = ss.read();
    Serial.write(gpsData);
  }
}
