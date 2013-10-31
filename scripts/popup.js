
// redirect to the 'save' feature of wayback
function archive_now() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    archive_url = "http://web.archive.org/save/"+tabs[0].url;
	    chrome.tabs.update(tabs[0].id, {url:archive_url});
	});

}

function wm_lookup() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	    if(tabs[0]) {
		tab = tabs[0];
		execute_wayback_lookup(tab,true);
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

    wmLookupBtn = document.querySelector('#wm_lookup');
    wmLookupBtn.addEventListener('click',wm_lookup,false);
}    
document.addEventListener('DOMContentLoaded', init);

