// lib/abacatepay.js
import AbacatePay from 'abacatepay-nodejs-sdk'

const abacate = AbacatePay(process.env.ABACATE_PAY_API_KEY ?? '')

export default abacate
