
// redirect to the 'save' feature of wayback
function archive_now() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    archive_url = "http://web.archive.org/save/"+tabs[0].url;
	    chrome.tabs.update(tabs[0].id, {url:archive_url});
	});

}

function wm_link() {
	var archive_url = $(this).attr('href');
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    if(tabs[0]) {
		tab = tabs[0];
		
		chrome.tabs.update(tabs[0].id, {url:archive_url});
		//execute_wayback_lookup(tab,true);
	    }
	});
}

// Saves options to localStorage.
function save_options() {
    chrome.storage.sync.set({'isEnabled': document.querySelector('#isEnabled').checked},function(){
	    //console.log("saved value of "+document.querySelector('#isEnabled').checked);
	});
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    chrome.storage.sync.get('isEnabled', function(values){
	    //console.log(values);
	    document.querySelector('#isEnabled').checked = values.isEnabled;
	});
}

function init() {
    restore_options();
    checkbox = document.querySelector('#isEnabled');
    checkbox.addEventListener('change', save_options, false);

    archiveNowBtn = document.querySelector('#archive_now');
    archiveNowBtn.addEventListener('click',archive_now, false);

    wmTimestampLink = document.querySelector('#resultTimestamp');
    wmTimestampLink.addEventListener('click',wm_link,false);


    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    if(tabs[0]) {
			tabs[0];
		    var currentLocation = tabs[0].url;
    		console.log(currentLocation);
    		if(currentLocation.indexOf("dnsError.html")>=0 && currentLocation.indexOf("chrome-extension") >=0)
				currentLocation=window.location.search.slice(1);
			wmAvailabilityCheck(currentLocation,onSuccess,onFailure,onError);
	    }
	});



}    
function onSuccess(response,url){
	$('img.loader').hide();
    $('#resultTimestamp').text(convertFromTimestamp(response.archived_snapshots.closest.timestamp));
	$('a#resultTimestamp').attr("href","http://web.archive.org/web/"+response.archived_snapshots.closest.timestamp+"/"+url);
	$('#resultWrapper').show();

}
function onFailure(response,url){
	$('img.loader').hide();
	$('#resultMessage').text("Lookup Failure");
	$('#resultTimestamp').text("");
	$('#resultWrapper').show();
}
function onError(response,url){
	$('img.loader').hide();
	$('#resultMessage').text("Error during lookup");
	$('#resultTimestamp').text("");
	$('#resultWrapper').show();
	
}
document.addEventListener('DOMContentLoaded', init);

