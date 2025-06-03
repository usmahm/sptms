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
const unsigned long sendInterval = 20000; // 10 seconds in milliseconds

void loop()
{
  gpsloop();

  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= sendInterval){
    // create_bus_node_auto_id();
    location locationData = getLocation(); 
    sendLocationData(locationData);
  }

  firebaseLoop();
  // sendLocationData(locationData);
  // sendLocationData();
}
