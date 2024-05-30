#include <ArduinoHttpClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <Servo.h>

Servo myservo;  // create servo object to control a servo
int deg = 0;
bool direction = false;
bool inMotion = false;

const char* ssid     = "test";
const char* password = "12345677";

char serverAddress[] = "192.168.43.190";  // server address
int port = 5000;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

String directionEndpoint = "/point/direction";
String degEndpoint = "/point/deg";
String inMotionEndpoint = "/point/in-motion";


class Res {
  private:
    int status;
    String data;

  public:
    //constructor 1
    Res(int initStatus, String initData) {
      this->status = initStatus;
      this->data = initData;
    }

    //constructor 2
    Res(int initStatus) {
      this->status = initStatus;
    }

    //constructor 3
    Res(String initData) {
      this->data = initData;
    }

    //constructor 4
    Res() {
      
    }

    int getStatus() {
      return this->status;
    }

    void setStatus(int val) {
      this->status = val;
    }

    void setData(String data) {
      this->data = data;
    }

    String getData() {
      return this->data;
    }
};


void setup() {
  pinMode(15, OUTPUT);
  myservo.attach(12);  // attaches the servo on pin 2 to the servo object
   myservo.write(deg);
  
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


Res PostHttpRequest(String endpoint, String body = "") {
  Res httpResponse;

  client.beginRequest();
  client.post(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", body.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(body);
  httpResponse.setStatus(client.responseStatusCode());
  httpResponse.setData(client.responseBody());
  client.endRequest();

  return httpResponse;
}

Res GetHttpRequest(String endpoint, String body = "") {
  Res httpResponse;

  client.beginRequest();
  client.get(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", body.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(body);
  httpResponse.setStatus(client.responseStatusCode());
  httpResponse.setData(client.responseBody());
  client.endRequest();

  return httpResponse;
}

void loop(){
  Res getDirection = GetHttpRequest(directionEndpoint);
  if (getDirection.getStatus() == 200) {
    bool newDirection = getDirection.getData().toInt();
    if (newDirection != direction) {
      // update inMotion status
      inMotion = true;
      Serial.println("Motion Status: True");
      JsonDocument motObj;
      String motObjString;
      motObj["data"] = inMotion;
      serializeJson(motObj, motObjString);
      if (PostHttpRequest(inMotionEndpoint, motObjString).getStatus() == 200){
        // switch points
        switchPoints();
      }
      // update inMotion status
      inMotion = false;
      Serial.println("Motion Status: False");
      motObj["data"] = inMotion;
      serializeJson(motObj, motObjString);
      Serial.print("Server motion update respponse status: ");
      Serial.println(PostHttpRequest(inMotionEndpoint, motObjString).getStatus());
    }
  }

  // send current position to server
  JsonDocument degObject;
  String degObjectString;
  degObject["data"] = deg;
  serializeJson(degObject, degObjectString);
  Serial.print("Server current position update response status: ");
  Serial.println(PostHttpRequest(degEndpoint, degObjectString).getStatus());

  delay(250);
}

void switchPoints() {
  if (direction) {
    // 7.2 s
    while (deg <= 180) {
      myservo.write(deg);
      deg++;
      delay(40);
    }
  } else {
    while (deg >= 0) {
      myservo.write(deg);
      deg--;
      delay(40);
    }
  }
  direction = !direction;
}

// void sendInfo(){
//   Serial.println("Sending with gps data...");
//   Serial.println("\nWait 10 seconds\n\n");
//   if (WiFi.status() != WL_CONNECTED) {
//     WiFi.begin(ssid, password);
//   } else {
//     digitalWrite(15, HIGH);
//   }

//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     digitalWrite(15, LOW);
//     delay(500);
//     digitalWrite(15, HIGH);
//   }

//   delay(5000);
//   JsonDocument sensorDataObject;
//   JsonDocument gpsData;
  
//   if (gps.location.isValid())
//   {
//     gpsData["latitude"] = gps.location.lat();
//     gpsData["longitude"] = gps.location.lng();
//   }
//   else
//   {
//     gpsData["latitude"] = 0.00;
//     gpsData["longitude"] = 0.00;
//   }

//   sensorDataObject["gps"] = gpsData;

//   // ULTRASONIC
//   float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
//   float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
//   sensorDataObject["level"] = level;

//   // HX711
//   float weight_g = scale.get_units(20)/10;
//   if (weight_g < 0.0) {
//     weight_g = 15.34; 
//   }
//   sensorDataObject["weight"] = weight_g;

//   // Pressure
//   int pressure  = analogReadMilliVolts(pressPin);
//   sensorDataObject["pressure"] = pressure;

//   // Valve
//   bool valve = digitalRead(valvePin);
//   sensorDataObject["valve"] = valve;
  
//    // convert into a JSON string
//   String sensorDataObjectString, sensorDataObjectPrettyString;
//   serializeJson(sensorDataObject, sensorDataObjectString);
//   serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

//   // send JSON data to server
//   String endpoint = "/truck/update/tank/" + truckId;
//   client.beginRequest();
//   client.post(endpoint);
//   client.sendHeader("Content-Type", "application/json");
//   client.sendHeader("Content-Length", sensorDataObjectString.length());
//   client.sendHeader("Connection", "close");
//   client.beginBody();
//   client.print(sensorDataObjectString);
//   int statusCodePost = client.responseStatusCode();
//   String responsePost = client.responseBody();
//   client.endRequest();

//   Serial.print("\nPost Response Status Code: ");
//   Serial.println(statusCodePost);
//   Serial.print("\nPost Response: ");
//   Serial.println(responsePost);

//   //Print stringified data objects
//   Serial.println("\nPretty JSON Object:");
//   Serial.println(sensorDataObjectPrettyString);
// }

// void sendInfoWithoutGps(){
//   Serial.println("Sending without gps data...");
//   Serial.println("\nWait 25 seconds\n\n");

//   if (WiFi.status() != WL_CONNECTED) {
//     WiFi.begin(ssid, password);
//   } else {
//     digitalWrite(15, HIGH);
//   }

//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     digitalWrite(15, LOW);
//     delay(500);
//     digitalWrite(15, HIGH);
//   }

//   delay(20000);
//   JsonDocument sensorDataObject;

//   // ULTRASONIC
//   float distance_cm = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
//   float level = 100 - (100 * (distance_cm - fullTankPingVal_cm) / (emptyTankPingVal_cm - fullTankPingVal_cm));
//   sensorDataObject["level"] = level;

//   // HX711
//   float weight_g = scale.get_units(20)/10;
//   sensorDataObject["weight"] = weight_g;

//   //Pressure
//   int pressure  = analogReadMilliVolts(pressPin);
//   sensorDataObject["pressure"] = pressure;

//   // Valve
//   bool valve = digitalRead(valvePin);
//   sensorDataObject["valve"] = valve;
  
//    // convert into a JSON string
//   String sensorDataObjectString, sensorDataObjectPrettyString;
//   serializeJson(sensorDataObject, sensorDataObjectString);
//   serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

//   // send JSON data to server
//   String endpoint = "/truck/update/tank/" + truckId;
//   // String endpoint = "/";
//   client.beginRequest();
//   client.post(endpoint);
//   // client.get(endpoint);
//   client.sendHeader("Content-Type", "application/json");
//   client.sendHeader("Content-Length", sensorDataObjectString.length());
//   client.sendHeader("Connection", "close");
//   client.beginBody();
//   client.print(sensorDataObjectString);
//   int statusCodePost = client.responseStatusCode();
//   String responsePost = client.responseBody();
//   client.endRequest();

//   Serial.print("\nPost Response Status Code: ");
//   Serial.println(statusCodePost);
//   Serial.print("\nPost Response: ");
//   Serial.println(responsePost);

//   //Print stringified data objects
//   Serial.println("\nPretty JSON Object:");
//   Serial.println(sensorDataObjectPrettyString);
// }

