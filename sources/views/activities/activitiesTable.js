import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";
import ActivitiesPopup from "./activitiesForm";

const TABLE_ID = "activitiestable:table";

export default class ActivitiesTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			localId: TABLE_ID,
			view: "datatable",
			css: "activities__table",
			scroll: "y",
			onClick: {
				"wxi-pencil": this.onEditClick,
				"wxi-trash": this.onDeleteClick
			},
			on: {
				onCheck(rowId, colId, state) {
					activities.updateItem(rowId, {State: state});
				},
				onAfterRender() {
					if (!this.count()) {
						this.showOverlay(_("activitiestable_empty"));
					}
					else {
						this.hideOverlay();
					}
				}
			},
			columns: [
				{
					id: "State",
					header: "",
					adjust: "data",
					checkValue: "Close",
					uncheckValue: "Open",
					template: "{common.checkbox()}"
				},
				{
					id: "TypeID",
					header: [
						_("activitiestable_type"),
						{
							content: "richSelectFilter",
							inputConfig: {
								suggest: {
									body: {
										template: obj => (obj.id === "$webix_empty" ? "" : activityTypes.getItem(obj.id).Value)
									}
								}
							}
						}
					],
					adjust: "header",
					sort: "string",
					collection: activityTypes,
					template: obj => activityTypes.getItem(obj.TypeID).Value
				},
				{
					id: "DueDate",
					header: [
						_("activitiestable_date"),
						{
							content: "datepickerFilter",
							inputConfig: {
								format: webix.Date.dateToStr("%d %M %Y")
							}
						}
					],
					fillspace: 1,
					sort: "int",
					format: webix.Date.dateToStr("%d %M %Y")
				},
				{
					id: "Details",
					header: [_("activitiestable_details"), {content: "textFilter"}],
					sort: "string",
					fillspace: 2
				},
				{
					id: "ContactID",
					header: [
						_("activitiestable_contact"),
						{
							content: "richSelectFilter",
							inputConfig: {
								suggest: {
									body: {
										template: obj => (obj.id === "$webix_empty" ? "" : contacts.getItem(obj.id).FullName)
									}
								}
							}
						}
					],
					sort: "string",
					fillspace: 1,
					collection: contacts,
					template: obj => contacts.getItem(obj.ContactID).FullName
				},
				{
					id: "edit",
					header: "",
					adjust: "data",
					template: "<span class='webix_icon wxi-pencil'></span>"
				},
				{
					id: "delete",
					header: "",
					adjust: "data",
					template: "<span class='webix_icon wxi-trash'></span>"
				}
			]
		};
	}

	init() {
		this._popup = this.ui(ActivitiesPopup);
		webix.promise.all([activities.waitData, activityTypes.waitData, contacts.waitData])
			.then(() => {
				this.$$(TABLE_ID)
					.sync(activities);
			});
	}

	onEditClick(event, id) {
		this.$scope._popup.showWindow(id.row);
		return false;
	}

	onDeleteClick(event, id) {
		const _ = this.$scope.app.getService("locale")._;
		webix.confirm({
			title: _("confirm_title"),
			text: _("confirm_message"),
			ok: _("confirm_ok"),
			cancel: _("confirm_no")
		})
			.then(() => {
				activities.remove(id);
			});
		return false;
	}

	stateTemplate(obj) {
		return {
			view: "checkbox",
			value: obj.State === "Close"
		};
	}
}
