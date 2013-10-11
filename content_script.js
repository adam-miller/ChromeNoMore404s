


var xhr = new XMLHttpRequest();
//console.log("creating xhr");
xhr.open("GET","http://archive.org/wayback/available?url="+window.location,true);
//xhr.open("GET","http://archive.org/wayback/available?url=example.com",true);
//console.log("xhr now open");
xhr.onreadystatechange = function() {
    //console.log(xhr.readyState);
    if(xhr.readyState == 4) {
	var resp = JSON.parse(xhr.responseText);
	//sendResponse(resp);
	//console.log(resp);
	WM_loadBanner(resp);
    }
}
xhr.send();
	      
//Take a WM response object and load a link into the page
function WM_loadBanner(response) {
    if(response.archived_snapshots && 
       response.archived_snapshots.closest && 
       response.archived_snapshots.closest.available && 
       response.archived_snapshots.closest.available==true && 
       response.archived_snapshots.closest.status.indexOf("2")==0) {
	
	//console.log(response.archived_snapshots.closest.timestamp);
	
	var bodyElement = document.getElementsByTagName("body")[0];
	var banner = document.createElement("div");
	var text = document.createTextNode("Here is a link to an older version on archive.org - ");
	banner.setAttribute("style","display: block; position: relative; z-index: 99999; border: 1px solid; color: black; background-color: rgb(255, 255, 224); font-size: 15px; font-family: sans-serif; padding: 5px; ");
	//console.log(banner.style);
	banner.appendChild(text);
	var newLink = document.createElement("a");
	newLink.href="http://web.archive.org/web/"+response.archived_snapshots.closest.timestamp+"/"+window.location;
	newLink.innerText=newLink.href;
	var oldLink = document.createElement("a");
	oldLink.href=window.location;
	oldLink.innerText="(TEST)Original Link";
     
	banner.appendChild(newLink);
	banner.appendChild(oldLink);
	bodyElement.appendChild(banner);
    }

}



//document.body.style.backgroundColor="#DADADA"
