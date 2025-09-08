#include <Arduino.h>
#include <WiFi.h>
// #include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "env.h"

#include "gps-module.h"

void apiSetup();

void sendLocationData(location locData);

String httpGETRequest(String apiURL);

String httpPOSTRequest(String apiURL, String payload);

String httpPATCHRequest(String apiURL, String payload);