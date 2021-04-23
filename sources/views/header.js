import {JetView} from "webix-jet";

const HEADER_LABEL_ID = "header:label";

export default class HeaderView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "toolbar",
			css: "webix_dark header",
			cols: [
				{
					localId: HEADER_LABEL_ID,
					view: "label",
					label: _("menu_top"),
					css: "header__label"
				}
			]
		};
	}

	urlChange(view, url) {
		const _ = this.app.getService("locale")._;
		const currentView = url[Object.keys(url).length - 1].page;
		this.$$(HEADER_LABEL_ID)
			.setValue(_(`menu_${currentView}`));
	}
}
