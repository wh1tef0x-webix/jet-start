import {JetView} from "webix-jet";

import * as picture from "../../images/blank-avatar.png";
import contacts from "../../models/contacts";
import "../../styles/contacts.css";
import statuses from "../../models/statuses";

const INPUT_ID = "contacts:input";
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
							localId: INPUT_ID,
							view: "text",
							placeholder: _("contact_filter_placeholder"),
							on: {
								onTimedKeyPress: this.listFilter.bind(this)
							}
						},
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
	}

	urlChange() {
		contacts.waitData.then(() => {
			const list = this.$$(LIST_ID);
			const selectedId = list.getSelectedId();
			const contactId = this.getParam("contact_id", true);
			const url = this.getUrl();
			if (url[url.length - 1].page === "contacts") {
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

	listFilter() {
		const list = this.$$(LIST_ID);
		const input = this.$$(INPUT_ID)
			.getValue()
			.toLowerCase();
		if (input) {
			list.filter((obj) => {
				let filterResult = false;
				obj.FullName = obj.FirstName && obj.LastName ? `${obj.FirstName} ${obj.LastName}` : null;
				obj.Status = statuses.exists(obj.StatusID) ? statuses.getItem(obj.StatusID).Value : null;
				Object.entries(obj)
					.forEach(([, val]) => {
						filterResult = val.toString()
							.toLowerCase()
							.indexOf(input) !== -1 ? true : filterResult;
					});
				return filterResult;
			});
		}
		else {
			list.filter();
		}
		if (!list.getSelectedId()) {
			list.select(list.getFirstId());
		}
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
