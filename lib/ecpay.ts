import crypto from 'crypto'

export const ECPAY_CONFIG = {
  merchantId: process.env.ECPAY_MERCHANT_ID ?? '2000132',
  hashKey: process.env.ECPAY_HASH_KEY ?? '5294y06JbISpM5x9',
  hashIV: process.env.ECPAY_HASH_IV ?? 'v77hoKGq4kWxNNIS',
  paymentUrl:
    process.env.ECPAY_PAYMENT_URL ??
    'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
  isTest: process.env.NODE_ENV !== 'production',
}

/**
 * 計算 ECPay CheckMacValue（SHA-256）
 * 規則：依 key 字母順序排列 → 加前後 HashKey/HashIV → URL encode → lowercase → SHA256 → uppercase
 */
export function generateCheckMacValue(
  params: Record<string, string>,
  hashKey: string = ECPAY_CONFIG.hashKey,
  hashIV: string = ECPAY_CONFIG.hashIV,
): string {
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== 'CheckMacValue')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const paramStr = sortedKeys.map((k) => `${k}=${params[k]}`).join('&')
  const raw = `HashKey=${hashKey}&${paramStr}&HashIV=${hashIV}`

  // ECPay 指定的 URL encode 規則
  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2a/g, '*')

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase()
}

export interface CreateOrderParams {
  merchantTradeNo: string
  merchantTradeDate: string // "YYYY/MM/DD HH:mm:ss"
  totalAmount: number
  tradeDesc: string
  itemName: string
  returnURL: string // ECPay 後端 callback
  clientBackURL?: string // 付款完成後跳回前端
}

/** 建立送給 ECPay 的訂單參數（含 CheckMacValue） */
export function createOrder(params: CreateOrderParams): Record<string, string> {
  const orderParams: Record<string, string> = {
    MerchantID: ECPAY_CONFIG.merchantId,
    MerchantTradeNo: params.merchantTradeNo,
    MerchantTradeDate: params.merchantTradeDate,
    PaymentType: 'aio',
    TotalAmount: String(params.totalAmount),
    TradeDesc: params.tradeDesc,
    ItemName: params.itemName,
    ReturnURL: params.returnURL,
    ChoosePayment: 'ALL',
    EncryptType: '1',
  }

  if (params.clientBackURL) {
    orderParams.ClientBackURL = params.clientBackURL
  }

  orderParams.CheckMacValue = generateCheckMacValue(orderParams)
  return orderParams
}

/** 驗證 ECPay callback 的 CheckMacValue */
export function verifyCallback(params: Record<string, string>): boolean {
  const { CheckMacValue, ...rest } = params
  if (!CheckMacValue) return false
  const expected = generateCheckMacValue(rest)
  return expected === CheckMacValue
}

/** 格式化 ECPay 要求的日期字串 */
export function formatECPayDate(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
}
