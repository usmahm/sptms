#include "led.h"

void initLEDPins(int pins[], int count) {
  for (int i = 0; i < count; i++) {
    pinMode(pins[i], OUTPUT);
  }
}

void changeLEDState(LED_Struct &led, int ledState) {
  digitalWrite(led.ledPIN, ledState);
  led.ledState = ledState;
};

void blinkLED(LED_Struct &led) {
  unsigned long currentMillis = millis();

  if (currentMillis - led.previousMillis >= led.interval) {
    led.previousMillis = currentMillis;
    led.ledState = !led.ledState;

    digitalWrite(led.ledPIN, led.ledState);
  }
}
