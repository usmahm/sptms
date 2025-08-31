#include "customWifi.h"

void initializeWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while(WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }


  String log = "Connected to WiFi network with IP Address: " + WiFi.localIP().toString();
  Serial.println(log);
}