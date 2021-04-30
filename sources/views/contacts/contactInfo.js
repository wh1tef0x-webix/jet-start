import {JetView} from "webix-jet";

import * as blankAvatar from "../../images/blank-avatar.png";
import activities from "../../models/activities";
import contacts from "../../models/contacts";
import files from "../../models/files";
import statuses from "../../models/statuses";
import TableView from "../tables";
import columns from "../tables/tableColumns";

const TEMPLATE_ID = "contactinfo:template";
const NAME_ID = "contactinfo:fullname";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "toolbar",
					css: "contact_info__toolbar",
					borderless: true,
					cols: [
						{
							localId: NAME_ID,
							view: "label",
							css: "contact_info__name",
							label: `<span class="loading">${_("template_loading")}</span>`,
							gravity: 2
						},
						{
							view: "button",
							label: _("btn_delete"),
							css: "webix_transparent",
							type: "icon",
							icon: "wxi-trash",
							click: this.deleteContactClick.bind(this)
						},
						{
							view: "button",
							label: _("btn_edit"),
							css: "webix_transparent",
							type: "icon",
							icon: "wxi-pencil",
							click: this.editContactClick.bind(this)
						}
					]
				},
				{
					view: "template",
					localId: TEMPLATE_ID,
					borderless: true,
					template: this.getTemplate.bind(this)
				},
				{
					view: "tabview",
					cells: [
						{
							header: _("contact_activities_table"),
							body: {
								rows: [
									{
										$subview: new TableView({
											app: this.app,
											collection: activities,
											columns: columns(["State", "TypeID", "DueDate", "Details"]),
											filterCollection: true,
											onCheck: this.onCheck.bind(this),
											onEdit: this.onEditClick.bind(this),
											onDelete: this.onDeleteClick.bind(this)
										})
									},
									{
										cols: [
											{},
											{
												gravity: 0.4,
												view: "button",
												css: "webix_primary",
												label: _("activity_form_label_add"),
												click: this.addContactActivity.bind(this)
											}
										]
									}
								]
							}
						},
						{
							header: _("contact_files_table"),
							body: {
								rows: [
									{
										$subview: new TableView({
											app: this.app,
											collection: files,
											columns: columns(["Name", "ChangeDate", "Size"]),
											onDelete: this.onDeleteClick.bind(this)
										})
									},
									{
										cols: [
											{},
											{
												view: "uploader",
												value: _("contact_upload_file"),
												upload: "#",
												autosend: false,
												on: {
													onAfterFileAdd: this.onAfterFileAdd.bind(this)
												}
											},
											{}
										]
									}
								]
							}
						}
					]
				},
				{gravity: 0.05}
			]
		};
	}

	urlChange() {
		const contactId = this.getParam("contact_id", true) || contacts.getFirstId();
		this.setParam("contact_id", contactId, true);
		webix.promise.all([contacts.waitData, statuses.waitData])
			.then(() => {
				const contact = contacts.getItem(contactId);
				this.$$(NAME_ID)
					.setValue(`${contact.FirstName} ${contact.LastName}`);
				this.$$(TEMPLATE_ID)
					.setHTML(this.getTemplate(contact));
			});
	}

	onCheck(rowId, colId, state) {
		activities.updateItem(rowId, {State: state});
	}

	onEditClick(event, id) {
		const contactId = this.getParam("contact_id", true);
		const item = activities.getItem(id.row);
		this.app.callEvent("contactsform:show", [{
			activity: item,
			lockedFields: {ContactID: contactId}
		}]);
		return false;
	}

	onDeleteClick(collection) {
		return (event, id) => {
			const _ = this.app.getService("locale")._;
			webix.confirm({
				title: _("confirm_title"),
				text: _("confirm_message_activity"),
				ok: _("confirm_ok"),
				cancel: _("confirm_no")
			})
				.then(() => {
					collection.remove(id.row);
					this.app.callEvent("tableview:itemschanged", []);
				});
			return false;
		};
	}

	addContactActivity() {
		const contactId = this.getParam("contact_id", true);
		this.app.callEvent("contactsform:show", [{lockedFields: {ContactID: contactId}}]);
	}

	onAfterFileAdd(file) {
		const contactId = this.getParam("contact_id", true);
		files.add({
			ContactID: contactId,
			Name: file.name,
			ChangeDate: Date.now(),
			Size: file.size
		});
	}

	getTemplate(contact) {
		const photoBlock = this.getPhotoHTML(contact);
		const {
			firstColumn,
			secondColumn
		} = this.getInfoColumnsHTML(contact);
		return `<div class="contact_info__template">${photoBlock}${firstColumn}${secondColumn}</div>`;
	}

	getPhotoHTML(contact) {
		const _ = this.app.getService("locale")._;
		const photo = (contact && contact.Photo) ? contact.Photo : blankAvatar.default;
		const status = contact && statuses && statuses.getItem(contact.StatusID)
			? `<span class="contact_info__status"><span class="webix_icon wxi-${statuses.getItem(contact.StatusID).Icon}"></span>${statuses.getItem(contact.StatusID).Value}</span>`
			: `<span class="contact_info__status">${_("template_loading")}</span>`;
		return `<div class="contact_info__column image_column">
                	<img class="contact_info__image" src="${photo}" alt="Contact photo"/>
                    ${status}
               	</div>`;
	}

	getInfoColumnsHTML(contact) {
		const {
			email,
			skype,
			job,
			company,
			birthday,
			address
		} = this.getFields(contact);
		const firstColumn = `<div class="contact_info__column">
                                ${email}
                                ${skype}
                                ${job}
                                ${company}
                             </div>`;
		const secondColumn = `<div class="contact_info__column">
                                ${birthday.replace(/\d\d:\d\d/, "")}
                                ${address}
                             </div>`;
		return {
			firstColumn,
			secondColumn
		};
	}

	getFields(contact) {
		const _ = this.app.getService("locale")._;
		const fields = ["Email", "Skype", "Job", "Company", "Birthday", "Address"];
		const iconsMap = {
			Email: "mdi-email",
			Skype: "mdi-skype",
			Job: "mdi-tag",
			Company: "mdi-briefcase",
			Birthday: "mdi-calendar",
			Address: "mdi-map-marker"
		};
		if (!contact) {
			return fields.reduce((result, current) => {
				result[current.toLowerCase()] = `<span>
                                                    <span class="webix_icon mdi ${iconsMap[current]}"></span>
                                                    ${_("template_loading")}
                                                </span>`;
				return result;
			}, {});
		}
		return fields.reduce((result, current) => {
			result[current.toLowerCase()] = `<span><span class="webix_icon mdi ${iconsMap[current]}"></span> ${contact[current] ? contact[current] : "-"}</span>`;
			return result;
		}, {});
	}

	deleteContactClick() {
		const _ = this.app.getService("locale")._;
		const contactId = this.getParam("contact_id", true);
		webix.confirm({
			title: _("confirm_title"),
			text: _("confirm_message_contact"),
			ok: _("confirm_ok"),
			cancel: _("confirm_no")
		})
			.then(() => {
				webix.promise.all([contacts.waitData, activities.waitData])
					.then(() => {
						const data = activities.data.pull;
						Object.keys(data)
							.filter(key => data[key].ContactID.toString() === contactId)
							.forEach((id) => {
								activities.remove(id);
							});
					});
				contacts.remove(contactId);
				this.show("../");
			});
	}

	editContactClick() {
		const contactId = this.getParam("contact_id", true);
		this.show(`editor?contact_id=${contactId}`);
	}
}

