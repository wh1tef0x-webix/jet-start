import activityTypes from "../../models/activityTypes";
import contacts from "../../models/contacts";

const EMPTY_SELECT = "$webix_empty";
const DELETED_CONTACT = "activitiestable_contact_deleted";

const dateToStrParser = webix.Date.dateToStr("%d %M %Y");

const idColumn = () => ({
	id: "id",
	header: "",
	adjust: "data",
	sort: "int"
});

const contactsStateColumn = () => ({
	id: "State",
	header: "",
	adjust: "data",
	checkValue: "Close",
	uncheckValue: "Open",
	template: "{common.checkbox()}"
});

const contactsTypeIDColumn = _ => ({
	id: "TypeID",
	header: [
		_("table_type"),
		{
			content: "richSelectFilter",
			inputConfig: {
				suggest: {
					body: {
						template: obj => (obj.id === EMPTY_SELECT ? "" : `<span class="webix_icon wxi-${activityTypes.getItem(obj.id).Icon}"></span>${activityTypes.getItem(obj.id).Value}`)
					}
				}
			}
		}
	],
	adjust: "header",
	sort: "string",
	collection: activityTypes,
	template: obj => `<span class="webix_icon wxi-${activityTypes.getItem(obj.TypeID).Icon}"></span>${activityTypes.getItem(obj.TypeID).Value}`
});

const contactsDueDateColumn = _ => ({
	id: "DueDate",
	header: [
		_("table_date"),
		{
			content: "datepickerFilter",
			compare(cellValue, filterValue) {
				return cellValue.date === webix.Date.dateToStr("%Y-%m-%d")(filterValue);
			},
			inputConfig: {
				format: webix.Date.dateToStr("%d %M %Y")
			}
		}
	],
	fillspace: 1,
	sort: "string",
	format: obj => webix.Date.dateToStr("%d %M %Y")(obj.date)
});

const contactsDetailsColumn = _ => ({
	id: "Details",
	header: [_("table_details"), {content: "textFilter"}],
	sort: "string",
	fillspace: 2
});

const contactsContactIDColumn = _ => ({
	id: "ContactID",
	header: [
		_("table_contact"),
		{
			content: "richSelectFilter",
			inputConfig: {
				suggest: {
					body: {
						template: obj => (obj.id !== EMPTY_SELECT
							? `${contacts.getItem(obj.id).FirstName} ${contacts.getItem(obj.id).LastName}`
							: "")
					}
				}
			}
		}
	],
	sort: "string",
	fillspace: 1,
	collection: contacts,
	template: obj => (contacts.exists(obj.ContactID)
		? `${contacts.getItem(obj.ContactID).FirstName} ${contacts.getItem(obj.ContactID).LastName}`
		: _(DELETED_CONTACT))
});

const filesNameColumn = _ => ({
	id: "Name",
	header: _("table_filename"),
	sort: "string",
	fillspace: 2
});

const filesChangeDateColumn = _ => ({
	id: "ChangeDate",
	header: _("table_changedate"),
	sort: "string",
	fillspace: 1,
	format: obj => dateToStrParser(new Date(obj))
});

const filesSizeColumn = _ => ({
	id: "Size",
	header: _("table_filesize"),
	sort: "int"
});

const valueColumn = _ => ({
	id: "Value",
	header: _("table_value"),
	sort: "string",
	fillspace: 1
});

const iconColumn = _ => ({
	id: "Icon",
	header: _("table_icon"),
	sort: "string",
	template: "<span class='webix_icon wxi-#Icon#'></span> #Icon#",
	fillspace: 1
});

const columns = (columnIds = []) => {
	const colMap = {
		/* All columns */
		id: idColumn,
		/* Contacts columns */
		State: contactsStateColumn,
		TypeID: contactsTypeIDColumn,
		DueDate: contactsDueDateColumn,
		Details: contactsDetailsColumn,
		ContactID: contactsContactIDColumn,
		/* Files columns */
		Name: filesNameColumn,
		ChangeDate: filesChangeDateColumn,
		Size: filesSizeColumn,
		/* Activity type and Status columns */
		Value: valueColumn,
		Icon: iconColumn
	};

	return columnIds.map(id => colMap[id]);
};

export default columns;
