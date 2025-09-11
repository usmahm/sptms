#pragma once

#include <Arduino.h>

struct LED_Struct {
  int ledPIN;
  int interval;
  int ledState = 0;
  unsigned long previousMillis;

  LED_Struct(int pin, int i) : ledPIN(pin), interval(i), ledState(false), previousMillis(0) {}
};

void initLEDPins(int pins[], int count);

void changeLEDState(LED_Struct &led, int ledState);

void blinkLED(LED_Struct &led);