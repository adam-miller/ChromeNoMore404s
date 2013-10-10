
console.log("events registered");


chrome.webRequest.onCompleted.addListener(function(details) {
	if(details.statusCode==404 &&details.type=="main_frame" ) {
	    console.log(details);
	    
	    chrome.tabs.get(details.tabId, function(tab) {
			if(!tab)
			    console.log('tab is gone');
			else {
			    //console.log(tab);
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
    },{urls:["<all_urls>"]});


//not called at the moment
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ?
		    "from a content script:" + sender.tab.url :
		    "from the extension");

	if (request.wayback == "isAvailable") {

	    var xhr = new XMLHttpRequest();
	    xhr.open("GET","http://archive.org/wayback/available?url="+sender.tab.url,true);
	    //xhr.open("GET","http://archive.org/wayback/available?url=example.com",true);
	    xhr.onreadystatechange = function() {
		console.log(xhr.readyState);
		if(xhr.readyState == 4) {
		    var resp = JSON.parse(xhr.responseText);
		    //sendResponse(resp);
		}
	    }
	    //xhr.send();
	    //return true;
	}
  });
