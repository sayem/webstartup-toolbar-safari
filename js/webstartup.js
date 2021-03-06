
window.WebStartup = {
    init: function () {
		WebStartup.wsdata = new Array();
		WebStartup.ajaxrank();			
    },
    getHost: function (url) {
        var host = url.replace(/^https{0,1}:\/\//, '');
        host = host.replace(/^www\./, '');
        host = host.replace(/^www[a-z,0-9,A-Z]\./, '');
        host = host.replace(/\/.*/,'');
        return host;
    },
    StrToNum: function (Str, Check, Magic) {
        var Int32Unit = 4294967296;
        var length = Str.length;
        for (var i = 0; i < length; i++) {
            Check *= Magic;
            if (Check >= Int32Unit) {
                Check = (Check - Int32Unit * parseInt(Check / Int32Unit));
                Check = (Check < -2147483648) ? (Check + Int32Unit) : Check;
            }
            Check += Str.charCodeAt(i);
        }
        return Check;
    },
    HashURL: function (String) {
        var Check1 = WebStartup.StrToNum(String, 0x1505, 0x21);
        var Check2 = WebStartup.StrToNum(String, 0, 0x1003F);
        Check1 >>= 2;
        Check1 = ((Check1 >> 4) & 0x3FFFFC0) | (Check1 & 0x3F);
        Check1 = ((Check1 >> 4) & 0x3FFC00) | (Check1 & 0x3FF);
        Check1 = ((Check1 >> 4) & 0x3C000) | (Check1 & 0x3FFF);
        var T1 = ((((Check1 & 0x3C0) << 4) | (Check1 & 0x3C)) << 2) | (Check2 & 0xF0F);
        var T2 = ((((Check1 & 0xFFFFC000) << 4) | (Check1 & 0x3C00)) << 0xA) | (Check2 & 0xF0F0000);
        return (T1 | T2);
    },
    CheckHash: function (Hashnum) {
        var CheckByte = 0;
        var Flag = 0;
        var HashStr;
        if (Hashnum < 0) HashStr = 4294967296 + Hashnum;
        else HashStr = Hashnum;
        HashStr = HashStr + '';
        var length = HashStr.length;
        for (var i = length - 1; i >= 0; i--) {
            Re = HashStr.charCodeAt(i) - 48;
            if ((Flag % 2) == 1) {
                Re += Re;
                Re = parseInt(Re / 10) + (Re % 10);
            }
            CheckByte += Re;
            Flag++;
        }
        CheckByte %= 10;
        if (CheckByte != 0) {
            CheckByte = 10 - CheckByte;
            if ((Flag % 2) == 1) {
                if ((CheckByte % 2) == 1) {
                    CheckByte += 9;
                }
                CheckByte >>= 1;
            }
        }
        return '7' + CheckByte + '' + HashStr;
    },
    addCommas: function (nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    ajaxrank: function () {
        WebStartup.currUrl = safari.application.activeBrowserWindow.activeTab.url;
        WebStartup.orgurl = WebStartup.currUrl.split("/");
        WebStartup.currUrl = WebStartup.getHost(WebStartup.currUrl);
        if (WebStartup.orgurl.length > 2) {
            if (WebStartup.wsdata[WebStartup.currUrl]) {
                var currTime = new Date().getTime();
				WebStartup.updateTime = updateTime;
                if (currTime - WebStartup.wsdata[WebStartup.currUrl]["time"] > WebStartup.updateTime) delete(WebStartup.wsdata[WebStartup.currUrl]);
            }
            if (WebStartup.wsdata[WebStartup.currUrl] && WebStartup.lastURL != WebStartup.currUrl) {
                WebStartup.resetData();
                WebStartup.setData();	
                if (WebStartup.wsdata[WebStartup.currUrl]["pr"] == ': n/a' && !($('#ws_pagerank').is(':hidden'))) {	
                    $(".ws_pagerank").html(": n/a");
                    $("#ws_pagerank").attr("title", "Google Pagerank: n/a");					
                    if (WebStartup.prxmlhttp) WebStartup.prxmlhttp.abort();
                    WebStartup.googleRank();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["alexa"] == ': n/a' && !($('#ws_alexa').is(':hidden'))) {
                    $(".ws_alexa").html(": n/a");
                    $("#ws_alexa").attr("title", "Alexa Rank: n/a");
                    if (WebStartup.alexaxmlhttp) WebStartup.alexaxmlhttp.abort();
                    WebStartup.alexaRank();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["compete"] == ': n/a' && !($('#ws_compete').is(':hidden'))) {
                    $(".ws_compete").html(": n/a");
                    $("#ws_compete").attr("title", "Compete, Monthly Uniques: n/a");
                    if (WebStartup.competexmlhttp) WebStartup.competexmlhttp.abort();
                    WebStartup.competeRank();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["quantcast"] == ': n/a' && !($('#ws_quantcast').is(':hidden'))) {
                    $(".ws_quantcast").html(": n/a");
                    $("#ws_quantcast").attr("title", "Quantcast, Monthly Uniques: n/a");
                    if (WebStartup.qcxmlhttp) WebStartup.qcxmlhttp.abort();
                    WebStartup.quantcastRank();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["yahoobl"] == ': n/a' && !($('#ws_yahoobl').is(':hidden'))) {
                    $(".ws_yahoobl").html(": n/a");
                    $("#ws_yahoobl").attr("title", "Yahoo Backlinks: n/a");
                    if (WebStartup.yahooxmlhttp) WebStartup.yahooxmlhttp.abort();
                    WebStartup.yahooBL();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["googlebl"] == ': n/a' && !($('#ws_googlebl').is(':hidden'))) {
                    $(".ws_googlebl").html(": n/a");
                    $("#ws_googlebl").attr("title", "Google Backlinks: n/a");
                    if (WebStartup.googleblxmlhttp) WebStartup.googleblxmlhttp.abort();
                    WebStartup.googleBL();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["bingbl"] == ': n/a' && !($('#ws_bingbl').is(':hidden'))) {
                    $(".ws_bingbl").html(": n/a");
                    $("#ws_bingbl").attr("title", "Bing Backlinks: n/a");
                    if (WebStartup.bingblxmlhttp) WebStartup.bingblxmlhttp.abort();
                    WebStartup.bingBL();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["linkedin"] == ': n/a' && !($('#ws_linkedin').is(':hidden'))) {
                    $(".ws_linkedin").html(": n/a");
                    $("#ws_linkedin").attr("title", "LinkedIn: n/a");
                    if (WebStartup.linkedinxmlhttp) WebStartup.linkedinxmlhttp.abort();
                    WebStartup.linkedinEmp();
                }
                if (WebStartup.wsdata[WebStartup.currUrl]["crunchbase"] == ': n/a' && !($('#ws_crunchbase').is(':hidden'))) {
                    $(".ws_crunchbase").html(": n/a");
                    $("#ws_crunchbase").attr("title", "CrunchBase: n/a");
                    if (WebStartup.crunchbasexmlhttp) WebStartup.crunchbasexmlhttp.abort();
                    WebStartup.crunchBase();
                }
                WebStartup.lastURL = WebStartup.currUrl;
                return;
            }
            WebStartup.lastURL = WebStartup.currUrl;
            if (WebStartup.wsdata[WebStartup.currUrl]) return;
            WebStartup.wsdata[WebStartup.currUrl] = new Array();
            WebStartup.wsdata[WebStartup.currUrl]["time"] = new Date().getTime();
            WebStartup.resetData();
            WebStartup.initWSData();			
            if (!($('ws_pagerank').is(':hidden'))) WebStartup.googleRank();
            if (!($('ws_alexa').is(':hidden'))) WebStartup.alexaRank();
            if (!($('ws_compete').is(':hidden'))) WebStartup.competeRank();
            if (!($('ws_quantcast').is(':hidden'))) WebStartup.quantcastRank();
            if (!($('ws_yahoobl').is(':hidden'))) WebStartup.yahooBL();
            if (!($('ws_googlebl').is(':hidden'))) WebStartup.googleBL();
            if (!($('ws_bingbl').is(':hidden'))) WebStartup.bingBL();
            if (!($('ws_linkedin').is(':hidden'))) WebStartup.linkedinEmp();  
            if (!($('ws_crunchbase').is(':hidden'))) WebStartup.crunchBase();
        } else {
            WebStartup.resetData();
            WebStartup.lastURL = "Trying...";
        }
    },
    initWSData: function () {
        WebStartup.wsdata[WebStartup.currUrl]["pr"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["alexa"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["compete"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["quantcast"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["googlebl"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["yahoobl"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["bingbl"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["linkedin"] = ': n/a';
        WebStartup.wsdata[WebStartup.currUrl]["crunchbase"] = ': n/a';
    },
    resetData: function () {
        $(".ws_pagerank").html(": n/a");
        $("#ws_pagerank").attr("title", "Google Pagerank: n/a");		
        if (WebStartup.prxmlhttp && WebStartup.prxmlhttp.readyState != 4) {
            WebStartup.prxmlhttp.abort();
            delete(WebStartup.prxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["pr"] = ': n/a';
        }
        $(".ws_alexa").html(": n/a");
        $("#ws_alexa").attr("title", "Alexa Rank: n/a");
        if (WebStartup.alexaxmlhttp && WebStartup.alexaxmlhttp.readyState != 4) {
            WebStartup.alexaxmlhttp.abort();
            delete(WebStartup.alexaxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["alexa"] = ': n/a';
        }
        $(".ws_compete").html(": n/a");
        $("#ws_compete").attr("title", "Compete, Monthly Uniques: n/a");
        if (WebStartup.competexmlhttp && WebStartup.competexmlhttp.readyState != 4) {
            WebStartup.competexmlhttp.abort();
            delete(WebStartup.competexmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["compete"] = ': n/a';
        }
        $(".ws_quantcast").html(": n/a");
        $("#ws_quantcast").attr("title", "Quantcast, Monthly Uniques: n/a");
        if (WebStartup.qcxmlhttp && WebStartup.qcxmlhttp.readyState != 4) {
            WebStartup.qcxmlhttp.abort();
            delete(WebStartup.qcxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["quantcast"] = ': n/a';
        }
        $(".ws_yahoobl").html(": n/a");
        $("#ws_yahoobl").attr("title", "Yahoo Backlinks: n/a");
        if (WebStartup.yahooxmlhttp && WebStartup.yahooxmlhttp.readyState != 4) {
            WebStartup.yahooxmlhttp.abort();
            delete(WebStartup.yahooxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["yahoobl"] = ': n/a';
        }
        $(".ws_googlebl").html(": n/a");
        $("#ws_googlebl").attr("title", "Google Backlinks: n/a");
        if (WebStartup.googleblxmlhttp && WebStartup.googleblxmlhttp.readyState != 4) {
            WebStartup.googleblxmlhttp.abort();
            delete(WebStartup.googleblxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["googlebl"] = ': n/a';
        }
        $(".ws_bingbl").html(": n/a");
        $("#ws_bingbl").attr("title", "Bing Backlinks: n/a");
        if (WebStartup.bingblxmlhttp && WebStartup.bingblxmlhttp.readyState != 4) {
            WebStartup.bingblxmlhttp.abort();
            delete(WebStartup.bingblxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["bingbl"] = ': n/a';
        }
        $(".ws_linkedin").html(": n/a");
        $("#ws_linkedin").attr("title", "LinkedIn: n/a");
        if (WebStartup.linkedinxmlhttp && WebStartup.linkedinxmlhttp.readyState != 4) {
            WebStartup.linkedinxmlhttp.abort();
            delete(WebStartup.linkedinxmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["linkedin"] = ': n/a';
        }
        $(".ws_crunchbase").html(": n/a");
        $("#ws_crunchbase").attr("title", "CrunchBase: n/a");
        if (WebStartup.crunchbasexmlhttp && WebStartup.crunchbasexmlhttp.readyState != 4) {
            WebStartup.crunchbasexmlhttp.abort();
            delete(WebStartup.crunchbasexmlhttp);
            WebStartup.wsdata[WebStartup.currUrl]["crunchbase"] = ': n/a';
        }
    },
    setData: function () {	
        $(".ws_pagerank").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["pr"]);
        $("#ws_pagerank").attr("title", 'Google Pagerank: ' + WebStartup.wsdata[WebStartup.currUrl]["pr"]);
        $(".ws_alexa").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["alexa"]);
        $("#ws_alexa").attr("title", 'Alexa Rank: ' + WebStartup.wsdata[WebStartup.currUrl]["alexa"]);
        $(".ws_compete").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["compete"]);
        $("#ws_compete").attr("title", 'Compete, Monthly Uniques: ' + WebStartup.wsdata[WebStartup.currUrl]["compete"]);
        $(".ws_quantcast").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["quantcast"]);
        $("#ws_quantcast").attr("title", 'Quantcast, Monthly Uniques: ' + WebStartup.wsdata[WebStartup.currUrl]["quantcast"]);
        $(".ws_googlebl").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["googlebl"]);
        $("#ws_googlebl").attr("title", 'Google Backlinks: ' + WebStartup.wsdata[WebStartup.currUrl]["googlebl"]);
        $(".ws_bingbl").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["bingbl"]);
        $("#ws_bingbl").attr("title", 'Bing Backlinks: ' + WebStartup.wsdata[WebStartup.currUrl]["bingbl"]);
        $(".ws_yahoobl").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["yahoobl"]);
        $("#ws_yahoobl").attr("title", 'Yahoo Backlinks: ' + WebStartup.wsdata[WebStartup.currUrl]["yahoobl"]);
        $(".ws_linkedin").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["linkedin"]);
        $("#ws_linkedin").attr("title", 'LinkedIn: ' + WebStartup.wsdata[WebStartup.currUrl]["linkedin"]);
        $(".ws_crunchbase").html(': ' + WebStartup.wsdata[WebStartup.currUrl]["crunchbase"]);
        $("#ws_crunchbase").attr("title", 'CrunchBase: ' + WebStartup.wsdata[WebStartup.currUrl]["crunchbase"]);
    },
    googleRank: function () {
        WebStartup.workingURL = 'http://toolbarqueries.google.com/tbr?client=navclient-auto&ch=' + WebStartup.CheckHash(WebStartup.HashURL(WebStartup.currUrl)) + '&features=Rank&q=info:' + encodeURIComponent(WebStartup.currUrl) + '&num=100&filter=0';
        WebStartup.prxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.prxmlhttp.onreadystatechange = function () {
            if (WebStartup.prxmlhttp.readyState == 4 && WebStartup.prxmlhttp.status == 200) {
                var rt = WebStartup.prxmlhttp.responseText;
                var pr = rt.substr(rt.lastIndexOf(':') + 1);
                pr = pr.substr(0, pr.length - 1);
                if (WebStartup.isInt(pr)) pr = pr + '/10';
                else pr = 'n/a';			
                $(".ws_pagerank").html(': ' + pr);
                $("#ws_pagerank").attr("title", 'Google Pagerank: ' + pr);
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["pr"] = pr;
            }
        };
        WebStartup.prxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.prxmlhttp.send(null);
    },
    alexaRank: function () {
        WebStartup.workingURL = 'http://xml.alexa.com/data?cli=10&dat=nsa&url=' + encodeURIComponent(WebStartup.currUrl);
        WebStartup.alexaxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.alexaxmlhttp.onreadystatechange = function () {
            if (WebStartup.alexaxmlhttp.readyState == 4 && WebStartup.alexaxmlhttp.status == 200) {
                var rt = WebStartup.alexaxmlhttp.responseText;
                var offset = rt.indexOf('<POPULARITY');
                var start = rt.indexOf('TEXT="', offset);
                var end = rt.indexOf('"', start + 6);
                var alexa;
                if (start == -1 || end == -1) alexa = 'n/a';
                else {
                    if (WebStartup.isInt(rt.substr(start + 6, end - start - 6))) alexa = WebStartup.addCommas(rt.substr(start + 6, end - start - 6));
                    else alexa = 'n/a';
                }
				$("#ws_alexa").attr("title", 'Alexa Rank: ' + alexa);
                $(".ws_alexa").html(': ' + alexa);
				$(".ws_alexa").attr("href", 'http://www.alexa.com/siteinfo/' + WebStartup.lastURL);
				$(".ws_alexa").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["alexa"] = alexa;
            }
        };
        WebStartup.alexaxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.alexaxmlhttp.send(null);
    },
    competeRank: function () {
        WebStartup.workingURL = 'http://data.compete.com/fast-cgi/MI?size=small&ver=3&d=' + encodeURIComponent(WebStartup.currUrl);
        WebStartup.competexmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.competexmlhttp.onreadystatechange = function () {
            if (WebStartup.competexmlhttp.readyState == 4 && WebStartup.competexmlhttp.status == 200) {
                var rt = WebStartup.competexmlhttp.responseText;
				var start = rt.indexOf('<count');
				var end = rt.indexOf('</count');
				var count = rt.substr(start + 7, end - start - 7).replace(/^\s+|\s+$/g,"");
				var compete;
				if (count == 0) compete = 'n/a';
				else if (count.length > 7) {
					if (WebStartup.isInt(count.slice(0,-8))) compete = count.slice(0,-8) + 'M';
					else compete = 'n/a';
				}  
				else if (count.length > 3) {
					if (WebStartup.isInt(count.slice(0,-4))) compete = count.slice(0,-4) + 'K';
					else compete = 'n/a';
				}
				else compete = count;
				$("#ws_compete").attr("title", 'Compete, Monthly Uniques: ' + compete);
                $(".ws_compete").html(': ' + compete);
				$(".ws_compete").attr("href", 'http://siteanalytics.compete.com/' + WebStartup.lastURL);
				$(".ws_compete").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["compete"] = compete;
            }
        };		
        WebStartup.competexmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.competexmlhttp.send(null);
    },
    quantcastRank: function () {
        WebStartup.workingURL = 'http://quantcast.com/' + encodeURIComponent(WebStartup.currUrl);
        WebStartup.qcxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.qcxmlhttp.onreadystatechange = function () {
            if (WebStartup.qcxmlhttp.readyState == 4 && WebStartup.qcxmlhttp.status == 200) {
                var rt = WebStartup.qcxmlhttp.responseText;
		var start = rt.indexOf('reach-wd');
		var quantcast;
		if (rt.indexOf('class="label">Global People') == -1) {
		    var us = rt.indexOf('>', start);
		    var end = rt.indexOf('<', us);
		    if (rt.substr(us + 1, end - us - 1).replace(/^\s+|\s+$/g,"") == "N/A") quantcast = 'n/a';
		    else if (us + 2 == end) quantcast = "n/a";
		    else 
			if (WebStartup.isInt(rt.substr(us + 1, end - us - 1).replace(/^\s+|\s+$/g,""))) 
			    quantcast = rt.substr(us + 1, end - us - 1).replace(/^\s+|\s+$/g,"");
		}
		else if (rt.indexOf('class="label">Global People') > 0) {
		    var global = rt.indexOf('"reach">', start);
		    var end = rt.indexOf('<p class="label"', global);
		    if (rt.substr(global + 8, end - global - 8).replace(/^\s+|\s+$/g,"") == "N/A") quantcast = 'n/a';
		    else if (global + 9 == end) quantcast = "n/a";
		    else 
			if (WebStartup.isInt(rt.substr(global + 8, end - global - 8).replace(/^\s+|\s+$/g,"")))
			    quantcast = rt.substr(global + 8, end - global - 8).replace(/^\s+|\s+$/g,"");
		}      
		else quantcast = "n/a";
		        $("#ws_quantcast").attr("title", 'Quantcast, Monthly Uniques: ' + quantcast);
                $(".ws_quantcast").html(': ' + quantcast);
				$(".ws_quantcast").attr("href", 'http://www.quantcast.com/' + WebStartup.lastURL);
				$(".ws_quantcast").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });	
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["quantcast"] = quantcast;
            }
        };
        WebStartup.qcxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.qcxmlhttp.send(null);
    },
    googleBL: function () {
        WebStartup.workingURL = 'http://www.google.com/search?filter=0&q=link:' + encodeURIComponent(WebStartup.currUrl);
        WebStartup.googleblxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.googleblxmlhttp.onreadystatechange = function () {
            if (WebStartup.googleblxmlhttp.readyState == 4 && WebStartup.googleblxmlhttp.status == 200) {
                var rt = WebStartup.googleblxmlhttp.responseText;
                var end = rt.indexOf('</b> linking to <b>' + encodeURIComponent(WebStartup.currUrl));
                var start = rt.lastIndexOf(' <b>', end - 1);
                var end_alt = rt.indexOf(' results<nobr>');
                var start_alt = rt.lastIndexOf(' ', end_alt - 1);
                if (start_alt < rt.lastIndexOf('>', end_alt - 1)) start_alt = rt.lastIndexOf('>', end_alt - 1);
                var c = 4;
                var googlebl = '';
                if (start == -1 || end == -1) {
                    if (start_alt == -1 || end_alt == -1) googlebl = '0';
                    else {
                        start = start_alt;
                        end = end_alt;
                        c = 1;
                    }
                }
                if (start != -1 && end != -1) {
                    if (WebStartup.isInt(rt.substr(start + c, end - start - c))) googlebl = rt.substr(start + c, end - start - c);
                    else googlebl = 'n/a';
                }
				$("#ws_googlebl").attr("title", 'Google Backlinks: ' + googlebl);
                $(".ws_googlebl").html(': ' + googlebl);
				$(".ws_googlebl").attr("href", 'http://www.google.com/search?hl=en&filter=0&lr=&ie=UTF-8&q=link:' + WebStartup.lastURL + '&filter=0');
				$(".ws_googlebl").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });	
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["googlebl"] = googlebl;
            }
        };
        WebStartup.googleblxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.googleblxmlhttp.send(null);
    },
    bingBL: function () {
        WebStartup.workingURL = 'http://www.bing.com/search?q=inbody:' + encodeURIComponent(WebStartup.currUrl) + '+-site:' + encodeURIComponent(WebStartup.currUrl);
        WebStartup.bingblxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.bingblxmlhttp.onreadystatechange = function () {
            if (WebStartup.bingblxmlhttp.readyState == 4 && WebStartup.bingblxmlhttp.status == 200) {
                var rt = WebStartup.bingblxmlhttp.responseText;
                var end = rt.indexOf(' results</span>');
                var start = rt.lastIndexOf('of ', end);
                var bingbl = '';
                if (start == -1 || end == -1) bingbl = '0';
                else {
                    if (WebStartup.isInt(rt.substr(start + 3, end - start - 3))) bingbl = rt.substr(start + 3, end - start - 3);
                    else bingbl = 'n/a';
                }
				$("#ws_bingbl").attr("title", 'Bing Backlinks: ' + bingbl);
                $(".ws_bingbl").html(': ' + bingbl);
				$(".ws_bingbl").attr("href", 'http://www.bing.com/search?q=inbody:' + WebStartup.lastURL + '+-site:' + WebStartup.lastURL);
				$(".ws_bingbl").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });			
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["bingbl"] = bingbl;
            }
        };
        WebStartup.bingblxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.bingblxmlhttp.send(null);
    },
    yahooBL: function () {
        WebStartup.workingURL = 'http://siteexplorer.search.yahoo.com/siteexplorer/search?p=' + encodeURIComponent(WebStartup.currUrl) + '&bwm=i&bwmo=d&bwmf=u';
        WebStartup.yahooxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.yahooxmlhttp.onreadystatechange = function () {
            if (WebStartup.yahooxmlhttp.readyState == 4 && WebStartup.yahooxmlhttp.status == 200) {
                var rt = WebStartup.yahooxmlhttp.responseText;
                var start = rt.indexOf('Inlinks (');
                var end = rt.indexOf(')', start);
                var yahooind = '';
                if (start == -1 || end == -1) yahooind = '0';
                else {
                    if (WebStartup.isInt(rt.substr(start + 9, end - start - 9))) yahooind = rt.substr(start + 9, end - start - 9);
                    else yahooind = 'n/a';
                }
				$("#ws_yahoobl").attr("title", 'Yahoo Backlinks: ' + yahooind);
                $(".ws_yahoobl").html(': ' + yahooind);
				$(".ws_yahoobl").attr("href", 'http://siteexplorer.search.yahoo.com/siteexplorer/search?bwm=i&bwmo=d&bwmf=u&p=' + WebStartup.lastURL);
				$(".ws_yahoobl").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });							
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["yahoobl"] = yahooind;
            }
        };
        WebStartup.yahooxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.yahooxmlhttp.send(null);
    },
    linkedinEmp: function () {	
	var tld = WebStartup.currUrl.split('.')[1];
	var company = WebStartup.currUrl;
	if (tld in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) company = WebStartup.currUrl.split('.')[0];
        WebStartup.workingURL = 'http://www.linkedin.com/company/' + encodeURIComponent(company);
        WebStartup.linkedinxmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.linkedinxmlhttp.onreadystatechange = function () {
            if (WebStartup.linkedinxmlhttp.readyState == 4 && WebStartup.linkedinxmlhttp.status == 200) {
                var rt = WebStartup.linkedinxmlhttp.responseText;
		var linkedin;
		if (rt.indexOf('<div class="alert error">') != -1) linkedin = 'n/a';
		else if (rt.indexOf('<p>Already a member?</p>') != -1) linkedin = 'n/a, need to log in';
		else {
		    var start = rt.indexOf('<p class="how-connect">');
		    if (rt.indexOf('</a> <span>Employees on LinkedIn', start) == -1) linkedin = 'n/a';
		    else {
			var end = rt.indexOf('</a> <span>Employees on LinkedIn', start);
			var start = rt.lastIndexOf('>', end);
			if (WebStartup.isInt(rt.substr(start + 1, end - start - 1)))
			    linkedin = rt.substr(start + 1, end - start - 1) + ' employees';
		    }
		}
		        $("#ws_linkedin").attr("title", 'LinkedIn: ' + linkedin);
                $(".ws_linkedin").html(': ' + linkedin);
				if (WebStartup.lastURL.split('.')[1] in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''})
					var linkedin_url = 'http://www.linkedin.com/company/' + WebStartup.lastURL.split('.')[0];
				else
					var linkedin_url = 'http://www.linkedin.com/company/' + WebStartup.lastURL;
				$(".ws_linkedin").attr("href", linkedin_url);
				$(".ws_linkedin").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["linkedin"] = linkedin;
            }
	};
        WebStartup.linkedinxmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.linkedinxmlhttp.send(null);
    },
    crunchBase: function () {
	var tld = WebStartup.currUrl.split('.')[1];
	var company;
	if (tld in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) company = WebStartup.currUrl.split('.')[0];
	else company = WebStartup.currUrl.split('.')[0] + '-' + WebStartup.currUrl.split('.')[1];
        WebStartup.workingURL = 'http://www.crunchbase.com/company/' + encodeURIComponent(company);
        WebStartup.crunchbasexmlhttp = WebStartup.getXmlHttpObject();
        WebStartup.crunchbasexmlhttp.onreadystatechange = function () {
            if (WebStartup.crunchbasexmlhttp.readyState == 4 && WebStartup.crunchbasexmlhttp.status == 200) {
                var rt = WebStartup.crunchbasexmlhttp.responseText;
		var founded; var funding; var round; var acquiredby; var price; var date; var crunchbase;
		if (rt.indexOf('>Founded</td>') != -1) {
		    var start = rt.indexOf('>Founded</td>');
		    start = rt.indexOf('td_right">', start);
		    var end = rt.indexOf('</td', start);
		    founded = rt.substr(start + 10, end - start - 10);
		    if (founded.search(/^[0-9\/]+$/) == 0) founded = 'Founded: ' + founded;
		    else founded = '';
		}
		else founded = '';
		if (rt.indexOf('Acquired by</td>') != -1) {
		    var start = rt.indexOf('Acquired by</td>');
		    start = rt.indexOf('title="', start);
		    var end = rt.indexOf('">', start);
		    if (rt.substr(start + 7, end - start - 7)) acquiredby = 'Acquired by: ' + rt.substr(start + 7, end - start - 7);
		    else acquiredby = '';
		    if (rt.indexOf('Date</td>') != -1) {
			var start = rt.indexOf('Date</td>');
			start = rt.indexOf('"td_right">', start);
			var end = rt.indexOf('</', start);
			date = rt.substr(start + 11, end - start - 11);
			if (date.search(/^[0-9\/]+$/) == 0) date = '  -  ' + date; 
			else date = '';
		    }		    		   
		    else date = '';
		    if (rt.indexOf('Price</td>') != -1) {
			var start = rt.indexOf('Price</td>');
			start = rt.indexOf('"td_right">', start);
			var end = rt.indexOf('</', start);
			price = rt.substr(start + 11, end - start - 11);
			if (price.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0]) price = ' / Price: ' + price.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0];
			else price = '';
		    }   
		    else price = '';
		}
		else {acquiredby = ''; date = ''; price = ''}
		if (rt.indexOf('Public</td>') != -1) {
		    var start = rt.indexOf('Public</td>');
		    start = rt.indexOf('title="', start);
		    var end = rt.indexOf('">', start);
		    if (rt.substr(start + 7, end - start - 7)) ipo = 'Public: ' + rt.substr(start + 7, end - start - 7); 
		    else ipo = '';
		    if (rt.indexOf('Date</td>') != -1) {
			var start = rt.indexOf('Date</td>');
			start = rt.indexOf('"td_right">', start);
			var end = rt.indexOf('</', start);
			ipodate = rt.substr(start + 11, end - start - 11);
			if (ipodate.search(/^[0-9\/]+$/) == 0) ipodate = '  /  Date: ' + ipodate;
			else ipodate = '';
		    }
		    else ipodate = '';
		}
		else {ipo = ''; ipodate = ''}
		if (acquiredby || ipo) {
		    funding = '';
		    round = '';
		}
		else {
		    if (rt.indexOf('Funding') == -1) funding = '';	
		    else {
			var start = rt.indexOf('Funding');
			if (rt.indexOf('$', start) == -1) funding = '';
			else {
			    start = rt.indexOf('$', start);
			    var end = rt.indexOf('</', start);
			    funding = rt.substr(start, end - start);
			    if (funding.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0]) funding = 'Total Funding: ' + funding.match(/\W[0-9,\.]+(B|b)?(M|m)?(K|k)?$/)[0];
			    else funding = '';
			}
		    }
		    if (rt.lastIndexOf('<td class="td_left2">') == -1) round = '';
		    else {
			var start = rt.lastIndexOf('<td class="td_left2">');
			var end = rt.indexOf(' <sup', start);
			round = rt.substr(start + 21, end - start - 21);
			if (round.match(/(^(Seed|Angel|Series|Grant|Debt|Unattributed|Venture Round))\s?[A-Z]?,\s((1[0-2]|0?[1-9])\/[0-9][0-9])$/)[0]) round = round.match(/(^(Seed|Angel|Series|Grant|Debt|Unattributed|Venture Round))\s?[A-Z]?,\s((1[0-2]|0?[1-9])\/[0-9][0-9])$/)[0];
			else round = '';
		    }
		}
		if (founded && (acquiredby || ipo || funding || round)) var comma = ', ';
		else comma = ' ';
		if (funding && round) var slash = '  /  ';
		else slash = ' ';
		crunchbase = founded + comma + acquiredby + date + price + ipo + ipodate + funding + slash + round;
		        $("#ws_crunchbase").attr("title", 'CrunchBase: ' + crunchbase);
                $(".ws_crunchbase").html(': ' + crunchbase);
				if (WebStartup.lastURL.split('.')[1] in {'com':'', 'net':'', 'org':'', 'gov':'', 'edu':''}) 
					var crunchbase_url = 'http://www.crunchbase.com/company/' + WebStartup.lastURL.split('.')[0];
				else 
					var crunchbase_url = 'http://www.crunchbase.com/company/' + WebStartup.lastURL.split('.')[0] + '-' + WebStartup.lastURL.split('.')[1];
				$(".ws_crunchbase").attr("href", crunchbase_url);
				$(".ws_crunchbase").click(function(){ safari.self.browserWindow.openTab().url = this.attr("href"); });
                WebStartup.wsdata[encodeURIComponent(WebStartup.currUrl)]["crunchbase"] = crunchbase;
            }
        };
        WebStartup.crunchbasexmlhttp.open("GET", WebStartup.workingURL, true);
        WebStartup.crunchbasexmlhttp.send(null);
    },
    getXmlHttpObject: function () {
		return new XMLHttpRequest();
    },
    isInt: function (num) {
        if (num.toString().search(/^-?[0-9,\.(B)?(M)?(K)?]+$/) == 0) return true;
        else
        return false;
    }
}