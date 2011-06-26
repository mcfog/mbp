chrome.extension.sendRequest({
	do: "getOptions"
}, function (S) {
	$('body').trigger('ext_init', S);
});

