import * as picture from "../images/blank-avatar.png";

const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			const defaultKeys = ["Company", "Job", "Address"];
			if (!obj.Photo) {
				obj.Photo = picture.default;
			}
			obj.FullName = `${obj.FirstName} ${obj.LastName}`;
			defaultKeys.forEach((key) => {
				if (!obj[key]) {
					obj[key] = "-";
				}
			});
		}
	}
});

export default contacts;
