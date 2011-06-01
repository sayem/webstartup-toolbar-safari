
function settingsChanged(event) {
	if (event.key == "updatetime") {	
		var locUpdateTime = safari.extension.settings.updatetime;
		var updateTime;
        if (locUpdateTime >= 1 && locUpdateTime <= 24) updateTime = locUpdateTime * 3600000;
        else updateTime = 3600000;		
	}
	else {
		var item = event.key;
		var id = '#ws_' + item;
		$(id).toggle();
			
		if ($('#ws_pagerank').is(':hidden') && $('#ws_alexa').is(':hidden')) $('.divider.ranks').remove();		
		else {
			var ranks = $('#ranks').html();
			if (ranks.search(/divider/) == -1) $('#ranks').append("<span class='divider ranks'></span>");
		}
		if ($('#ws_compete').is(':hidden') && $('#ws_quantcast').is(':hidden')) $('divider.uniqs').remove();
		else {
			var uniqs = $('#uniqs').html();
			if (uniqs.search(/divider/) == -1) $('#uniqs').append("<span class='divider ranks'></span>");	
		}
		if ($('#ws_googlebl').is(':hidden') && $('#ws_bingbl').is(':hidden') && $('#ws_yahoobl').is(':hidden')) $('divider.backlinks').remove();
		else {
			var backlinks = $('#backlinks').html();
			if (backlinks.search(/divider/) == -1) $('#backlinks').append("<span class='divider ranks'></span>");
		}		
		if ($('#ws_linkedin').is(':hidden')) $('.divider.linkedin').remove();
		else {
			var linkedin = $('#linkedin').html();
			if (linkedin.search(/divider/) == -1) $('#linkedin').append("<span class='divider ranks'></span>");
		}		
		if ($('#ws_crunchbase').is(':hidden')) $('.divider.crunchbase').remove();
		else {
			var crunchbase = $('#crunchbase').html();
			if (crunchbase.search(/divider/) == -1) $('#crunchbase').append("<span class='divider ranks'></span>");
		}
		if ($('#ws_reload_data').is(':hidden')) $('.divider.tools').remove();
		else {
			var reload = $('#reload').html();
			if (reload.search(/divider/) == -1) $('#reload').append("<span class='divider ranks'></span>");		
		}
	}
}

$(document).ready(function() {
	safari.extension.settings.addEventListener("change", settingsChanged, false);
});