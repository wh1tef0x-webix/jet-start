import {JetView} from "webix-jet";

import contacts from "../../models/contacts";
import ContactView from "./contactsInfo";
import contactsList from "./contactsList";

import "../../styles/contacts.css";

const LIST_ID = "contacts:list";

export default class ContactsView extends JetView {
	config() {
		const list = contactsList(LIST_ID);
		return {
			css: "contacts",
			cols: [
				list,
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
}
