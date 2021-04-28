import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";

const LABEL_ID = "activitiesform:label";
const FORM_ID = "activitiesform:form";
const SAVEBTN_ID = "activitiesform:savebtn";

export default class ActivitiesPopup extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "popup",
			position: "center",
			width: 600,
			body: {
				rows: [
					{
						localId: LABEL_ID,
						view: "label",
						align: "center",
						label: _("activity_form_label_add")
					},
					{
						localId: FORM_ID,
						view: "form",
						complexData: true,
						elements: [
							{
								name: "Details",
								view: "textarea",
								label: _("activitiestable_details")
							},
							{
								name: "TypeID",
								view: "richselect",
								label: _("activitiestable_type"),
								validate: webix.rules.isNotEmpty,
								validateEvent: "key",
								invalidMessage: _("activity_form_validate_not_empty"),
								options: {
									data: activityTypes,
									body: {
										template: "#Value#"
									}
								}
							},
							{
								name: "ContactID",
								view: "richselect",
								label: _("activitiestable_contact"),
								validate: webix.rules.isNotEmpty,
								validateEvent: "key",
								invalidMessage: _("activity_form_validate_not_empty"),
								options: {
									data: contacts,
									body: {
										template: obj => `${obj.FirstName} ${obj.LastName}`
									}
								}
							},
							{
								cols: [
									{
										name: "DueDate.date",
										view: "datepicker",
										label: _("activitiestable_date"),
										type: "date",
										validate: webix.rules.isNotEmpty,
										validateEvent: "key",
										invalidMessage: _("activity_form_validate_not_empty"),
										format: webix.Date.dateToStr("%Y-%m-%d"),
										stringResult: true
									},
									{
										name: "DueDate.time",
										view: "datepicker",
										label: _("activitiestable_time"),
										type: "time",
										validate: webix.rules.isNotEmpty,
										validateEvent: "key",
										invalidMessage: _("activity_form_validate_not_empty"),
										format: webix.Date.dateToStr("%H:%i"),
										stringResult: true
									}
								]
							},
							{
								name: "State",
								view: "checkbox",
								label: _("activitiestable_state"),
								uncheckValue: "Open",
								checkValue: "Close"
							}
						]
					},
					{
						cols:
							[
								{
									gravity: 0.5
								},
								{
									localId: SAVEBTN_ID,
									gravity: 0.25,
									view: "button",
									label: _("btn_add"),
									css: "webix_primary",
									click: () => this.btnAddClick()
								},
								{
									gravity: 0.25,
									view: "button",
									label: _("btn_cancel"),
									click: () => this.hideWindow()
								}
							]
					}
				]
			}
		};
	}

	hideWindow() {
		const form = this.$$(FORM_ID);
		form.clear();
		form.clearValidation();
		this.getRoot()
			.hide();
	}

	showWindow({
		activity,
		lockedFields
	} = {}) {
		if (activity) {
			const _ = this.app.getService("locale")._;
			const label = this.$$(LABEL_ID);
			const saveBtn = this.$$(SAVEBTN_ID);
			const form = this.$$(FORM_ID);
			label.setValue(_("activity_form_label_edit"));
			saveBtn.define("label", _("btn_save"));
			saveBtn.refresh();
			form.setValues(activity);
		}
		if (lockedFields) {
			const form = this.$$(FORM_ID);
			form.setValues(lockedFields, true);
			Object.keys(lockedFields)
				.forEach((field) => {
					form.queryView({name: field})
						.disable();
				});
		}
		this.getRoot()
			.show();
	}

	btnAddClick() {
		const form = this.$$(FORM_ID);
		const values = form.getValues();
		if (form.validate() && form.isDirty()) {
			if (values.id) {
				activities.updateItem(values.id, values);
			}
			else {
				activities.add(values);
			}
			this.app.callEvent("tableview:itemadded", []);
			this.hideWindow();
		}
	}
}
