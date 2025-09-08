#include <Arduino.h>
#include "lcd-interface.h"
#include "customWifi.h"
#include "api.h"
#include "led.h"

int pins[1] = {POWER_INDICATOR};
LED_Struct powerIndicator(POWER_INDICATOR, 500);

void setup(){
  Serial.begin(115200);
  initializeWifi();
  lcdSetup();

  initLEDPins(pins, 1);
  changeLEDState(powerIndicator, 1);
}

void loop(){
  fetchOngoingTrips();

  displayBusStopData(busStopData, dataLength);
  delay(5000);
}

// // int LEDpin = 25;
// int delayT = 1000;
// // int pins[2] = {POWER_INDICATOR, GPS_INDICATOR};
// int pins[1] = {POWER_INDICATOR};
// void setup() {
//   initPins(pins, 1);
// }

// LED_Struct powerIndicator(POWER_INDICATOR, 500);
// // LED_Struct gpsIndicator(GPS_INDICATOR, 1000);

// void loop() {
//   blinkLED(powerIndicator);
//   // blinkLED(gpsIndicator);
//   // digitalWrite(LEDpin, HIGH);
//   // delay(delayT);
//   // digitalWrite(LEDpin, LOW);
//   // delay(delayT);
// }
