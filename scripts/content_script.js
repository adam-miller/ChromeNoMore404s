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
    
    var xhr = new XMLHttpRequest();
    var currentLocation = window.location.toString();

    if(currentLocation.indexOf("dnsError.html")>=0 && currentLocation.indexOf("chrome-extension") >=0)
	currentLocation=window.location.search.slice(1);


    xhr.open("GET","http://archive.org/wayback/available?url="+currentLocation,true);
    xhr.onreadystatechange = function() {
	if(xhr.readyState == 4) {
	    if(xhr.status==200) {
		var resp = JSON.parse(xhr.responseText);
		updateBanner(resp,currentLocation);
	    }
	    else
		bannerError();
	}
    }
    xhr.send();
    
}





function loadBanner(response, currentLocation) {
    

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

    var header = document.createElement("span");
    header.innerText="Internet Archive - No More 404s";
    header.className="IA_banner IA_banner_header";
    banner.appendChild(header);

    var logo = document.createElement("img");
    logo.src=chrome.extension.getURL("images/icon.png");
    logo.className="IA_banner_logo";
    banner.appendChild(logo);

    banner.appendChild(document.createElement("br"));

    var newLink = document.createElement("a");
    newLink.className="IA_banner IA_banner_archive_link IA_banner_hidden";
    newLink.innerText="Available on the Wayback Machine";
    
    var closeButton = document.createElement("img");
    closeButton.src=chrome.extension.getURL("images/closeButton.png");
    closeButton.className="IA_banner_close";
    closeButton.addEventListener('click',function () {

	    document.querySelector(".IA_banner_wrapper").className="IA_banner_wrapper IA_banner_hidden";
	    document.querySelector(".IA_banner_archive_link").className="IA_banner_archive_link IA_banner_hidden";
	},false);
    banner.appendChild(closeButton);

    banner.appendChild(newLink);

    wrapper.appendChild(banner);
    setTimeout(function() {document.querySelector(".IA_banner_wrapper").className="IA_banner_wrapper" },200);
    
}

function updateBanner(response,currentLocation) {
    if(response.archived_snapshots && 
       response.archived_snapshots.closest && 
       response.archived_snapshots.closest.available && 
       response.archived_snapshots.closest.available==true && 
       response.archived_snapshots.closest.status.indexOf("2")==0) {

	document.querySelector('.IA_banner_message').innerText="Last known working copy from "+convertFromTimestamp(response.archived_snapshots.closest.timestamp);
	var link = document.querySelector('a.IA_banner_archive_link');
	link.href="http://web.archive.org/web/"+response.archived_snapshots.closest.timestamp+"/"+currentLocation;
	link.className="IA_banner_archive_link";
    }
    else {
	if(response.archived_snapshots && !response.archived_snapshots.hasOwnProperty('closest') ) {
	    document.querySelector('.IA_banner_message').innerText="No copy found on the wayback machine";
	}
	
    }
}

function convertFromTimestamp(timestamp) {
    return timestamp.substring(0,4)+"-"+timestamp.substring(4,6)+"-"+timestamp.substring(6,8);
}

function bannerError() {
    document.querySelector('.IA_banner_message').innerText="Error accessing the wayback machine. Please try again later";
}



//document.body.style.backgroundColor="#DADADA"
