#include "api.h"

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

void sendLocationData(location locData) {
  JsonDocument doc;
  
  JsonObject loc = doc["location"].to<JsonObject>();
  loc["lat"] = locData.lat;
  loc["lng"] = locData.lng;
  loc["time"] = locData.time;
  
  String serializedPayload;
  serializeJson(doc, serializedPayload);

  Serial.println(serializedPayload);

  httpGETRequest("https://prms-qs5z.onrender.com/health");
  String endpoint = String(API_URL) + "/bus-nodes/" + String(BUS_ID) + "/location";

  Serial.println(endpoint);
  // String response = httpPATCHRequest(endpoint, serializedPayload);
  String response = httpPOSTRequest(endpoint, serializedPayload);

  // Return if success or not handle that case outisde, hence retry early
};
