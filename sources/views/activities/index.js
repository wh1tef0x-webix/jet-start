import {JetView} from "webix-jet";

import activities from "../../models/activities";
import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";
import {deleteConfirmation} from "../messages";
import TableView from "../table";
import columns from "../table/tableColumns";

import "../../styles/activities.css";

const VIEW_ID = "activitied:view";
const TABBAR_ID = "activities:tabbar";
const FILTER_ALL = "filterAll";
const FILTER_OVERDUE = "filterOverdue";
const FILTER_COMPLETED = "filterCompleted";
const FILTER_TODAY = "filterToday";
const FILTER_TOMORROW = "filterTomorrow";
const FILTER_WEEK = "filterWeek";
const FILTER_MONTH = "filterMonth";

const strToDate = webix.Date.strToDate("%Y-%m-%d %H:%i");

export default class ActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return webix.promise.all([activityTypes.waitData, contacts.waitData])
			.then(() => ({
				localId: VIEW_ID,
				css: "activities",
				rows: [
					{
						view: "toolbar",
						cols: [
							{
								view: "tabbar",
								localId: TABBAR_ID,
								borderless: true,
								value: FILTER_ALL,
								on: {
									onChange: this.onTabChange.bind(this)
								},
								options: [
									{
										value: _("activities_filter_all"),
										id: FILTER_ALL
									},
									{
										value: _("activities_filter_overdue"),
										id: FILTER_OVERDUE
									},
									{
										value: _("activities_filter_completed"),
										id: FILTER_COMPLETED
									},
									{
										value: _("activities_filter_today"),
										id: FILTER_TODAY
									},
									{
										value: _("activities_filter_tomorrow"),
										id: FILTER_TOMORROW
									},
									{
										value: _("activities_filter_week"),
										id: FILTER_WEEK
									},
									{
										value: _("activities_filter_month"),
										id: FILTER_MONTH
									}
								]
							},
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
						onCheck: this.onCheck,
						onEdit: this.onEdit,
						onDelete: this.onDelete
					})
				]
			}));
	}


	ready() {
		const tabbar = this.$$(TABBAR_ID);
		const table = this.$$(VIEW_ID)
			.queryView("datatable");
		if (table) {
			table.registerFilter(
				tabbar,
				{
					columnId: "any",
					compare(cellValue, filterValue, obj) {
						const objDate = strToDate(`${obj.DueDate.date} ${obj.DueDate.time}`);
						const now = new Date(Date.now());
						switch (filterValue) {
							case FILTER_OVERDUE:
								return obj.State === "Open" && objDate.getTime() < now.getTime();
							case FILTER_COMPLETED:
								return obj.State === "Close";
							case FILTER_TODAY:
								return objDate.getFullYear() === now.getFullYear() &&
									objDate.getMonth() === now.getMonth() &&
									objDate.getDate() === now.getDate();
							case FILTER_TOMORROW:
								return objDate.getFullYear() === now.getFullYear() &&
									objDate.getMonth() === now.getMonth() &&
									objDate.getDate() === now.getDate() + 1;
							case FILTER_WEEK:
								return objDate.getFullYear() === now.getFullYear() &&
									objDate.getMonth() === now.getMonth() &&
									now.getDate() - now.getDay() + 1 <= objDate.getDate() &&
									objDate.getDate() <= now.getDate() - now.getDay() + 7;
							case FILTER_MONTH:
								return objDate.getFullYear() === now.getFullYear() &&
									objDate.getMonth() === now.getMonth();
							default:
								return true;
						}
					}
				},
				{
					getValue(view) {
						return view.getValue();
					},
					setValue(view, val) {
						view.setValue(val);
					}
				}
			);
		}
	}

	onTabChange() {
		const table = this.$$(VIEW_ID)
			.queryView("datatable");
		table.filterByAll();
	}

	onCheck(rowId, colId, state) {
		this._collection.updateItem(rowId, {State: state});
		this.app.callEvent("tableview:itemschanged", []);
	}

	onEdit(event, id) {
		const item = this._collection.getItem(id.row);
		this.app.callEvent("form:activities:show", [{item}]);
		return false;
	}

	onDelete(event, id) {
		const _ = this.app.getService("locale")._;
		deleteConfirmation(_, "confirm_message_activity")
			.then(() => {
				this._collection.remove(id.row);
				this.app.callEvent("tableview:itemschanged", []);
			});
		return false;
	}

	addClick() {
		this.app.callEvent("form:activities:show", []);
	}
}
