function listTemplate(obj) {
	return `<div class="list_item">
                <img alt="${obj.FirstName} ${obj.LastName} photo" src=${obj.Photo} class="list_item__avatar">
		        <div class="list_item__info"><span>${obj.FirstName} ${obj.LastName}</span><span>${obj.Company}</span></div>
	        </div>`;
}

function onAfterListSelect(id) {
	this.$scope.setParam("id", id, true);
}

const contactsList = localId => Object({
	localId,
	view: "list",
	gravity: 0.4,
	autowidth: true,
	select: true,
	template: obj => listTemplate(obj),
	type: {
		height: 50
	},
	on: {
		onAFterSelect: onAfterListSelect
	}
});

export default contactsList;
