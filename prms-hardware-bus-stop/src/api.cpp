#include "api.h"

int dataLength = 0;
String busStopData[MAX_BUSES];


void apiSetup();

String httpGETRequest(String apiURL) {
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
  
    http.begin(apiURL);
  
    int httpResponseCode = http.GET();
  
  
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      response = http.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
  
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  return response;
};

String httpPOSTRequest(String apiURL, String payload) {
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, apiURL);

    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);

    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      response = http.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  return response;
};

String httpPATCHRequest(String apiURL, String payload) {
  // Serial.println("Sending PATCH to: " + apiURL);
  
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, apiURL);

    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.PATCH(payload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      response = http.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  return response;
};

bool fetchBusNodes() {
  String endpoint = String(API_URL) + "/bus-nodes";

  String response = httpGETRequest(endpoint);
  
  // Serial.println("response", response.c_str());
  
  if (response != "{}") {
    JsonDocument doc;
    
    deserializeJson(doc, response);
    // Serial.println(response);
  
    JsonArray buses = doc["data"];

    for (int i = 0; ((i < buses.size()) && (i < MAX_BUSES)); i++) {
      // [FIX]! hacks till fully done
      JsonObject bus = buses[i];

      String time = bus["created_at"];
      String busStop = bus["id"];
      String busId = bus["code"];

      time = time.substring(11, 16);

      busStopData[i] = formatLCDBusRow(time, busStop, busId);
      
      dataLength++;
    }

    return true;
  }

  return false;
}