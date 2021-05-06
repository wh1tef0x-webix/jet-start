import {JetView, plugins} from "webix-jet";

import activities from "../models/activities";
import FormPopup from "./form";
import fields from "./form/formFields";
import HeaderView from "./header";

const MENU_ID = "top:menu";
const MENU_CONTACTS_ID = "contacts";
const MENU_ACTIVITIES_ID = "activities";
const MENU_SETTINGS_ID = "settings";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const menu = {
			view: "menu",
			id: MENU_ID,
			css: "menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon wxi-#icon#'></span> #value# ",
			data: [
				{
					value: _("menu_contacts"),
					id: MENU_CONTACTS_ID,
					icon: "user"
				},
				{
					value: _("menu_activities"),
					id: MENU_ACTIVITIES_ID,
					icon: "calendar"
				},
				{
					value: _("menu_settings"),
					id: MENU_SETTINGS_ID,
					icon: "dots"
				}
			]
		};

		return {
			type: "clean",
			paddingX: 5,
			css: "layout",
			rows: [
				HeaderView,
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
		this._popup = this.ui(new FormPopup(this.app, "form:activities", {
			complexData: true,
			collection: activities,
			fields: fields(["Details", "TypeID", "ContactID", "DueDate", "State"]),
			saveClick: this.saveClick
		}));
		this.on(this.app, "form:activities:show", props => this._popup.showWindow(props));
	}

	saveClick() {
		const form = this.$$(this._formId);
		const values = form.getValues();
		if (form.validate() && form.isDirty()) {
			if (values.id) {
				this._collection.updateItem(values.id, values);
			}
			else {
				this._collection.add(values);
			}
			this.app.callEvent("tableview:itemschanged", []);
			this.hideWindow();
		}
	}
}
