//Enable by default, if we've never been set before
chrome.storage.sync.get('isEnabled', function(values){
	if(typeof values.isEnabled === "undefined") {
	    chrome.storage.sync.set({'isEnabled': true},function(){
		});
	}
    });


chrome.webRequest.onCompleted.addListener(function(details) {
	if(details.statusCode==404 &&details.type=="main_frame" ) {
	    console.log(details);

	    chrome.tabs.get(details.tabId, function(tab) {
			if(!tab)
			    console.log('tab is gone');
			else {
			    //Time to run the content script, but only if we are enabled
			    chrome.storage.sync.get('isEnabled', function(values){
				    //console.log(values);
				    if(typeof values.isEnabled === "undefined" || values.isEnabled) {
					if(tab.status=="loading") {
					    chrome.tabs.onUpdated.addListener(function (id, changeInfo, tab) {
						    if(id==details.tabId && changeInfo.status=="complete")
							chrome.tabs.executeScript(details.tabId, {file:"content_script.js"});
						    
						});
					}
					else
					    chrome.tabs.executeScript(details.tabId, {file:"content_script.js"}); 
					console.log("script should have been executed");
				    }
				});
			}

		    });



	    }
    },{urls:["<all_urls>"]});
