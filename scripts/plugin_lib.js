function execute_wayback_lookup(tab, showOnError) {
    //console.log("executewmlookup_"+showOnError);
    if(!showOnError)
	execute_content_script(tab, "css/content.css", "scripts/auto_wayback_lookup.js");
    else
	execute_content_script(tab, "css/content.css", "scripts/manual_wayback_lookup.js");

}

function execute_content_script(tab, css, script) {

    //Don't need to check the availability API if we're on our own site
    if(getLocation(tab.url).hostname.indexOf("archive.org")>=0) {
	//console.log("im on archive.org");
	return;
    }
    
    //Time to run the content script, but only if we are enabled
    chrome.storage.sync.get('isEnabled', function(values){
	    //console.log(values);
	    if(typeof values.isEnabled === "undefined" || values.isEnabled) {
		if(tab.status=="loading") {
		    chrome.tabs.onUpdated.addListener(function executeContentScript (id, changeInfo, eventTab) {
			    if(id==tab.id && changeInfo.status=="complete")
				chrome.tabs.onUpdated.removeListener(executeContentScript);
			    
			    //console.log("tab loading id:"+id+" tabid="+tab.id);
			    chrome.tabs.insertCSS(tab.id, {file:css});
			    chrome.tabs.executeScript(tab.id, {file:"scripts/jquery-2.0.3.min.js"});
			    chrome.tabs.executeScript(tab.id, {file:"scripts/plugin_lib.js"});
			    chrome.tabs.executeScript(tab.id, {file:script});
			    
			});
		}
		else {
		    chrome.tabs.insertCSS(tab.id, {file:css});
		    chrome.tabs.executeScript(tab.id, {file:"scripts/jquery-2.0.3.min.js"});
		    chrome.tabs.executeScript(tab.id, {file:"scripts/plugin_lib.js"});
		    chrome.tabs.executeScript(tab.id, {file:script});
		    
		}
	    }
		
	});
}

function loadBanner() {
 
    var bodyElement = document.getElementsByTagName("body")[0];
    var wrapper = document.querySelector('.IA_banner_wrapper');
    if(!wrapper) {
	wrapper = document.createElement("div");
	bodyElement.insertBefore(wrapper,bodyElement.childNodes[0]);
    }
    else
	wrapper.innerHTML="";

    wrapper.className="IA_banner IA_banner_wrapper IA_banner_hidden";
    var banner = document.createElement("div");
    banner.className="IA_banner IA_banner_content";
    
    var text = document.createElement("span");
    text.innerText="Checking archive.org for availability... ";
    text.className="IA_banner IA_banner_message";
    banner.appendChild(text);

    var logo = document.createElement("img");
    logo.src=chrome.extension.getURL("images/insetIcon.png");
    logo.className="IA_banner_logo";
    logo.alt="Internet Archive Logo";
    banner.appendChild(logo);


    var newLink = document.createElement("a");
    newLink.className="IA_banner IA_banner_archive_link IA_banner_hidden";
    newLink.innerText="Visit this site as it was captured on ";
    
    var closeButton = document.createElement("img");
    closeButton.src=chrome.extension.getURL("images/closeButton.png");
    closeButton.className="IA_banner_close";
    closeButton.alt="Close Wayback Machine Link Popup";
    closeButton.addEventListener('click',function () {
	    //document.querySelector(".IA_banner_wrapper").className="IA_banner_wrapper IA_banner_hidden";
	    $(".IA_banner_wrapper").hide();
	    document.querySelector(".IA_banner_archive_link").className="IA_banner_archive_link IA_banner_hidden";
	},false);

    banner.appendChild(closeButton);
    banner.appendChild(newLink);
    wrapper.appendChild(banner);
    
}
function updateBannerSuccess(response,url) {
    document.querySelector('.IA_banner_message').innerText="This page is available via the Wayback Machine - ";
    
    var link = document.querySelector('a.IA_banner_archive_link');
    link.href="http://web.archive.org/web/"+response.archived_snapshots.closest.timestamp+"/"+url;
    link.innerText = "Visit this site as it was captured on "+convertFromTimestamp(response.archived_snapshots.closest.timestamp);

    link.className="IA_banner_archive_link";
    $(".IA_banner_wrapper").slideDown();
    //document.querySelector(".IA_banner_wrapper").className="IA_banner IA_banner_wrapper";
}    
function updateBannerFailure(response,url) {
    document.querySelector('.IA_banner_message').innerText="No copy found on the wayback machine";
    //document.querySelector(".IA_banner_wrapper").className="IA_banner IA_banner_wrapper";
    $(".IA_banner_wrapper").slideDown();
}
function updateBannerError() {
    document.querySelector('.IA_banner_message').innerText="Error accessing the wayback machine. Please try again later";
    //document.querySelector(".IA_banner_wrapper").className="IA_banner IA_banner_wrapper";
    $(".IA_banner_wrapper").slideDown();
}

function convertFromTimestamp(timestamp) {
    var year = timestamp.substring(0,4);
    var month = timestamp.substring(4,6);
    var day = timestamp.substring(6,8);
    var hour = timestamp.substring(8,10);
    var min = timestamp.substring(10,12);
    var sec = timestamp.substring(12,14);
    var datetime = new Date();
    datetime.setUTCFullYear(year);
    datetime.setUTCMonth(month);
    datetime.setUTCDate(day);
    datetime.setUTCHours(hour);
    datetime.setUTCMinutes(min);
    datetime.setUTCSeconds(sec);
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var dateString = datetime.getDate();
    dateString+= " " + monthNames[datetime.getMonth()+1];
    dateString+= ", " + (1900+datetime.getYear());
    dateString+= " " + datetime.getHours();
    dateString+= ":" + datetime.getMinutes();
    dateString+= ":" + datetime.getSeconds();
    return dateString; 
}

function wmAvailabilityCheck(url, onsuccess, onfail, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET","http://archive.org/wayback/available?url="+url,true);
    xhr.onreadystatechange = function() {
	if(xhr.readyState == 4) {
	    if(xhr.status==200) {
		var response = JSON.parse(xhr.responseText);

		if(response.archived_snapshots && 
		   response.archived_snapshots.closest && 
		   response.archived_snapshots.closest.available && 
		   response.archived_snapshots.closest.available==true && 
		   response.archived_snapshots.closest.status.indexOf("2")==0) {
		    
		    onsuccess(response,url);
		}
		else if(onfail && response.archived_snapshots && !response.archived_snapshots.hasOwnProperty('closest') ) {
			onfail(response,url)
		}
	    }
	    else {
		if(onerror)
		    onerror(response,url);
	    }

	}
    }
    xhr.send();

}


var getLocation = function(href) {
    var link = document.createElement("a");
    link.href=href;
    return link;
};