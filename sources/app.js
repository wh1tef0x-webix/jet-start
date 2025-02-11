/* eslint-disable no-undef */
/* eslint-disable no-console */
import {EmptyRouter, HashRouter, JetApp, plugins} from "webix-jet";

import "./styles/main.css";
import {errorMessage} from "./views/messages";

export default class App extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/top/contacts",
			views: {
				contacts: "contacts.index",
				info: "contacts.contactInfo",
				editor: "contacts.contactEditor",
				activities: "activities.index",
				settings: "settings.index"
			}
		};

		super({...defaults, ...config});
		this.use(plugins.Locale, null);
		if (!PRODUCTION) {
			this.attachEvent("app:error:resolve", (err) => {
				errorMessage(this.getService("locale")._);
				console.error(err);
			});
		}
	}
}
if (!BUILD_AS_MODULE) {
	webix.ready(() => new App().render());
}
