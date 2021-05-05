const dateToStrParser = webix.Date.dateToStr("%Y-%m-%d");
const timeToStrParser = webix.Date.dateToStr("%H:%i");
const strToDateParser = webix.Date.strToDate("%Y-%m-%d");
const strToTimeParser = webix.Date.strToDate("%H:%i");

const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			if (typeof obj.DueDate === "string") {
				obj.DueDate = {
					date: dateToStrParser(obj.DueDate),
					time: timeToStrParser(obj.DueDate),
					timestamp: strToDateParser(obj.DueDate) / 1000
				};
			}
		},
		$update: (obj) => {
			if (typeof obj.DueDate !== "string") {
				obj.DueDate.timestamp = strToDateParser(obj.DueDate.date) / 1000;
			}
		},
		$save: (obj) => {
			const date = strToDateParser(obj.DueDate.date);
			const time = strToTimeParser(obj.DueDate.time);
			obj.DueDate = `${dateToStrParser(date)} ${timeToStrParser(time)}`;
		}
	}
});

export default activities;
