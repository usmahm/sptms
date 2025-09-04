#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "lcd-interface.h"
#include "env.h"

const int MAX_DATA_LENGTH = 15;

extern int dataLength;
extern String busStopData[MAX_DATA_LENGTH];

void apiSetup();

String httpGETRequest(String apiURL);

String httpPOSTRequest(String apiURL, String payload);

String httpPATCHRequest(String apiURL, String payload);

bool fetchOngoingTrips();

bool fetchFutureTrips();