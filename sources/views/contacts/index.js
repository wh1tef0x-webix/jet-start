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

	urlChange() {
		contacts.waitData.then(() => {
			const list = this.$$(LIST_ID);
			const subView = this.getSubView();
			const selectedId = list.getSelectedId();
			const contactId = subView ? subView.getParam("contact_id", true) : null;
			if (!subView && !selectedId && list.getVisibleCount() > 0 && list.getFirstId()) {
				list.select(list.getFirstId());
			}
			if (contactId && contactId !== selectedId) {
				list.select(contactId);
			}
		});
	}

	onAfterListSelect(id) {
		const subView = this.getSubView();
		if (subView) {
			subView.setParam("contact_id", id, true);
		}
		else {
			this.show("info");
		}
	}

	listTemplate(obj) {
		return `<div class="list_item">
                <img alt="${obj.FirstName} ${obj.LastName} photo" src=${obj.Photo ? obj.Photo : picture.default} class="list_item__avatar">
		        <div class="list_item__info"><span>${obj.FirstName} ${obj.LastName}</span><span>${obj.Company}</span></div>
	        </div>`;
	}

	addContactClick() {
		this.$$(LIST_ID)
			.unselectAll();
		this.show("editor");
	}
}
