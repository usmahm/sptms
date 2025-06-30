#include <Arduino.h>
#include "gps-module.h"
#include "firebase-interface.h"

void setup()
{
  Serial.begin(9600);

  firebaseSetup();
  gpssetup();
}

// Timer variables for sending data every 10 seconds
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10; // 10 seconds in milliseconds

void loop()
{
  gpsloop();

  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= sendInterval){
    lastSendTime = currentTime;
    if (getLocation()) {
      Serial.println(locationData.lat);
      sendLocationData(locationData);
    }
  }

  firebaseLoop();
}


// #include <SoftwareSerial.h>

// static const int RXPin = 14, TXPin = 12;

// // The serial connection to the GPS device
// SoftwareSerial sss(RXPin, TXPin);

// // The serial connection to the GPS module
// //SoftwareSerial sss(4, 3);

// void setup(){
//   Serial.begin(9600);
//   sss.begin(9600);

//   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//   Serial.print("Connecting to Wi-Fi");
//   while (WiFi.status() != WL_CONNECTED)    {
//     Serial.print(".");
//     delay(300);
//   }
//   // Serial.println(F("FullExample.ino"));
// }

// void loop(){
//   // Serial.println(F("PPPPPPPP"));
//   while (sss.available() > 0){
//     // get the byte data from the GPS
//     byte gpsData = sss.read();
//     Serial.write(gpsData);
//   }
// }