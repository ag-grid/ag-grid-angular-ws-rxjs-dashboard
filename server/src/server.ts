import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {AddressInfo} from 'ws';
import {applyDeltasToFxData, calculateTopMovers, createFxMatrixSnapshot} from "./fx_data/fxData";
import {applyDeltasToTickerData, initialiseTickerData} from "./exchange_data/exchangeData";

const fxData = createFxMatrixSnapshot();
const tickerData = initialiseTickerData();

function createAndStartAppServer() {
    const app = express();

    // initialise the http server
    const server = http.createServer(app);

    // initialise the ws instance
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws: WebSocket) => {
        console.log("Connection Established - Sending Current Snapshot");

        // send current snapshot
        ws.send(JSON.stringify({
            fxData,
            topMovers: calculateTopMovers(fxData),
            tickerData
        }));

        kickOffPeriodicUpdates(ws);
    });

    // start our server
    server.listen(process.env.PORT || 8999, () => {
        const {port} = server.address() as AddressInfo;
        console.log(`Server started on port ${port}`);
    });
}

function kickOffPeriodicUpdates(ws: WebSocket) {
    const interval = setInterval(() => {
        applyDeltasToFxData(fxData);
        applyDeltasToTickerData(tickerData);

        const topMovers = calculateTopMovers(fxData);

        // send the new state of play
        ws.send(JSON.stringify({
            fxData,
            topMovers,
            tickerData
        }));
    }, 1500);

    ws.onclose = () => clearInterval(interval)
}


createAndStartAppServer();






