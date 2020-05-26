//
//  JavaScript Restrictor is a browser extension which increases level
//  of security, anonymity and privacy of the user while browsing the
//  internet.
//
//  Copyright (C) 2020  Pavel Pohner
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

// set browser var as chrome
var browser = chrome;

// Open options in a new tab when clicking on the icon
document.getElementById('controls').addEventListener('click', function (e) {
	browser.runtime.openOptionsPage();
	window.close();
});

window.addEventListener("load", function() {
	load_on_off_switch();
});

document.getElementsByClassName("slider")[0].addEventListener("click", () => {setTimeout(control_whitelist, 200)});

//Load switch state from storage for current site
function load_on_off_switch()
{
	var checkbox = document.getElementById("switch-checkbox");
	var currentHost = "";
	//Obtain URL of the current site
	browser.tabs.query({currentWindow: true, active: true}, function (tabs) 
    {
    	//Obtain hostname
		currentHost = new URL(tabs[0].url);
		currentHost = currentHost.hostname.replace(/^www\./,'');
		//Ask background whether is this site whitelisted or not
		browser.runtime.sendMessage({message:"is current site whitelisted?", site:currentHost}, function (response)
		{	
			//Check or uncheck the slider
			if (response === "current site is whitelisted")
			{
				checkbox.checked = true;
			}
			else
			{
				checkbox.checked = false;
			}
		});
    });
}

//Event handler for On/off switch
function control_whitelist()
{
	var checkbox = document.getElementById("switch-checkbox");

	var currentHost = "";
	//Obtain current site URL
	browser.tabs.query({currentWindow: true, active: true}, function (tabs) 
    {
    	//Obtain hostname
		currentHost = new URL(tabs[0].url);
		currentHost = currentHost.hostname.replace(/^www\./,'');
		//Send approriate message based on slider's state
      	if (checkbox.checked)	//Turn ON
		{
			browser.runtime.sendMessage({message:"add site to whitelist", site:currentHost}, function (response) {});
		}
		else
		{
			browser.runtime.sendMessage({message:"remove site from whitelist", site:currentHost}, function (response) {});
		}

    });

	
}


