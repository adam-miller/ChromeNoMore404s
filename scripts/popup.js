console.log("options.js");

// Saves options to localStorage.
function save_options() {
    chrome.storage.sync.set({'isEnabled': document.querySelector('#isEnabled').checked},function(){
	    //console.log("saved value of "+document.querySelector('#isEnabled').checked);
	});
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    chrome.storage.sync.get('isEnabled', function(values){
	    console.log(values);
	    document.querySelector('#isEnabled').checked = values.isEnabled;
	});
}

function init() {
    restore_options();
    checkbox = document.querySelector('#isEnabled');
    checkbox.addEventListener('change', save_options, false);

}    
document.addEventListener('DOMContentLoaded', init);

