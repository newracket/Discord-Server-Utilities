const fs = require("fs");

class JSONFileManager {
  constructor(fileName) {
    this.fileName = fileName + ".json";

    if (!fs.existsSync(`./jsons/${this.fileName}`)) {
      fs.writeFileSync(`./jsons/${this.fileName}`, "");
    }
  }

  get() {
    return JSON.parse(fs.readFileSync(`./jsons/${this.fileName}`, "utf8"));
  }

  set(value) {
    fs.writeFileSync(`./jsons/${this.fileName}`, JSON.stringify(value));

    return value;
  }

  setValue(key, value) {
    const currentJSON = this.get();
    currentJSON[key] = value;
    this.set(currentJSON);

    return currentJSON;
  }

  getValue(key) {
    return this.get()[key];
  }

  numKeys() {
    return Object.keys(this.get()).length;
  }

  append(value) {
    const currentJSON = this.get();
    currentJSON.push(value);
    this.set(currentJSON);

    return currentJSON;
  }

  hasKey(key) {
    return Object.keys(this.get()).includes(key);
  }

  deleteKey(key) {
    if (!this.hasKey(key)) return;

    const currentJSON = this.get();
    delete currentJSON[key];
    this.set(currentJSON);

    return currentJSON;
  }
}

module.exports = JSONFileManager;