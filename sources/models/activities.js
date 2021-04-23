const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueDate = {
				date: webix.Date.dateToStr("%Y-%m-%d")(obj.DueDate),
				time: webix.Date.dateToStr("%H:%i")(obj.DueDate)
			};
		},
		$save: (obj) => {
			const date = webix.Date.strToDate("%Y-%m-%d")(obj.DueDate.date);
			const time = webix.Date.strToDate("%H:%i")(obj.DueDate.time);
			obj.DueDate = `${webix.Date.dateToStr("%Y-%m-%d")(date)} ${webix.Date.dateToStr("%H:%i")(time)}`;
		}
	}
});

export default activities;
