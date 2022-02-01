var QRCode = require('qrcode')
var { buildPaymentCode } = require("./helper")

const KEYS = {
  cora: "6eea1a3f-f161-4c73-ac88-6efc9745ce59",
  nubank: "victorbarros1130@gmail.com",
  stone: "38174830000108",
}

const DEFAULT_TARGET = KEYS.nubank
const DEFAULT_MERCHANT_NAME = "ItaocarenseTec"
const DEFAULT_MERCHANT_CITY = "Rio de Janeiro"

const run = () => {
  // User inputs
  const [value, description, target, name, city] = process.argv.splice(2)

  const amount = Number(value).toFixed(2).toString()
  const pixKey = KEYS[target] || DEFAULT_TARGET
  const merchantName = name || DEFAULT_MERCHANT_NAME
  const merchantCity = city || DEFAULT_MERCHANT_CITY

  const code = buildPaymentCode(pixKey,
    `${description || ""}\nby pix-com`,
    merchantName,
    merchantCity,
    amount)

  // https://github.com/soldair/node-qrcode
  QRCode
    .toString(code)
    .then(console.log)
}

run()
