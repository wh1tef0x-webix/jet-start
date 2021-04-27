import {JetView} from "webix-jet";

import * as picture from "../../images/blank-avatar.png";
import contacts from "../../models/contacts";
import "../../styles/contacts.css";

const LIST_ID = "contacts:list";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			css: "contacts",
			cols: [
				{
					gravity: 0.4,
					rows: [
						{
							localId: LIST_ID,
							view: "list",
							autowidth: true,
							select: true,
							template: obj => this.listTemplate(obj),
							type: {
								height: 50
							},
							on: {
								onAfterSelect: this.onAfterListSelect.bind(this)
							}
						},
						{
							view: "button",
							label: _("btn_add_contact"),
							type: "icon",
							icon: "wxi-plus-circle",
							click: this.addContactClick.bind(this)
						}
					]
				},
				{
					$subview: true
				}
			]
		};
	}

	init() {
		this.$$(LIST_ID)
			.sync(contacts);
	}

	urlChange(view, url) {
		contacts.waitData.then(() => {
			const list = this.$$(LIST_ID);
			const lastView = url[url.length - 1].page;
			const contactId = url[url.length - 1].params.contact_id;
			const selectedId = list.getSelectedId();
			if (!selectedId && list.getVisibleCount() > 0) {
				list.select(list.getFirstId());
			}
			if (contactId && contactId !== selectedId) {
				list.select(contactId);
			}
			if (lastView === "contacts") {
				this.show("info");
			}
			if (lastView === "add_contact") {
				list.unselectAll();
			}
		});
	}

	listTemplate(obj) {
		return `<div class="list_item">
                <img alt="${obj.FirstName} ${obj.LastName} photo" src=${obj.Photo ? obj.Photo : picture.default} class="list_item__avatar">
		        <div class="list_item__info"><span>${obj.FirstName} ${obj.LastName}</span><span>${obj.Company}</span></div>
	        </div>`;
	}

	onAfterListSelect(id) {
		const url = this.getUrl();
		let topView = url[url.length - 1].page;
		if (topView === "add_contact" && id) {
			topView = "edit_contact";
		}
		if (topView === "contacts") {
			topView = `info/${topView}`;
		}
		this.show(`${topView}?contact_id=${id}`);
	}

	addContactClick() {
		this.show("add_contact");
	}
}
