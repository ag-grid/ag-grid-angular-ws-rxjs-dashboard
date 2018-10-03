import {concat, sampleSize, uniq} from "lodash";
import {DE_SYMBOLS, JSE_SYMBOLS, LSE_SYMBOLS, NASDAQ_SYMBOLS} from "../static_data/staticData";
import {random} from "../utils/utils";

const timestamp = new Date();

export function initialiseTickerData() {
    const tickerData: any[] = [];

    const allSymbols = uniq(concat(NASDAQ_SYMBOLS, LSE_SYMBOLS, JSE_SYMBOLS, DE_SYMBOLS));
    allSymbols.forEach((symbol) => {
        tickerData.push(generateTickerRow(symbol));
    });

    return tickerData;
}

function generateTickerRow(symbol: string) {
    let price = random(10, 600);
    let tickerRow: any = {
        symbol,
        price,
        bid: price - random(1, 3),
        ask: price + random(1, 3),
        recommendation: ['Buy', 'Hold', 'Sell'][Math.floor(random(0, 2))]
    };

    tickerRow['tickerDetail'] = createTickerDetail(tickerRow);
    return tickerRow
}

export function applyDeltasToTickerData(tickerData: any[]) {
    const symbols = uniq(concat(NASDAQ_SYMBOLS, LSE_SYMBOLS, JSE_SYMBOLS, DE_SYMBOLS));
    let properties = ['price', 'bid', 'ask'];

    let symbolsToAlter = sampleSize(symbols, symbols.length / 4);
    let propertyToAlter: string = sampleSize(properties, 1)[0];

    for (let tickerDatum of tickerData) {
        if (symbolsToAlter.indexOf(tickerDatum.symbol) !== -1) {
            tickerDatum[propertyToAlter] = +tickerDatum[propertyToAlter] + random(-2, 2);
        }
    }
}

function formatNumber(input: number) {
    return input.toFixed(2);
}

function formatDate(date: Date) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function generateHistoricalData(numberOfPoints: number, endDate: Date, endPrice: number) {
    let historicalData = [{
        "date": formatDate(endDate),
        "price": endPrice
    }
    ];

    let numberOfTransitions = 15;
    let pointsPerTransition = numberOfPoints / numberOfTransitions;

    let lastDate = endDate;
    let lastPrice = endPrice;
    for (let transition = 0; transition < numberOfTransitions; transition++) {
        let swing = (Math.random() >= 0.5) ? 1 : -1;

        for (let i = 0; i <= pointsPerTransition; i++) {
            lastDate.setDate(lastDate.getDate() - 1);
            lastPrice = lastPrice + (swing * random(-1, 10));
            lastPrice = lastPrice < 0 ? 0 : lastPrice;

            historicalData.splice(0, 0, ({
                "date": formatDate(lastDate),
                "price": lastPrice
            }));
        }
    }

    return historicalData;
}

function formatWithDecimalPlaces(x: string) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createTickerDetail(ticker: any) {
    let currentPrice = ticker.price;
    let tenthOfCurrentPrice = currentPrice / 10;
    let previousPrice = +currentPrice + random(-tenthOfCurrentPrice, tenthOfCurrentPrice);

    let twentiethOfCurrentPrice = currentPrice / 20;
    let yearAgoPrice = random(-twentiethOfCurrentPrice, twentiethOfCurrentPrice);

    let range = `${formatNumber(previousPrice)} - ${formatNumber(currentPrice)}`;
    let fiftyTwoWeek = `${formatNumber(yearAgoPrice)} - ${formatNumber(currentPrice)}`;

    let open = formatNumber(ticker.bid); // not the same, but will do for demo purposes

    let vol = formatWithDecimalPlaces(random(5000, 20000).toFixed(2));
    let avg = `${formatNumber(random(10, 30))}M`;

    let dividend = random(0, 1).toFixed(2);
    let yld = random(1, 2).toFixed(2);

    let eps = random(5, 10).toFixed(2);

    let shares = `${random(3000, 10000).toFixed(2)}M`;

    let marketCap = `${random(100000, 900000).toFixed(2)}M`;

    let historicalData = generateHistoricalData(100, timestamp, currentPrice);

    return {
        pricingDelta: {
            currentPrice,
            previousPrice
        },
        timestamp: timestamp.toDateString(),
        tickerSummary: {
            range,
            fiftyTwoWeek,
            open,
            vol,
            avg,
            dividend,
            yld,
            eps,
            shares,
            marketCap
        },
        historicalData
    }
}
