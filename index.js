const fs = require("fs");
const xpath = require("xpath");
const dom = require("@xmldom/xmldom").DOMParser;
const Path = require("path");

const files = [
  "common_expressions.xml",
  "greetings.xml",
  "travel_directions.xml",
  "number_money.xml",
  "location.xml",
  "phone_internet_email.xml",
  "time_dates.xml",
  "accommodations.xml",
  "dining.xml",
  "making_friends.xml",
  "intertainment.xml",
  "shopping.xml",
  "communication_difficulties.xml",
  "emergency_health.xml",
  "general_questions.xml",
  "work.xml",
  "weather.xml",
  "miscellaneous.xml",
];

const SOURCE_PATH = "./source";
const OUTPUT_PATH = "./json";

function getDocFile(fileName) {
  const htmlSource = fs.readFileSync(fileName, "utf8");
  const doc = new dom().parseFromString(htmlSource, "text/xml");
  return doc;
}

function getSentences(document) {
  const rows = xpath.select("/table/tbody/tr/td", document);
  const list = [];

  for (const row of rows) {
    const words = xpath.select('./p[@class="test"]/a/text()', row);

    const sentence = words
      .map((word) => /[^\s\t\n]+\w*[^\s\t\n]*/.exec(word)[0])
      .join(" ");

    if (sentence) {
      list.push({
        sentence: sentence,
        meaning: "",
      });
    }
  }

  return list;
}

function writeJsonFile(fileName, obj) {
  const filename = Path.parse(fileName).name;
  const fileDir = Path.dirname(fileName);

  fs.writeFileSync(`${fileDir}/${filename}.json`, JSON.stringify(obj));
}

function main() {
  for (const file of files) {
    const doc = getDocFile(`${SOURCE_PATH}/${file}`);
    const sentences = getSentences(doc);
    writeJsonFile(`${OUTPUT_PATH}/${file}`, sentences);
  }
}

main();
