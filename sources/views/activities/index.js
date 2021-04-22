import {JetView} from "webix-jet";

import ActivitiesButton from "./activitiesButton";
import ActivitiesTable from "./activitiesTable";

import "../../styles/activities.css";

export default class ActivitiesView extends JetView {
	config() {
		return {
			css: "activities",
			rows: [
				{$subview: ActivitiesButton},
				{$subview: ActivitiesTable}
			]
		};
	}
}

