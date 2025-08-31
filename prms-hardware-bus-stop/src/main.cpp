#include <Arduino.h>
#include "lcd-interface.h"
#include "customWifi.h"
#include "api.h"

void setup(){
  Serial.begin(115200);

  initializeWifi();


  lcdSetup();
}

// const int MAX_BUSES = 15;

// int dataLength = 0;
// String busStopData[MAX_BUSES];
// String busStopData[10] = {
// //12345678912345678912 
//  "12:03 SUB       B_01",
//  "01:12 SUB       B_02",
//  "03:23 SUB       B_03",
//  "04:30 SUB       B_04",
//  "20:20 SUB       B_05",
//  "22:20 SUB       B_06",
//  "23:20 SUB       B_07",
// };

void loop(){
  fetchBusNodes();

  displayBusStopData(busStopData, dataLength);
  delay(5000);
}