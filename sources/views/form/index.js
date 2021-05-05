import {JetView} from "webix-jet";

const LABEL_ID = "formview:label";
const FORM_ID = "formview:form";
const SAVEBTN_ID = "formview:savebtn";

export default class FormPopup extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		this._formId = FORM_ID;
		return {
			view: "popup",
			position: "center",
			width: 600,
			on: {
				onHide: this.onHide.bind(this)
			},
			body: {
				rows: [
					{
						localId: LABEL_ID,
						view: "label",
						align: "center",
						label: _("form_label_add")
					},
					{
						localId: this._formId,
						view: "form",
						complexData: this._complexData || false,
						elements: this._fields || []
					},
					{
						cols:
							[
								{
									gravity: 0.5
								},
								{
									localId: SAVEBTN_ID,
									gravity: 0.25,
									view: "button",
									label: _("btn_add"),
									css: "webix_primary",
									click: this._saveClick && this._saveClick.bind(this)
								},
								{
									gravity: 0.25,
									view: "button",
									label: _("btn_cancel"),
									click: this.hideWindow.bind(this)
								}
							]
					}
				]
			}
		};
	}

	initParam({
		collection,
		fields,
		complexData = false,
		saveClick = null
	}) {
		const _ = this.app.getService("locale")._;
		this._collection = collection;
		this._fields = fields.map(field => field(_));
		this._complexData = complexData;
		this._saveClick = saveClick;
		this.refresh();
	}

	onHide() {
		const form = this.$$(FORM_ID);
		if (form) {
			form.clear();
			form.clearValidation();
		}
	}

	showWindow({
		item,
		lockedFields
	} = {}) {
		const form = this.$$(FORM_ID);
		if (item) {
			const _ = this.app.getService("locale")._;
			const label = this.$$(LABEL_ID);
			const saveBtn = this.$$(SAVEBTN_ID);
			label.setValue(_("form_label_edit"));
			saveBtn.define("label", _("btn_save"));
			saveBtn.refresh();
			form.setValues(item);
		}
		if (lockedFields) {
			form.setValues(lockedFields, true);
			Object.keys(lockedFields)
				.forEach((field) => {
					form.queryView({name: field})
						.disable();
				});
		}
		this.getRoot()
			.show();
	}

	hideWindow() {
		this.getRoot()
			.hide();
	}
}

