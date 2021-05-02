import {JetView, plugins} from "webix-jet";

import ActivitiesPopup from "./activities/activitiesForm";
import header from "./header";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const menu = {
			view: "menu",
			id: "top:menu",
			css: "menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon mdi mdi-#icon#'></span> #value# ",
			data: [
				{
					value: _("menu_contacts"),
					id: "contacts",
					icon: "account-group"
				},
				{
					value: _("menu_activities"),
					id: "activities",
					icon: "calendar-range"
				},
				{
					value: _("menu_settings"),
					id: "settings",
					icon: "cogs"
				}
			]
		};

		return {
			type: "clean",
			paddingX: 5,
			css: "layout",
			rows: [
				{$subview: header},
				{
					cols: [
						menu,
						{
							type: "wide",
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		this._popup = this.ui(ActivitiesPopup);
		this.on(this.app, "contactsform:show", props => this._popup.showWindow(props));
	}
}
