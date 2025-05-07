#include <Arduino.h>
#include "gps-module.h"

void setup()
{
  Serial.begin(9600);

  gpssetup();
}

void loop()
{
  gpsloop();
}
