const dateToStrParser = webix.Date.dateToStr("%Y-%m-%d");

const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$update: (obj) => {
			if (typeof obj.Birthday === "object") {
				obj.Birthday = dateToStrParser(obj.Birthday);
			}
		}
	}
});

export default contacts;
