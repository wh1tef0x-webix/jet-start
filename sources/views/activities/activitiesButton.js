import {JetView} from "webix-jet";

import ActivitiesPopup from "./activitiesForm";

export default class ActivitiesButton extends JetView {
	constructor(app, name, popup) {
		super(app, name);
		this._popup = popup;
	}

	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "toolbar",
			cols: [
				{},
				{
					view: "button",
					label: _("btn_add"),
					css: "webix_transparent",
					autowidth: true,
					type: "icon",
					icon: "wxi-plus-circle",
					click: () => {
						this._popup.showWindow();
					}
				}
			]
		};
	}

	init() {
		this._popup = this.ui(ActivitiesPopup);
	}
}
