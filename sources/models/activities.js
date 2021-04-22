const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueDate = webix.Date.strToDate("%Y-%m-%d %h-%i")(obj.DueDate);
			obj.DueDate_date = webix.Date.dateToStr("%Y-%m-%d")(obj.DueDate);
			obj.DueDate_time = webix.Date.dateToStr("%H:%i")(obj.DueDate);
		},
		$save: (obj) => {
			if (obj.DueDate_date || obj.DueDate_time) {
				obj.DueDate_date = obj.DueDate_date
					? webix.Date.dateToStr("%Y-%m-%d")(obj.DueDate_date)
					: webix.Date.dateToStr("%Y-%m-%d")(new Date(Date.now()));
				obj.DueDate_time = obj.DueDate_time.match(/\d{2}:\d{2}/)[0] || "00:00";
				obj.DueDate = `${obj.DueDate_date} ${obj.DueDate_time}`;
				delete obj.DueDate_date;
				delete obj.DueDate_time;
			}
		}
	}
});

export default activities;
