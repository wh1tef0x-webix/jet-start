import {JetView} from "webix-jet";

const TABLE_ID = "tableview:table";

export default class TableView extends JetView {
	constructor({
		app,
		collection,
		columns,
		filterCollection = false,
		onEdit = null,
		onDelete = null,
		onCheck = null
	}) {
		super(app, "");
		this._collection = collection;
		this._columns = columns;
		this._filterCollection = filterCollection;
		this._onDelete = onDelete;
		this._onCheck = onCheck;
		this._onEdit = onEdit;
	}


	config() {
		const _ = this.app.getService("locale")._;
		let tableColumns = this._columns.map(col => col(_));
		if (this._onEdit) {
			tableColumns.push({
				id: "edit",
				header: "",
				adjust: "data",
				template: "<span class='webix_icon wxi-pencil'></span>"
			});
		}
		if (this._onDelete) {
			tableColumns.push({
				id: "delete",
				header: "",
				adjust: "data",
				template: "<span class='webix_icon wxi-trash'></span>"
			});
		}
		return {
			localId: TABLE_ID,
			view: "datatable",
			css: "table_view",
			scroll: "y",
			onClick: {
				...(this._onEdit) && {"wxi-pencil": this._onEdit},
				...(this._onDelete) && {"wxi-trash": this._onDelete(this._collection)}
			},
			on: {
				onAfterRender() {
					if (!this.count()) {
						this.showOverlay(_("table_empty"));
					}
					else {
						this.hideOverlay();
					}
				},
				...(this._onCheck) && {onCheck: this._onCheck}
			},
			columns: tableColumns
		};
	}

	init() {
		this.on(this.app, "tableview:itemschanged", () => {
			this.resetTableFilters();
		});
	}

	urlChange() {
		const contactId = this.getParam("contact_id", true);
		this._collection.waitData.then(() => {
			if (this._filterCollection) {
				this._collection.filter(obj => obj.ContactID.toString() === contactId.toString());
			}
			else {
				this._collection.filter();
			}
			this.$$(TABLE_ID)
				.sync(this._collection);
			this.resetTableFilters();
		});
	}

	resetTableFilters() {
		this.$$(TABLE_ID)
			.setState({filter: {}});
	}
}
