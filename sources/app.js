/* eslint-disable no-undef */
/* eslint-disable no-console */
import {EmptyRouter, JetApp, plugins} from "webix-jet";
import "./styles/main.css";

export default class App extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: EmptyRouter,
			debug: !PRODUCTION,
			start: "/top/contacts",
			views: {
				contacts: "contacts.index",
				info: "contacts.contactInfo",
				editor: "contacts.contactEditor",
				activities: "activities.index"
			}
		};

		super({...defaults, ...config});
		this.use(plugins.Locale, null);
		if (!PRODUCTION) {
			this.attachEvent("app:error:resolve", (err) => {
				webix.message({
					text: this.getService("locale")
						._("error_message"),
					type: "error",
					expire: 10000
				});
				console.error(err);
			});
		}
	}
}
if (!BUILD_AS_MODULE) {
	webix.ready(() => new App().render());
}
