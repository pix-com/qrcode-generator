var QRCode = require('qrcode')
var { buildPaymentCode } = require("./helper")

const KEYS = {
  cora: "6eea1a3f-f161-4c73-ac88-6efc9745ce59",
  nubank: "victorbarros1130@gmail.com",
  stone: "38174830000108",
}
const TARGET_DEFAULT = KEYS.nubank

const run = () => {
  // User inputs
  const [value, description, target] = process.argv.splice(2)

  const pixKey = KEYS[target] || TARGET_DEFAULT
  const merchantName = "ItaocarenseTec"
  const merchantCity = "Rio de Janeiro"
  const amount = Number(value).toFixed(2).toString()

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
