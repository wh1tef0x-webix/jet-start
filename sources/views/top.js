import {JetView, plugins} from "webix-jet";

import activities from "../models/activities";
import FormPopup from "./form";
import fields from "./form/formFields";
import HeaderView from "./header";

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
			template: "<span class='webix_icon wxi-#icon#'></span> #value# ",
			data: [
				{
					value: _("menu_contacts"),
					id: "contacts",
					icon: "user"
				},
				{
					value: _("menu_activities"),
					id: "activities",
					icon: "calendar"
				},
				{
					value: _("menu_settings"),
					id: "settings",
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
		this._popup = this.ui(FormPopup);
		this._popup.initParam({
			complexData: true,
			collection: activities,
			fields: fields(["Details", "TypeID", "ContactID", "DueDate", "State"]),
			saveClick: this.saveClick
		});
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
