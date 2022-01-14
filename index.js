var QRCode = require('qrcode')
var { buildPaymentCode } = require("./helper")

const KEYS = {
}

const run = () => {
  // User inputs
  const [target, amount, description] = process.argv.splice(2)

  const pixKey = KEYS[target]
  const merchantName = "Victor"
  const merchantCity = "Niteroi"
  const txid = "***"

  const code = buildPaymentCode(pixKey, description, merchantName, merchantCity, amount, txid)

  // https://github.com/soldair/node-qrcode
  QRCode.toString(code, { type: 'terminal' }, function (err, qrcode) {
    console.log(qrcode)
  })
}

run()
