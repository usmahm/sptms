#include "api.h"

WiFiClientSecure *httpsClient = new WiFiClientSecure;
WiFiClient *httpClient = new WiFiClient;

void apiSetup() {
  if (httpsClient) {
    httpsClient->setInsecure();
  }
};

String httpGETRequest(String apiURL) {
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
  
    if (LOCAL_API) {
      http.begin(*httpClient, apiURL);
    } else {
      http.begin(*httpsClient, apiURL);
    }
  
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
    HTTPClient http;

    if (LOCAL_API) {
      http.begin(*httpClient, apiURL);
    } else {
      http.begin(*httpsClient, apiURL);
    }

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
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    if (LOCAL_API) {
      http.begin(*httpClient, apiURL);
    } else {
      http.begin(*httpsClient, apiURL);
    }

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

  String endpoint = String(API_URL) + "/bus-nodes/" + String(BUS_ID) + "/location";

  Serial.println(endpoint);
  String response = httpPATCHRequest(endpoint, serializedPayload);

  // Return if success or not handle that case outisde, hence retry early
};
