export const deleteConfirmation = (locale, confirmMessage) => webix.confirm({
	title: locale("confirm_title"),
	text: locale(confirmMessage),
	ok: locale("confirm_ok"),
	cancel: locale("confirm_no")
});

export const errorMessage = locale => webix.message({
	text: locale("error_message"),
	type: "error",
	expire: 10000
});
