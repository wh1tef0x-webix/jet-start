import {JetView} from "webix-jet";

import * as picture from "../../images/blank-avatar.png";
import contacts from "../../models/contacts";
import statuses from "../../models/statuses";

const TEMPLATE_ID = "contactinfo:template";
const NAME_ID = "contactinfo:fullname";

export default class ContactsInfo extends JetView {
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
							disabled: true
						},
						{
							view: "button",
							label: _("btn_edit"),
							css: "webix_transparent",
							type: "icon",
							icon: "wxi-pencil",
							disabled: true
						}
					]
				},
				{
					localId: TEMPLATE_ID,
					borderless: true,
					template: this.getTemplate()
				},
				{css: "colored_spacer"}
			]
		};
	}

	urlChange() {
		webix.promise.all([contacts.waitData, statuses.waitData])
			.then(() => {
				const contact = contacts.getItem(this.getParam("id", false));
				this.$$(NAME_ID)
					.setValue(contact.FullName);
				this.$$(TEMPLATE_ID)
					.define("template", this.getTemplate(contact));
				this.$$(TEMPLATE_ID)
					.refresh();
			});
	}

	getTemplate(contact) {
		const _ = this.app.getService("locale")._;
		const {
			email,
			skype,
			job,
			company,
			birthday,
			address
		} = this.getFields(contact);
		const photo = contact ? contact.Photo : picture.default;
		const status = contact && statuses && statuses.getItem(contact.StatusID)
			? `<span class="contact_info__status"><span class="webix_icon wxi-${statuses.getItem(contact.StatusID).Icon}"></span>${statuses.getItem(contact.StatusID).Value}</span>`
			: `<span class="contact_info__status">${_("template_loading")}</span>`;
		const photoBlock = `<div class="contact_info__column image_column">
                                <img class="contact_info__image" src="${photo}" alt="Contact photo"/>
                                ${status}
                            </div>`;
		const firstColumn = `<div class="contact_info__column">
                                ${email}
                                ${skype}
                                ${job}
                                ${company}
                             </div>`;
		const secondColumn = `<div class="contact_info__column">
                                ${birthday}
                                ${address}
                             </div>`;
		return `<div class="contact_info__template">${photoBlock}${firstColumn}${secondColumn}</div>`;
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
			result[current.toLowerCase()] = `<span><span class="webix_icon mdi ${iconsMap[current]}"></span> ${contact[current]}</span>`;
			return result;
		}, {});
	}
}

