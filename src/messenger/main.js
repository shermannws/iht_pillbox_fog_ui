
// Program Constants
const mqttClientId = "fog-user";
const mqttUsername = process.env.REACT_APP_MQTT_USER;
const mqttPassword = process.env.REACT_APP_MQTT_PASSWORD;
const mqttTimeout = 400000;
const mqttHost = process.env.REACT_APP_MQTT_HOST;
const mqttPort = process.env. REACT_APP_MQTT_PORT;
const mqttConnectionOptions = {
  clean: true,
  connectTimeout: mqttTimeout,
  clientId: mqttClientId,
  username: mqttUsername,
  password: mqttPassword,
};
const mqttConnectionUrl = `ws://${mqttHost}:${mqttPort}/mqtt`;

// Setup MQTT Connection
const mqtt = require('mqtt-browser');

class MQTT {
  constructor() {}

  connect() {
    this.client = mqtt.connect(mqttConnectionUrl, mqttConnectionOptions);
    this.client.on('connect', () => {
      console.log(`Connected to MQTT Broker at ${mqttConnectionUrl}`);
    });
    this.client.on('error', (err) => {
      console.error('Connection error: ', err);
      this.end();
    });
    this.client.on('reconnect', () => {
      console.log("Reconnecting");
    });
    this.client.on('message', (topic, message) => {
      const payload = { topic, message: message.toString() };
      console.log(payload);
    });
  }

  subscribe(topic) {
    this.client.subscribe(topic, function (err) {
      if (!err) {
        console.log(`Subscribed to ${topic}`)
      }
  })}

  publish(topic, message) {
    this.client.publish(topic, message)
    console.log(`Published ${message} to ${topic}`)
  }

  end() {
    this.client.end()
  }
};

export default MQTT;