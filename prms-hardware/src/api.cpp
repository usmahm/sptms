#include "api.h"

WiFiClientSecure *client = new WiFiClientSecure;

void apiSetup() {
  if (client) {
    client->setInsecure();
  }
};

String httpGETRequest(String apiURL) {
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient https;
  
    https.begin(*client, apiURL);
  
    int httpResponseCode = https.GET();
  
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      response = https.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
  
    https.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  
  return response;
};

String httpPOSTRequest(String apiURL, String payload) {
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient https;

    https.begin(*client, apiURL);

    https.addHeader("Content-Type", "application/json");
    int httpResponseCode = https.POST(payload);

    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      response = https.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    https.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  return response;
};

String httpPATCHRequest(String apiURL, String payload) {  
  String response = "{}";

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient https;

    https.begin(*client, apiURL);

    https.addHeader("Content-Type", "application/json");
    int httpResponseCode = https.PATCH(payload);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      response = https.getString();
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    https.end();
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
