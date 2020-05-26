//
//  JavaScript Restrictor is a browser extension which increases level
//  of security, anonymity and privacy of the user while browsing the
//  internet.
//
//	Copyright (C) 2020  Pavel Pohner
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//


if ((typeof browser) === "undefined") {
  var browser = chrome;
}

window.addEventListener("load", function() {
	/*if (!levels_initialised) {
		levels_updated_callbacks.push(insert_levels);
	}
	else {
		insert_levels();
	}*/
	loadWhitelist();
	load_on_off_switch();

});

document.getElementById("new_level").addEventListener("click",
	() => prepare_level_config("Add new level"));

document.getElementById("whitelist-add-button").addEventListener("click", () => add_to_whitelist());
document.getElementById("whitelist-remove-button").addEventListener("click", () => remove_from_whitelist());
document.getElementsByClassName("slider")[0].addEventListener("click", () => {setTimeout(control_http_request_shield, 200)});

function add_to_whitelist()
{	
	//obtain input value
	var to_whitelist = document.getElementById("whitelist-input").value;
	if (to_whitelist.trim() !== '')
	{
		var listbox = document.getElementById("whitelist-select");
		//Check if it's not in whitelist already
		for (var i = 0; i < listbox.length; i++)
		{
			if (to_whitelist == listbox.options[i].text)
			{
				alert("Hostname is already in the whitelist.");
				return;
			}
		}
		//Insert it
		listbox.options[listbox.options.length] = new Option(to_whitelist, to_whitelist);
		//Update background
		update_whitelist(listbox);

	}
	else
	{
		alert("Please fill in the hostname first.");
	}

}

function remove_from_whitelist()
{	
	var listbox = document.getElementById("whitelist-select");
	var selectedIndexes = getSelectValues(listbox);

	var j = 0;
	for (var i = 0; i < selectedIndexes.length; i++)
	{
		listbox.remove(selectedIndexes[i]-j);
		j++;
	}
	update_whitelist(listbox);
}

function update_whitelist(listbox)
{
	//Create new associative array
	var whitelistedHosts = new Object();
	//Obtain all whitelisted hosts from listbox
	for (var i = 0; i < listbox.length; i++)
		{
			whitelistedHosts[listbox.options[i].text] = true;
		}
		//Overwrite the whitelist in storage
		browser.storage.sync.set({"whitelistedHosts":whitelistedHosts});
		//Send message to background to update whitelist from storage
		sendMessage({message:"whitelist updated"});
}

function sendMessage(message)
{
	browser.runtime.sendMessage(message);
}

//Auxilary function for obtaining selected values from listbox
function getSelectValues(select) 
{
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(i);
    }
  }
  return result;
}
//Function called on window load, obtains whitelist from storage
//Displays it in listbox
function loadWhitelist()
{	
	var listbox = document.getElementById("whitelist-select");
	//Get the whitelist
	browser.storage.sync.get(["whitelistedHosts"], function(result)
	{
		if (result.whitelistedHosts != undefined)
      	{
      		//Create list box options for each item
	        var it = 0;
	        Object.keys(result.whitelistedHosts).forEach(function(key, index) {
	        	listbox.options[it++] = new Option(key, key);
			}, result.whitelistedHosts);
  		}
	});
}
//Function called on window load, obtains whether is the protection on or off
function load_on_off_switch()
{
	var checkbox = document.getElementById("switch-checkbox");
	//Obtain the information from storage
	browser.storage.sync.get(["requestShieldOn"], function(result)
	{
		//Check the box
		if (result.requestShieldOn || result.requestShieldOn == undefined)
		{
			checkbox.checked = true;
		}
		else
		{
			checkbox.checked = false;
		}
	});
}

//OnClick event handler for On/Off slider
function control_http_request_shield()
{
	var checkbox = document.getElementById("switch-checkbox");
	//Send appropriate message and store state into storage
	if (checkbox.checked)	//Turn ON
	{
		sendMessage({message:"turn request shield on"});
		browser.storage.sync.set({"requestShieldOn": true});
	}
	else
	{
		sendMessage({message:"turn request shield off"});
		browser.storage.sync.set({"requestShieldOn": false});
	}

}