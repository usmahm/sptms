#pragma once

#include <Arduino.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include "firebase-interface.h"

/*
   This sample code demonstrates the normal use of a TinyGPSPlus (TinyGPSPlus) object.
   It requires the use of SoftwareSerial, and assumes that you have a
   4800-baud serial GPS device hooked up on pins 4(rx) and 3(tx).
*/
// static const int RXPin = 4, TXPin = 3;
// static const uint32_t GPSBaud = 4800;

// // The TinyGPSPlus object
// TinyGPSPlus gps;

// The serial connection to the GPS device
// SoftwareSerial ss(RXPin, TXPin);



extern SoftwareSerial ss;

struct location {
   int lat;
   int lng;
};

void gpssetup();

void gpsloop();


// This custom version of delay() ensures that the gps object
// is being "fed".
void smartDelay(unsigned long ms);

location getLocation(); 

void sendLocationData(location locationData);


// void printFloat(float val, bool valid, int len, int prec);

// void printInt(unsigned long val, bool valid, int len);

// void printDateTime(TinyGPSDate &d, TinyGPSTime &t);

// void printStr(const char *str, int len);
