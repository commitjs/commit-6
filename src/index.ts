import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
import 'reflect-metadata';

// import './router/router-link.component';
import './router/router.component';
import { bootstrap } from './lib/bootstrap';
import { AppComponent } from './app.component';

bootstrap(AppComponent);
