// ==UserScript==
// @name          Laptop Data Scraper: Best Buy
// @version       0.1
// @author        NicksPatties
// @match         https://*.bestbuy.com/site/*
// @description   Prints the data from a laptop product page from Best Buy into the browser's console in csv format
// ==/UserScript==

/**
 * This determines if you would like to include the name of the spec column in your data.
 * I like to have this set to false if I already have a column that list the specification names
 */
const includeSpecName = true;

// get element by id with selector that matches shop-specifications-*-json
const product = JSON.parse(
  document.querySelector("[id^='shop-specifications-'][id$='-json']").textContent
);
const productSpecs = product.specifications.categories.map((c) => c.specifications).flat()

/**
 * Finds the value of a specification name
 * 
 * @param {string} desiredSpecName The name of the product specification that matches Best Buy's page listing
 * @param {Array} specs Array of objects that contain displayName and value properties
 */
function getSpecValue(desiredSpecName, specs = productSpecs) {
  let value = ''
  for(let i = 0; i < specs.length; i++) {
    const currSpec = specs[i];
    if (desiredSpecName == currSpec.displayName) {
      value = currSpec.value
      break;
    }
  }
  if (value.length == 0) {
    console.warn(`I couldn't find the value for ${desiredSpecName}. Are you sure the spec is there?`);
  }
  return value;
}

const desiredSpecs = [
  // Product Name,
  // URL,
  // and Price are added below
  "Brand",
  "Screen Size",
  "Screen Resolution",
  "Processor Model",
  "Processor Cores",
  "Processor Speed (up to)",
  "Storage Type",
  "Total Storage Capacity",
  "System Memory (RAM)",
  "Type of Memory (RAM)",
  "Graphics Type",
  "GPU Brand",
  "Graphics",
  "Wireless Networking",
  "Headphone Jack",
  "Microphone Input",
  "GPS Enabled",
  "Number of VGA Ports",
  "Number of HDMI Outputs (Total)",
  "Number of USB 3.0 Type A Ports",
  "Number of USB 3.0 Type C Ports",
  "Number of DisplayPort Outputs (Total)",
  "Number of Thunderbolt Ports (Total)",
  "Battery Life (up to)",
  "Front-Facing Camera",
  "Front Facing Camera Video Resolution",
  "Backlit Keyboard"
];

let data = "";

// add the product name to the first row of the data
const productName = getSpecValue("Product Name");
data += includeSpecName ? `${"Product Name"},${productName}\n` : `${productName}\n`

// add the url to the data
const url = document.URL;
data += includeSpecName ? `URL,${url}\n` : `${url}\n`;

// add the price of the laptop in USD to the data
const price = JSON.parse(
  document.querySelector("[id^=pricing-price][id$=-json]").innerText
).app.data.customerPrice;
data += includeSpecName ? `Price,$${price}\n` : `$${price}\n`;

// add the laptop's specs to the data
desiredSpecs.forEach((spec) => {
  data += includeSpecName ? `${spec},${getSpecValue(spec)}\n` : `${getSpecValue(spec)}\n`
})

console.log(`*********** Here's the product data you requested! ***********\n${data}`);
