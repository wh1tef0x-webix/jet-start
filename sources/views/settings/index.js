import {JetView} from "webix-jet";

import activityTypes from "../../models/activityTypes";
import statuses from "../../models/statuses";
import FormPopup from "../form";
import fields from "../form/formFields";
import {deleteConfirmation} from "../messages";
import TableView from "../table";
import columns from "../table/tableColumns";


const LANGUAGE_ID = "settings:lang";
const STATUSES_TABLE = "table:statuses";
const ACTIVITY_TYPES_TABLE = "table:activity_types";
const STATUSES_FORM = "form:statuses";
const ACTIVITY_TYPES_FORM = "form:activity_types";

export default class SettingsView extends JetView {
	config() {
		const locale = this.app.getService("locale");
		return {
			css: "webix_shadow_medium colored_spacer",
			type: "space",
			rows: [
				{
					localId: LANGUAGE_ID,
					view: "segmented",
					label: locale._("settings_lang"),
					value: locale.getLang(),
					options: [
						{
							id: "en",
							value: "English"
						},
						{
							id: "ru",
							value: "Русский"
						}
					],
					on: {
						onAfterTabClick: value => this.app.getService("locale")
							.setLang(value)
					}
				},
				{
					cols: [
						{
							view: "label",
							label: locale._("settings_activity_types")
						},
						{},
						{
							view: "button",
							label: locale._("settings_add_activity_type"),
							autowidth: true,
							css: "webix_transparent",
							click: this.onActivityTypeAdd.bind(this)
						}
					]
				},
				{
					$subview: new TableView(this.app, ACTIVITY_TYPES_TABLE, {
						collection: activityTypes,
						columns: columns(["id", "Value", "Icon"]),
						onDelete: this.onDelete("confirm_message_activity_type"),
						onEdit: this.onEdit("activity_types")
					})
				},
				{
					cols: [
						{
							view: "label",
							label: locale._("settings_statuses")
						},
						{},
						{
							view: "button",
							label: locale._("settings_add_status"),
							autowidth: true,
							css: "webix_transparent",
							click: this.onStatusAdd.bind(this)
						}
					]
				},
				{
					$subview: new TableView(this.app, STATUSES_TABLE, {
						collection: statuses,
						columns: columns(["id", "Value", "Icon"]),
						onDelete: this.onDelete("confirm_message_status"),
						onEdit: this.onEdit("statuses")
					})
				},
				{}
			]
		};
	}

	init() {
		this._statusesPopup = this.ui(new FormPopup(this.app, STATUSES_FORM, {
			collection: statuses,
			fields: fields(["Value", "Icon"]),
			saveClick: this.saveClick
		}));
		this._activityTypesPopup = this.ui(new FormPopup(this.app, ACTIVITY_TYPES_FORM, {
			collection: activityTypes,
			fields: fields(["Value", "Icon"]),
			saveClick: this.saveClick
		}));
		this.on(this.app, `${STATUSES_FORM}:show`, props => this._statusesPopup.showWindow(props));
		this.on(this.app, `${ACTIVITY_TYPES_FORM}:show`, props => this._activityTypesPopup.showWindow(props));
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
			this.hideWindow();
		}
	}

	onDelete(message) {
		function onDeleteFunc(event, id) {
			const _ = this.app.getService("locale")._;
			deleteConfirmation(_, message)
				.then(() => {
					this._collection.remove(id.row);
				});
			return false;
		}

		return onDeleteFunc;
	}

	onEdit(formType) {
		function onEditFunc(event, id) {
			const item = this._collection.getItem(id.row);
			this.app.callEvent(`form:${formType}:show`, [{item}]);
			return false;
		}

		return onEditFunc;
	}

	onStatusAdd() {
		this.app.callEvent("form:statuses:show", []);
	}

	onActivityTypeAdd() {
		this.app.callEvent("form:activity_types:show", []);
	}
}
