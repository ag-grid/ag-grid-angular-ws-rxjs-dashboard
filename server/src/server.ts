import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {AddressInfo} from 'ws';
import {sampleSize} from "lodash";
import {FX_CURRENCY_MATRIX, FX_CURRENCY_SYMBOLS} from './staticData'

type ROW_DATA = { [key: string]: string | null | number }

const fxMatrixData = createFxMatrixSnapshot();

function createAndStartAppServer() {
    const app = express();

    // initialise the http server
    const server = http.createServer(app);

    // initialise the ws instance
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws: WebSocket) => {
        console.log("Connection Established - Sending Current Snapshot");

        // send current snapshot
        ws.send(JSON.stringify(fxMatrixData));

        kickOffPeriodicUpdates(ws);
    });

    // start our server
    server.listen(process.env.PORT || 8999, () => {
        const {port} = server.address() as AddressInfo;
        console.log(`Server started on port ${port}`);
    });
}

function random(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

function createFxMatrixSnapshot() {

    const columns = FX_CURRENCY_MATRIX[0];
    const data = FX_CURRENCY_MATRIX.slice(1);

    let rowData = [];
    for (let i = 0; i < data.length; i++) {
        let currentRow = data[i];

        let row: ROW_DATA = {};
        for (let j = 0; j < columns.length; j++) {
            row[String(columns[j])] = currentRow[j];
        }

        // last, net and % change are different
        row['last'] = Math.floor(random(7000, 170000));
        row['net'] = Math.floor(random(-500, 500));

        let multiplier = ((Math.random() * 10) > 5) ? -1 : 1;
        row['pct_net_change'] = (multiplier * (random(30, 100) / 100)).toFixed(2);

        rowData.push(row);
    }

    return rowData;
}

function applyDeltasToFxData() {
    let fxSymbolsToUpdate = sampleSize(FX_CURRENCY_SYMBOLS, FX_CURRENCY_SYMBOLS.length / 5);
    let rowsToUpdate = sampleSize(fxMatrixData, fxMatrixData.length / 5);
    for (let i = 0; i < rowsToUpdate.length; i++) {
        let row = rowsToUpdate[i];

        let last: number = <number>row.last;
        let maxSwing = last * 0.05; // max 5% swing
        let swing = Math.floor(random(-maxSwing, maxSwing));
        row.last = last + swing;
        row.net = swing;

        let multiplier = ((Math.random() * 10) > 5) ? -1 : 1;
        row['pct_net_change'] = (multiplier * (random(30, 100) / 100)).toFixed(2);

        for (let symbolToUpdate of fxSymbolsToUpdate) {
            if (row[symbolToUpdate] === null) {
                continue;
            }

            let multiplier = ((Math.random() * 10) > 8) ? -1 : 1;
            row[symbolToUpdate] = (multiplier * Math.random()).toFixed(2);
        }
    }
}

function kickOffPeriodicUpdates(ws: WebSocket) {
    setInterval(() => {
        applyDeltasToFxData();

        // send the new state of play
        ws.send(JSON.stringify(fxMatrixData));
    }, 1500);

    // setInterval(() => {
    //     calculateTopMovers();
    // }, 2500);
}


createAndStartAppServer();






