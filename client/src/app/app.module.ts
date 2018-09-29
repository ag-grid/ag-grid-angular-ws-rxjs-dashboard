import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {ClientComponent} from './client/client.component';
import {ServerComponent} from './server/Server.component';

@NgModule({
    declarations: [
        ClientComponent,
        ServerComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [ClientComponent, ServerComponent]
})
export class AppModule {
}
