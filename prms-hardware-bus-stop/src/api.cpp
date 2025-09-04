#include "api.h"

int dataLength = 0;
String busStopData[MAX_DATA_LENGTH];


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

bool fetchFutureTrips() {
  // Get all buses scheduled for future departure from this bus station today. 
  // i.e buses that has trip but has not started
  // /bus-stops/:id/trips?future=true

  String endpoint = String(API_URL) + "/trips?isFuture=true&timezone=Africa/Lagos&startBusStop=" + String(BUS_STOP_ID);

  String response = httpGETRequest(endpoint);
  
  // Serial.println("response", response.c_str());
  
  if (response != "{}") {
    JsonDocument doc;
    
    deserializeJson(doc, response);
    // Serial.println(response);
  
    JsonArray trips = doc["data"];

    for (int i = 0; ((i < trips.size()) && (i < MAX_DATA_LENGTH)); i++) {
      JsonObject trip = trips[i];

      String time = trip["scheduled_departure_time"];
      String busStop = trip["route"]["start_bus_stop"]["code"];
      String busCode = trip["bus"]["code"];

      time = time.substring(11, 16);

      busStopData[i] = formatLCDBusRow(time, busStop, busCode);
      
      dataLength++;
    }

    return true;
  }

  return false;
}

// // Variant for arrival time
bool fetchOngoingTrips() {
  // Get all buses scheduled for future departure from this bus station today. 
  // i.e buses that has trip but has not started
  // /bus-stops/:id/trips?future=true

  String endpoint = String(API_URL) + "/trips?onGoing=true&timezone=Africa/Lagos&getEstimatedArrival=true&startBusStop=" + String(BUS_STOP_ID);

  String response = httpGETRequest(endpoint);
  
  // Serial.println("response", response.c_str());
  
  if (response != "{}") {
    JsonDocument doc;
    
    deserializeJson(doc, response);
    // Serial.println(response);
  
    JsonArray trips = doc["data"];

    for (int i = 0; ((i < trips.size()) && (i < MAX_DATA_LENGTH)); i++) {
      // [FIX]! hacks till fully done
      JsonObject trip = trips[i];

      String time = trip["estimated_arrival_time"];
      String busStop = trip["route"]["start_bus_stop"]["code"];
      String busCode = trip["bus"]["code"];

      time = time.substring(11, 16);

      busStopData[i] = formatLCDBusRow(time, busStop, busCode);
      
      dataLength++;
    }

    return true;
  }

  return false;
}