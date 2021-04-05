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
  }

  setValue(key, value) {
    const currentVal = this.get();
    currentVal[key] = value;
    this.set(currentVal);
  }

  getValue(key) {
    return this.get()[key];
  }

  numKeys() {
    return Object.keys(this.get()).length;
  }
}

module.exports = JSONFileManager;