#pragma once

#include <Arduino.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>


extern HardwareSerial gpsSerial;

struct location {
   String lat;
   String lng;
   String time;
   // int hdop;
   // int satellites;
};

extern location locationData;
extern bool locationUpdated;

void gpssetup();

void gpsloop();



void getLocation(); 
