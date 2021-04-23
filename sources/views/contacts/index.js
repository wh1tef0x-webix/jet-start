import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import ContactView from "./contactsInfo";

import "../../styles/contacts.css";

const LIST_ID = "contacts:list";

export default class ContactsView extends JetView {
	config() {
		return {
			css: "contacts",
			cols: [
				{
					localId: LIST_ID,
					view: "list",
					gravity: 0.4,
					autowidth: true,
					select: true,
					template: obj => this.listTemplate(obj),
					type: {
						height: 50
					},
					on: {
						onAfterSelect: this.onAfterListSelect
					}
				},
				{$subview: ContactView}
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
			const id = contacts.exists(url[0].params.id) ? url[0].params.id : contacts.getFirstId();
			if (id) {
				list.select(id);
			}
			else {
				list.unselectAll();
			}
		});
	}

	listTemplate(obj) {
		return `<div class="list_item">
                <img alt="${obj.FirstName} ${obj.LastName} photo" src=${obj.Photo} class="list_item__avatar">
		        <div class="list_item__info"><span>${obj.FirstName} ${obj.LastName}</span><span>${obj.Company}</span></div>
	        </div>`;
	}

	onAfterListSelect(id) {
		this.setParam("id", id, true);
	}
}
