import {JetView} from "webix-jet";

import * as picture from "../../images/blank-avatar.png";
import contacts from "../../models/contacts";
import "../../styles/contacts.css";

const LIST_ID = "contacts:list";

export default class ContactsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		this._subView = false;
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
		this.on(this.app, "contacts:changeurl", (props) => {
			this.setParam("contact_id", props.contactId, true);
			this.show(props.subView || "");
		});
		this.on(this.app, "contacts:subviewinit", (props) => {
			this._subView = props.subviewActive;
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const list = this.$$(LIST_ID);
			const subView = this._subView;
			const selectedId = list.getSelectedId();
			const contactId = this.getParam("contact_id", true);
			if (!subView) {
				this.show("info");
				if (!selectedId) {
					list.select(contactId || contacts.getFirstId());
				}
			}
			if (contactId && contactId !== selectedId) {
				list.select(contactId);
			}
		});
	}

	onAfterListSelect(id) {
		this.setParam("contact_id", id, true);
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
		this.show("../contacts/editor");
	}
}
