const dateToStrParser = webix.Date.dateToStr("%Y-%m-%d %h:%i");

const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$update: (obj) => {
			if (typeof obj.Birthday === "object") {
				obj.Birthday = dateToStrParser(obj.Birthday);
			}
			if (typeof obj.StartDate === "object") {
				obj.StartDate = dateToStrParser(obj.StartDate);
			}
		}
	}
});

export default contacts;
