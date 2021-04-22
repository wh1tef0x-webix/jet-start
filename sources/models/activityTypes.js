const activityTypes = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activitytypes/ ",
	save: "http://localhost:8096/api/v1/activitytypes/"
});

export default activityTypes;
