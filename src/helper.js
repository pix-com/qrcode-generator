
const id = {
  PAYLOAD_FORMAT_INDICATOR: "00",
  MERCHANT_ACCOUNT_INFORMATION: "26",
  MERCHANT_ACCOUNT_INFORMATION_GUI: "00",
  MERCHANT_ACCOUNT_INFORMATION_KEY: "01",
  MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION: "02",
  MERCHANT_CATEGORY_CODE: "52",
  TRANSACTION_CURRENCY: "53",
  TRANSACTION_AMOUNT: "54",
  COUNTRY_CODE: "58",
  MERCHANT_NAME: "59",
  MERCHANT_CITY: "60",
  ADDITIONAL_DATA_FIELD_TEMPLATE: "62",
  ADDITIONAL_DATA_FIELD_TEMPLATE_TXID: "05",
  CRC16: "63",
}

const formatParam = (id, value) => {
  const len = `${value.length}`.padStart(2, "0")
  return `${id}${len}${value}`
}

function stringToBytes(str) {
  // https://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
  var ch, st, re = []
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i)
    st = []
    do {
      st.push(ch & 0xFF)
      ch = ch >> 8
    }
    while (ch)
    re = re.concat(st.reverse())
  }
  return re
}

const buildCRC16 = (payload) => {
  // cyclic redundancy check
  // https://github.com/william-costa/wdev-qrcode-pix-estatico-php#verifica%C3%A7%C3%A3o-c%C3%ADclica-de-redund%C3%A2ncia-crc16
  payload += `${id.CRC16}${"04"}`

  const polinomio = "0x1021"
  let resultado = "0xFFFF"

  for (let offset = 0; offset < payload.length; offset++) {
    resultado ^= (stringToBytes(payload[offset]) << 8)
    for (let bitwise = 0; bitwise < 8; bitwise++) {
      if ((resultado <<= 1) & 0x10000) resultado ^= polinomio
      resultado &= 0xFFFF
    }
  }

  return `${id.CRC16}${"04"}${(resultado.toString(16)).toLocaleUpperCase()}`
}

function buildPaymentCode(pixKey, description, merchantName, merchantCity, amount, txid = "***") {
  // ./Anexo.pdf page 16
  let resp = ""

  resp += formatParam(id.PAYLOAD_FORMAT_INDICATOR, "01")

  const merchantAccInfo_GUI = formatParam(id.MERCHANT_ACCOUNT_INFORMATION_GUI, "br.gov.bcb.pix")
  const merchantAccInfo_key = formatParam(id.MERCHANT_ACCOUNT_INFORMATION_KEY, pixKey)
  const merchantAccInfo_description = formatParam(id.MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, description)

  resp += formatParam(id.MERCHANT_ACCOUNT_INFORMATION,
    merchantAccInfo_GUI + merchantAccInfo_key + merchantAccInfo_description)
  resp += formatParam(id.MERCHANT_CATEGORY_CODE, "0000")
  resp += formatParam(id.TRANSACTION_CURRENCY, "986")
  resp += formatParam(id.TRANSACTION_AMOUNT, amount)
  resp += formatParam(id.COUNTRY_CODE, "BR")
  resp += formatParam(id.MERCHANT_NAME, merchantName)
  resp += formatParam(id.MERCHANT_CITY, merchantCity.toLocaleUpperCase())

  const addDatFieldTempe_txId = formatParam(id.ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, txid)
  resp += formatParam(id.ADDITIONAL_DATA_FIELD_TEMPLATE, addDatFieldTempe_txId)
  resp += buildCRC16(resp)

  return resp
}

module.exports = { buildPaymentCode }
