import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";
import icons from "../../models/icons";

const activitiesDetailsField = _ => ({
	name: "Details",
	view: "textarea",
	label: _("table_details")
});

const activitiesTypeIDField = _ => ({
	name: "TypeID",
	view: "richselect",
	label: _("table_type"),
	validate: webix.rules.isNotEmpty,
	validateEvent: "key",
	invalidMessage: _("form_validate_not_empty"),
	options: {
		data: activityTypes,
		body: {
			template: "<span class='webix_icon wxi-#Icon#'></span> #Value#"
		}
	}
});


const activitiesContactIDField = _ => ({
	name: "ContactID",
	view: "richselect",
	label: _("table_contact"),
	validate: webix.rules.isNotEmpty,
	validateEvent: "key",
	invalidMessage: _("form_validate_not_empty"),
	options: {
		data: contacts,
		body: {
			template: obj => `${obj.FirstName} ${obj.LastName}`
		}
	}
});

const activitiesDueDataField = _ => ({
	cols: [
		{
			name: "DueDate.date",
			view: "datepicker",
			label: _("table_date"),
			type: "date",
			validate: webix.rules.isNotEmpty,
			validateEvent: "key",
			invalidMessage: _("form_validate_not_empty"),
			format: webix.Date.dateToStr("%Y-%m-%d"),
			stringResult: true
		},
		{
			name: "DueDate.time",
			view: "datepicker",
			label: _("table_time"),
			type: "time",
			validate: webix.rules.isNotEmpty,
			validateEvent: "key",
			invalidMessage: _("form_validate_not_empty"),
			format: webix.Date.dateToStr("%H:%i"),
			stringResult: true
		}
	]
});

const activitiesStateField = _ => ({
	name: "State",
	view: "checkbox",
	label: _("table_state"),
	uncheckValue: "Open",
	checkValue: "Close"
});

const valueField = _ => ({
	name: "Value",
	view: "text",
	label: _("table_value")
});

const iconField = _ => ({
	name: "Icon",
	view: "richselect",
	label: _("table_icon"),
	options: {
		data: icons,
		body: {
			template: "<span class='webix_icon wxi-#value#'></span> #value#"
		}
	}
});

const fields = (fieldIds = []) => {
	const fieldMap = {
		/* Activities fields */
		Details: activitiesDetailsField,
		TypeID: activitiesTypeIDField,
		ContactID: activitiesContactIDField,
		DueDate: activitiesDueDataField,
		State: activitiesStateField,
		/* Activity type and Status fields */
		Value: valueField,
		Icon: iconField
	};

	return fieldIds.map(id => fieldMap[id]);
};

export default fields;
