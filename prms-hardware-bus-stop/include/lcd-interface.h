#pragma once

#include <Arduino.h>
#include <LiquidCrystal_I2C.h>

void lcdSetup();

void scrollTextV(int rowStart, int rowEnd, String messages[], int messagesLength, int delayTime);

void displayBusStopData(String data[], int dataLength);

String formatLCDBusRow(String time, String stop, String busId);