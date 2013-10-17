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
		//Time to run the content script, but only if we are enabled
		chrome.storage.sync.get('isEnabled', function(values){
			//console.log(values);
			if(typeof values.isEnabled === "undefined" || values.isEnabled) {
			    if(tab.status=="loading") {
				chrome.tabs.onUpdated.addListener(function executeContentScript (id, changeInfo, tab) {
					if(id==details.tabId && changeInfo.status=="complete")
					    chrome.tabs.onUpdated.removeListener(executeContentScript);
					chrome.tabs.insertCSS(details.tabId, {file:"css/content.css"});
					chrome.tabs.executeScript(details.tabId, {file:"scripts/content_script.js"});
					
				    });
			    }
			    else {
				chrome.tabs.insertCSS(details.tabId, {file:"css/content.css"});
				chrome.tabs.executeScript(details.tabId, {file:"scripts/content_script.js"}); 
			    }
			}
		    });
	    }
	    //else
	    //  console.log("tab is gone");
	    
	});
}