#include <SoftwareSerial.h>

static const int RXPin = 14, TXPin = 12;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

// The serial connection to the GPS module
//SoftwareSerial ss(4, 3);

void setup(){
  Serial.begin(9600);
  ss.begin(9600);

  Serial.println(F("FullExample.ino"));
}

void loop(){
  Serial.println(F("PPPPPPPP"));
  while (ss.available() > 0){
    // get the byte data from the GPS
    byte gpsData = ss.read();
    Serial.write(gpsData);
  }
}
