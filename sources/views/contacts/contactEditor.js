import {JetView} from "webix-jet";

import * as blankAvatar from "../../images/blank-avatar.png";
import contacts from "../../models/contacts";
import statuses from "../../models/statuses";
import "../../styles/contact_form.css";

const LABEL_ID = "contacteditor:label";
const FORM_ID = "contacteditor:form";
const PHOTO_TEMPLATE_ID = "contacteditor:photo";
const ADDBTN_ID = "contacteditor:addbtn";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const edit = !!this.getParam("contact_id", true);
		const dateFormat = webix.Date.dateToStr("%d %M %Y");
		const photo = blankAvatar.default;
		const labelWidth = 100;
		const margin = 15;
		return {
			localId: FORM_ID,
			view: "form",
			css: "contact_form",
			elements: [
				{
					localId: LABEL_ID,
					view: "label",
					label: edit ? _("contact_form_label_edit") : _("contact_form_label_add"),
					css: "contact_form__header"
				},
				{
					margin,
					cols: [
						{
							margin,
							rows: [
								{
									labelWidth,
									name: "FirstName",
									label: _("contact_form_label_first_name"),
									view: "text",
									validate: webix.rules.isNotEmpty,
									validateEvent: "blur",
									invalidMessage: _("activity_form_validate_not_empty")
								},
								{
									labelWidth,
									name: "LastName",
									label: _("contact_form_label_last_name"),
									view: "text",
									validate: webix.rules.isNotEmpty,
									validateEvent: "blur",
									invalidMessage: _("activity_form_validate_not_empty")
								},
								{
									labelWidth,
									name: "StartDate",
									label: _("contact_form_label_joining_date"),
									view: "datepicker",
									format: dateFormat
								},
								{
									labelWidth,
									name: "StatusID",
									label: _("contact_form_label_status"),
									view: "richselect",
									css: "icons_selector",
									validate: webix.rules.isNotEmpty,
									validateEvent: "key",
									invalidMessage: _("activity_form_validate_not_empty"),
									options: {
										template: "<span class='span_centered'><span class='webix_icon mdi mdi-#Icon#'></span>#Value#</span>",
										body: {
											data: statuses,
											template: "<span class='span_centered'><span class='webix_icon mdi mdi-#Icon#'></span>#Value#</span>"
										}
									}
								},
								{
									labelWidth,
									name: "Job",
									label: _("contact_form_label_job"),
									view: "text"
								},
								{
									labelWidth,
									name: "Company",
									label: _("contact_form_label_company"),
									view: "text"
								},
								{
									labelWidth,
									name: "Website",
									label: _("contact_form_label_website"),
									view: "text"
								},
								{
									labelWidth,
									name: "Address",
									label: _("contact_form_label_address"),
									view: "text"
								}
							]
						},
						{
							margin,
							rows: [
								{
									labelWidth,
									name: "Email",
									label: _("contact_form_label_email"),
									view: "text"
								},
								{
									labelWidth,
									name: "Skype",
									label: _("contact_form_label_skype"),
									view: "text"
								},
								{
									labelWidth,
									name: "Phone",
									label: _("contact_form_label_phone"),
									view: "text"
								},
								{
									labelWidth,
									name: "Birthday",
									label: _("contact_form_label_birthday"),
									view: "datepicker",
									format: dateFormat
								},
								{
									cols: [
										{
											localId: PHOTO_TEMPLATE_ID,
											borderless: true,
											template: `<img class="contact_form__photo" alt="Contact photo" src="${photo}">`
										},
										{
											rows: [
												{},
												{
													view: "uploader",
													value: _("contact_form_label_change_photo"),
													autosend: false,
													upload: "#",
													on: {
														onAFterFileAdd: this.onAfterFileAdd.bind(this)
													}
												},
												{
													view: "button",
													label: _("contact_form_label_delete_photo"),
													click: this.clearPhotoClick.bind(this)
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{},
				{
					view: "toolbar",
					borderless: true,
					cols: [
						{},
						{
							cols: [
								{
									view: "button",
									label: _("btn_cancel"),
									click: this.cancelClick.bind(this)
								},
								{
									localId: ADDBTN_ID,
									view: "button",
									label: edit ? _("btn_save") : _("btn_add"),
									css: "webix_primary",
									click: this.saveClick.bind(this)
								}
							]
						}
					]
				}
			]
		};
	}

	urlChange() {
		const _ = this.app.getService("locale")._;
		const contactId = this.getParam("contact_id", true);
		const contactForm = this.$$(FORM_ID);
		const contactPhoto = this.$$(PHOTO_TEMPLATE_ID);
		const formLabel = this.$$(LABEL_ID);
		const addBtn = this.$$(ADDBTN_ID);
		if (contactId) {
			formLabel.setValue(_("contact_form_label_edit"));
			addBtn.define("label", _("btn_save"));
			webix.promise.all([contacts.waitData, statuses.waitData])
				.then(() => {
					const values = contacts.getItem(contactId);
					const photo = values.Photo || blankAvatar.default;
					contactForm.setValues(values);
					contactPhoto.define("template", `<img class="contact_form__photo" alt="Contact photo" src="${photo}">`);
					contactPhoto.refresh();
				});
		}
		else {
			contactForm.clear();
			formLabel.setValue(_("contact_form_label_add"));
			addBtn.define("label", _("btn_add"));
		}
		addBtn.refresh();
	}

	onAfterFileAdd(file) {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			const base64 = reader.result;
			const contactForm = this.$$(FORM_ID);
			const contactPhoto = this.$$(PHOTO_TEMPLATE_ID);
			contactForm.setValues({Photo: base64}, true);
			contactPhoto.define("template", `<img class="contact_form__photo" alt="Contact photo" src="${base64}">`);
			contactPhoto.refresh();
		}, false);

		if (file) {
			reader.readAsDataURL(file.file);
		}
	}


	saveClick() {
		const _ = this.app.getService("locale")._;
		const form = this.$$(FORM_ID);
		const values = form.getValues();
		let contactId = values.id;
		if (form.validate() && form.isDirty()) {
			if (contactId) {
				contacts.updateItem(contactId, values);
				webix.message(_("contact_form_update_message"));
			}
			else {
				contactId = contacts.add(values);
				webix.message(_("contact_form_add_message"));
				this.setParam("id", contactId);
			}
			this.show("../info");
		}
	}

	cancelClick() {
		const contactId = this.getParam("contact_id", true);
		const nextPage = contactId ? `info?contact_id=${contactId}` : "info";
		this.$$(FORM_ID)
			.clear();
		this.show(nextPage);
	}

	clearPhotoClick() {
		const contactForm = this.$$(FORM_ID);
		const contactPhoto = this.$$(PHOTO_TEMPLATE_ID);
		contactPhoto.define("template", `<img class="contact_form__photo" alt="Contact photo" src="${blankAvatar.default}">`);
		contactPhoto.refresh();
		contactForm.setValues({Photo: ""}, true);
	}
}
