export type ROW_DATA = { [key: string]: string | null | number }

export type MESSAGE_DATA = {
    fxData: ROW_DATA,
    tickerData: ROW_DATA
    topMovers: ROW_DATA
}

export type TICKER_DETAIL = { historicalData: {}[], pricingDelta: any, tickerSummary: any, timestamp: string }

