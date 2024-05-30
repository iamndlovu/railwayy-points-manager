#include <ArduinoHttpClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

const char* ssid     = "test";
const char* password = "12345677";

char serverAddress[] = "192.168.43.190";  // server address
int port = 5000;


WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

void setup() {
  pinMode(15, OUTPUT);
  
  Serial.begin(9600);
  while(!Serial){delay(100);}

  Serial.println();
  Serial.println("******************************************************");
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
    digitalWrite(15, LOW);
    Serial.print(".");
    delay(500);
    digitalWrite(15, HIGH);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop(){

}

void sendInfo(){
  Serial.println("Sending with gps data...");
  Serial.println("\nWait 10 seconds\n\n");
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
  } else {
    digitalWrite(15, HIGH);
  }

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(15, LOW);
    delay(500);
    digitalWrite(15, HIGH);
  }

  delay(5000);
  JsonDocument sensorDataObject;
  JsonDocument gpsData;
  
  if (gps.location.isValid())
  {
    gpsData["latitude"] = gps.location.lat();
    gpsData["longitude"] = gps.location.lng();
  }
  else
  {
    gpsData["latitude"] = 0.00;
    gpsData["longitude"] = 0.00;
  }

  sensorDataObject["gps"] = gpsData;

  // ULTRASONIC
  float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
  sensorDataObject["level"] = level;

  // HX711
  float weight_g = scale.get_units(20)/10;
  if (weight_g < 0.0) {
    weight_g = 15.34; 
  }
  sensorDataObject["weight"] = weight_g;

  // Pressure
  int pressure  = analogReadMilliVolts(pressPin);
  sensorDataObject["pressure"] = pressure;

  // Valve
  bool valve = digitalRead(valvePin);
  sensorDataObject["valve"] = valve;
  
   // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  String endpoint = "/truck/update/tank/" + truckId;
  client.beginRequest();
  client.post(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", sensorDataObjectString.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(sensorDataObjectString);
  int statusCodePost = client.responseStatusCode();
  String responsePost = client.responseBody();
  client.endRequest();

  Serial.print("\nPost Response Status Code: ");
  Serial.println(statusCodePost);
  Serial.print("\nPost Response: ");
  Serial.println(responsePost);

  //Print stringified data objects
  Serial.println("\nPretty JSON Object:");
  Serial.println(sensorDataObjectPrettyString);
}

void sendInfoWithoutGps(){
  Serial.println("Sending without gps data...");
  Serial.println("\nWait 25 seconds\n\n");

  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
  } else {
    digitalWrite(15, HIGH);
  }

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(15, LOW);
    delay(500);
    digitalWrite(15, HIGH);
  }

  delay(20000);
  JsonDocument sensorDataObject;

  // ULTRASONIC
  float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
  sensorDataObject["level"] = level;

  // HX711
  float weight_g = scale.get_units(20)/10;
  sensorDataObject["weight"] = weight_g;

  //Pressure
  int pressure  = analogReadMilliVolts(pressPin);
  sensorDataObject["pressure"] = pressure;

  // Valve
  bool valve = digitalRead(valvePin);
  sensorDataObject["valve"] = valve;
  
   // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  String endpoint = "/truck/update/tank/" + truckId;
  // String endpoint = "/";
  client.beginRequest();
  client.post(endpoint);
  // client.get(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", sensorDataObjectString.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(sensorDataObjectString);
  int statusCodePost = client.responseStatusCode();
  String responsePost = client.responseBody();
  client.endRequest();

  Serial.print("\nPost Response Status Code: ");
  Serial.println(statusCodePost);
  Serial.print("\nPost Response: ");
  Serial.println(responsePost);

  //Print stringified data objects
  Serial.println("\nPretty JSON Object:");
  Serial.println(sensorDataObjectPrettyString);
}
