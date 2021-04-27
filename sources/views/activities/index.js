import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";
import TableView from "../tables";
import columns from "../tables/tableColumns";
import ActivitiesPopup from "./activitiesForm";
import "../../styles/activities.css";

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return webix.promise.all([activityTypes.waitData, contacts.waitData])
			.then(() => ({
				css: "activities",
				rows: [
					{
						view: "toolbar",
						cols: [
							{},
							{
								view: "button",
								label: _("btn_add"),
								css: "webix_transparent",
								autowidth: true,
								type: "icon",
								icon: "wxi-plus-circle",
								click: this.addClick.bind(this)
							}
						]
					},
					new TableView({
						app: this.app,
						collection: activities,
						columns: columns(["State", "TypeID", "DueDate", "Details", "ContactID"]),
						onCheck: this.onCheck.bind(this),
						onEdit: this.onEdit.bind(this)
					})
				]
			}));
	}

	init() {
		this._popup = this.ui(ActivitiesPopup);
	}

	onCheck(rowId, colId, state) {
		activities.updateItem(rowId, {State: state});
	}

	onEdit(event, id) {
		const item = activities.getItem(id.row);
		this._popup.showWindow({activity: item});
		return false;
	}

	addClick() {
		this._popup.showWindow();
	}
}
