if(chrome.tabs) {
    chrome.tabs.getSelected(null,function(tab){
	    if(tab.status=="loading") {
		chrome.tabs.onUpdated.addListener(function onStatusComplete (id, changeInfo, tab) {
			if(changeInfo.status=="complete") {
			    chrome.tabs.onUpdated.removeListener(onStatusComplete);
			    init();
			}
		    });	
	    }
	    else
		init();
	});
}
else
    init();


function init() {
    loadBanner();
    
    var currentLocation = window.location.toString();
    if(currentLocation.indexOf("dnsError.html")>=0 && currentLocation.indexOf("chrome-extension") >=0)
	currentLocation=window.location.search.slice(1);

    wmAvailabilityCheck(currentLocation,updateBannerSuccess,updateBannerFailure,updateBannerError);

    
}


