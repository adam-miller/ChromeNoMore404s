//Enable by default, if we've never been set before
chrome.storage.sync.get('isEnabled', function(values){
	if(typeof values.isEnabled === "undefined") {
	    chrome.storage.sync.set({'isEnabled': true},function(){
		});
	}
    });

chrome.webRequest.onErrorOccurred.addListener(function(details) {
	if(details.type=="main_frame" && details.error=="net::ERR_NAME_NOT_RESOLVED") {
	    chrome.tabs.update(details.tabId, {url: chrome.extension.getURL("html/dnsError.html") +"?"+ details.url});
	}

    },{urls:["http://*/*","https://*/*"]});

chrome.webRequest.onCompleted.addListener(function(details) {
	if(details.statusCode==404 &&details.type=="main_frame" ) {
	    executeContentScript(details);
	    }
    },{urls:["http://*/*","https://*/*"]});


function executeContentScript(details) {
    chrome.tabs.get(details.tabId, function(tab) {
	    if(tab) {
		//console.log("calling from background.js for tabid:"+details.tabId);
		execute_wayback_lookup(tab,false);
	    }
	});
}
