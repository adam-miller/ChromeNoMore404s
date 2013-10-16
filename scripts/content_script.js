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
	    //else
		//bannerError();
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

    //var header = document.createElement("span");
    //header.innerText="An archived copy of this page is available via the Wayback Machine - ";
    //header.className="IA_banner IA_banner_header";
    //banner.appendChild(header);

    var logo = document.createElement("img");
    logo.src=chrome.extension.getURL("images/insetIcon.png");
    logo.className="IA_banner_logo";
    logo.alt="Internet Archive Logo";
    banner.appendChild(logo);

    //banner.appendChild(document.createElement("br"));

    var newLink = document.createElement("a");
    newLink.className="IA_banner IA_banner_archive_link IA_banner_hidden";
    newLink.innerText="Visit this site as it was captured on ";
    
    var closeButton = document.createElement("img");
    closeButton.src=chrome.extension.getURL("images/closeButton.png");
    closeButton.className="IA_banner_close";
    closeButton.alt="Close Wayback Machine Link Popup";
    closeButton.addEventListener('click',function () {

	    document.querySelector(".IA_banner_wrapper").className="IA_banner_wrapper IA_banner_hidden";
	    document.querySelector(".IA_banner_archive_link").className="IA_banner_archive_link IA_banner_hidden";
	},false);
    banner.appendChild(closeButton);

    banner.appendChild(newLink);

    wrapper.appendChild(banner);
    //setTimeout(function() {document.querySelector(".IA_banner_wrapper").className="IA_banner_wrapper" },200);
    
}

function updateBanner(response,currentLocation) {
    if(response.archived_snapshots && 
       response.archived_snapshots.closest && 
       response.archived_snapshots.closest.available && 
       response.archived_snapshots.closest.available==true && 
       response.archived_snapshots.closest.status.indexOf("2")==0) {

	document.querySelector(".IA_banner_wrapper").className="IA_banner IA_banner_wrapper";
	document.querySelector('.IA_banner_message').innerText="This page is available via the Wayback Machine - ";
	
	var link = document.querySelector('a.IA_banner_archive_link');
	link.href="http://web.archive.org/web/"+response.archived_snapshots.closest.timestamp+"/"+currentLocation;
	link.className="IA_banner_archive_link";
	link.innerText = "Visit this site as it was captured on "+convertFromTimestamp(response.archived_snapshots.closest.timestamp);
    }
    else {
	if(response.archived_snapshots && !response.archived_snapshots.hasOwnProperty('closest') ) {
	    document.querySelector('.IA_banner_message').innerText="No copy found on the wayback machine";
	}
	
    }
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
    dateString+= " " + monthNames[datetime.getMonth()];
    dateString+= ", " + (1900+datetime.getYear());
    dateString+= " " + datetime.getHours();
    dateString+= ":" + datetime.getMinutes();
    dateString+= ":" + datetime.getSeconds();
    return dateString; 
	//datetime.toString("MMM dd,yyyy");

    //return timestamp.substring(0,4)+"-"+timestamp.substring(4,6)+"-"+timestamp.substring(6,8);
}

function bannerError() {
    document.querySelector('.IA_banner_message').innerText="Error accessing the wayback machine. Please try again later";
}



//document.body.style.backgroundColor="#DADADA"
