#pragma once

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include "gps-module.h"

// Network and Firebase credentials
// #define WIFI_SSID "usmahm"
// #define WIFI_PASSWORD "defcon-qqwm"
#define WIFI_SSID "raspit"
#define WIFI_PASSWORD "raspit1ras"

#define Web_API_KEY "AIzaSyD-y-6I5FoCLlXYRJ65sTNlUveXLj25LWM"
#define DATABASE_URL "https://prms-oau-default-rtdb.firebaseio.com"
#define USER_EMAIL "usmanah9817@gmail.com"
#define USER_PASS "defcon-prms"
#define PROJECT_ID "prms-oau"


// User function
void processData(AsyncResult &aResult);


void firebaseSetup();

void firebaseLoop();

void processData(AsyncResult &aResult);

void sendLocationData(location locationData);

// template <typename T>
// void sendData(T data, String path, String requestId){
//   // Database.set<T>(aClient, path, data, processData, requestId);
// };