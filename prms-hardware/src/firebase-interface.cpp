#include "firebase-interface.h"
#include "env.h"


WiFiClientSecure ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);
RealtimeDatabase Database;

extern UserAuth user_auth;

// Firebase components
FirebaseApp app;
Firestore::Documents Docs;
// WiFiClientSecure ssl_client;
// using AsyncClient = AsyncClientClass;
// AsyncClient aClient(ssl_client);
// RealtimeDatabase Database;

// Timer variables for sending data every 10 seconds
// unsigned long lastSendTimet = 0;
// const unsigned long sendIntervalt = 10000; // 10 seconds in milliseconds

// Variables to send to the Database
int intValue = 0;
float floatValue = 0.01;
String stringValue = "";

UserAuth user_auth(Web_API_KEY, USER_EMAIL, USER_PASS);

void create_bus_node_auto_id()
{
    Serial.println("Creating bus_node document with auto ID...");

    // Collection path only (no document ID)
    String collectionId = "bus_nodes";

    // Build your document data
    Document<Values::Value> doc("bus_reg_no", Values::Value(Values::StringValue("BUS_101")));

    // This will auto-generate the document ID
    Docs.createDocument(
        aClient,
        Firestore::Parent(PROJECT_ID), // project info
        collectionId,                            // collection name
        "",                                      // <- empty string means Firestore auto-generates document ID
        DocumentMask(),
        doc,
        processData // or use processData for async callback
    );
}


void firebaseSetup(){

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)    {
    Serial.print(".");
    delay(300);
  }
  Serial.println();

  // Configure SSL client
  ssl_client.setInsecure();
  ssl_client.setTimeout(1000); // Set connection timeout
  ssl_client.setBufferSizes(4096, 1024); // Set buffer sizes

  // Initialize Firebase
  initializeApp(aClient, app, getAuth(user_auth), processData, "🔐 authTask");
  // app.getApp<RealtimeDatabase>(Database);
  app.getApp<Firestore::Documents>(Docs);
  Database.url(DATABASE_URL);
}

bool sent = false;

void firebaseLoop(){
  // Maintain authentication and async tasks
  app.loop();
}

void processData(AsyncResult &aResult){
  if (!aResult.isResult())
    return;

  if (aResult.isEvent())
    Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.eventLog().message().c_str(), aResult.eventLog().code());

  if (aResult.isDebug())
    Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());

  if (aResult.isError())
    Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());

  if (aResult.available())
    Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
}

void sendLocationData(location locData)
{
  if (app.ready()){
    String documentPath = "bus_nodes/321YJTfs0EEGOuzkrNEw";
  
    Values::MapValue point("lat", Values::StringValue(locData.lat));
    point.add("lng", Values::StringValue(locData.lng));
    
    Values::StringValue stringV("BUS_101");
    Document<Values::Value> doc("location", Values::Value(point));
    // doc.add("bus_reg_no", Values::Value(stringV));
  
    PatchDocumentOptions patchOptions(DocumentMask("location"), DocumentMask(), Precondition());
  
    Serial.println("Updating a document... ");
  
    Docs.patch(aClient, Firestore::Parent(PROJECT_ID), documentPath, patchOptions, doc, processData, "patchTask");
  }
}

// void sendLocationData(location locationData)
// {
//   String documentPath = "trips/BYeZnxReA3OmQxt7Yge4";

//   // Values::ArrayTransformValue arrayTRansform("path");
//   // Values::StringValue routeName("New Name");
//   // Document<Values::Value> doc("route_name", Values::Value(routeName));

//   Values::MapValue point("lat", Values::StringValue(String(locationData.lat)));
//   point.add("long", Values::StringValue(String(locationData.lng)));
//   Values::ArrayValue pathArray(point);
//   // pathArray.add(point);

//   Document<Values::Value> doc("path", Values::Value(pathArray));

//   PatchDocumentOptions patchOptions(DocumentMask("path"), DocumentMask(), Precondition());

//   Serial.println("Updating a document... ");

//   Docs.patch(aClient, Firestore::Parent(PROJECT_ID), documentPath, patchOptions, doc, processData, "patchTask");

// }
