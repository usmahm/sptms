#pragma once

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>
#include "gps-module.h"

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