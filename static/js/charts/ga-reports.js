dashboardCharts = new Array();
homePageCharts = new Array();
browserCharts = new Array();
locationCharts = new Array();
imgDirPath = "/static/images/site2013/manage/";
var datetimeWidget;

noDataMessage = "No Data";

titleToImg = new Array();
titleToImg["Safari"] = "radialSafari";
titleToImg["Chrome"] = "radialChrome";
titleToImg["Opera"] = "radialOpera";
titleToImg["Internet Explorer"] = "radialIE";
titleToImg["Firefox"] = "radialFF";
titleToImg["default"] = "radialDefaultBrowser";
titleToImg["Other"] = "radialDefaultTS";
titleToImg["mobile"] = "mobile.png";
titleToImg["tablet"] = "tablet.png";
titleToImg["desktop"] = "desktop.png";
titleToImg["Monday"] = "radialMonday";
titleToImg["Tuesday"] = "radialTuesday";
titleToImg["Wednesday"] = "radialWednsday";
titleToImg["Thursday"] = "radialThursday";
titleToImg["Friday"] = "radialFriday";
titleToImg["Saturday"] = "radialSaturday";
titleToImg["Sunday"] = "radialSunday";
titleToImg["viral"] = "radialViral";
titleToImg["organic"] = "radialOrganic";
titleToImg["paid"] = "radialPaid";
titleToImg["direct"] = "radialDirect";


dashbaordImg = new Array();
dashbaordImg["positive"] = "sentiment-white-good.png";
dashbaordImg["negative"] = "sentiment-white-bad.png";
dashbaordImg["nuteral"] = "sentiment-white-average.png";
dashbaordImg["chrome"]	= "chrome-white.png";
dashbaordImg["safari"]	= "safari-white.png";
dashbaordImg["ie"]		= "explorer-white.png";
dashbaordImg["firefox"] = "firefox-white.png";
dashbaordImg["opera"]	= "opera-white.png";
dashbaordImg["other"]	= "chrome-white.png";
dashbaordImg["viral"]	= "viral-white.png";	
dashbaordImg["organic"] = "organic-white.png";
dashbaordImg["paid"]	= "paid-white.png";
dashbaordImg["direct"]	= "direct-white.png";
dashbaordImg["desktop"] = "desktop-white.png";
dashbaordImg["tablet"]	= "tablet-white.png";
dashbaordImg["mobile"]	= "mobile-white.png";
dashbaordImg["defaultTraffic"] = "traffic-source-default.png";

chartsData = new Array();

var getImgByTitle = function(title, type)
{
	if (!title)
	{
		return titleToImg["default"];
	}
	else if (!titleToImg[title])
	{
		return titleToImg["Other"];
	}
	else
		return titleToImg[title];

};

var getDashboardImg = function(title)
{
	if (!title)
		dashbaordImg["other"];
	else if (!dashbaordImg[title])
	{
		return dashbaordImg["other"];
	}
	else
		return dashbaordImg[title];
}

var updateFilters = function() {
	var restClient = new KPL_Common.RESTClient("POST", "/manage/filter/set-filters");
	var data = {
		'search': {
			'type': (searchOptionList.getActiveItem()) ? searchOptionList.getActiveItem().id : null,
			'value': searchValue.getValue() ? searchValue.getValue() : ""
		},
		'selectedTimeRange': {
			'start': window.top.calendar.getStartDate().toFormattedString('yyyy-MM-dd'),
			'end': window.top.calendar.getEndDate().toFormattedString('yyyy-MM-dd'),
		}


	};
	restClient.setBodyObject(data);
	restClient.call(function() {
		navigationFrame.reload();
	});

};

var updateCharts = function(dates)
{
	var restClient = new KPL_Common.RESTClient("POST", "get-charts-data");

	if(dates)
	{
		// if update from calendar convert the dates to unix timestamp 
		// and send them with the request
		restClient.setPostParameter("start_time", new Date(window.top.calendar.getStartDate().toFormattedString('yyyy-MM-dd')).getTime()/1000);
		restClient.setPostParameter("end_time", new Date(window.top.calendar.getEndDate().toFormattedString('yyyy-MM-dd')).getTime()/1000);
	}
	restClient.call(function(data) {

		console.log(data);
		setDashboardChartsData(data);
		drawDashboard();
		setChartsDataArray(data);
		drawCharts();
	});

};

var getDayName = function(index)
{
	switch(index)
	{
		case 0:
			return "Sunday";
		case 1:
			return "Monday";
		case 2:
			return "Tuesday";
		case 3:
			return "Wednsday";
		case 4:
			return "Thursday";
		case 5:
			return "Friday";
		case 6:
			return "Saturday";
		default:
			return null;
	}
}

var setDashboardChartsData = function(data)
{
	var locations = data.location;
	var topDays = data.days.days;
	topDays.sort(function(obj1, obj2) {
		return obj2.bounceRate - obj1.bounceRate;
	});
	var devices = data.device;
	var browsers = data.browser;
	var traffic = data.traffic;
	var topIssues = data.topIssues;
	var issues	= new Array();
	
	$.each(topIssues,function(){
		issues.push(this);
	});
	if(data.homepage[0])
		dashboardCharts["homeDashboard"] = {bounce: data.homepage[0].bounces, bounceRate: Math.floor(data.homepage[0].bounceRate), title: "Home Page", sectionId: "#website-pages"};
	if(locations[0])
		dashboardCharts["locationDashboard"] = {bounce: locations[0].bounces, bounceRate: locations[0].bounceRate, title: locations[0].name, sectionId: "#locations"};
	if(topDays[0])
		dashboardCharts["peakPeriodDashboard"] = {bounce: topDays[0].bounces, bounceRate: topDays[0].bounceRate, title: topDays[0].day, sectionId: "#peak-period"};
	if(devices[0])
		dashboardCharts["deviceDashboard"] = {bounce: devices[0].bounces, bounceRate: devices[0].bounceRate, title: devices[0].type.capitalize(), img: getDashboardImg(devices[0].type.toLowerCase()), sectionId: "#tech"};
	if(browsers[0])
		dashboardCharts["browserDashboard"] = {bounce: browsers[0].bounces, bounceRate: browsers[0].bounceRate, title: browsers[0].browser, img: getDashboardImg(browsers[0].browser.toLowerCase()), sectionId: "#tech"};
	if(traffic[0])
	{
		var imgTitle;
		switch(traffic[0].type.toLowerCase())
		{
			case "viral": 
			case "organic":
			case "paid":
			case "direct":
				imgTitle = traffic[0].type.toLowerCase();
				break;
			default:
				imgTitle = "defaultTraffic";
				break;
		}
		dashboardCharts["trafficDashboard"] = {bounce: traffic[0].bounces, bounceRate: traffic[0].bounceRate, title: traffic[0].type.capitalize(), img: getDashboardImg(imgTitle), sectionId: "#traffic-source"};
	}
	if(data.total)
		dashboardCharts["totalDashboard"] = {bounce: data.total.bounces, bounceRate: data.total.bounceRate, visits: data.total.visits};
	if( data.feedbackCount)
	{
		var summeryBoxes = $(".summary-box");
		var noFeedbacks  = $(".no-feedbacks-fallback");
		var feedbackSection = $("#feedbacks-charts");
		if(data.feedbackCount > 0)
		{
			noFeedbacks.hide();
			feedbackSection.show();
			summeryBoxes.show();
			dashboardCharts["feedback-count"] = {value: data.feedbackCount};
			if(data.visitorsFeeling && data.visitorsFeeling.top)
				dashboardCharts["users-mood"] = {value: '<img src="' + imgDirPath + getDashboardImg(data.visitorsFeeling.top) + '">'};
			if(issues[0] && issues[0].categoryName)
				dashboardCharts["top-issues"] = {value: issues[0].categoryName };
			else
				dashboardCharts["top-issues"] = {value:	noDataMessage};
			
			getComments();
		}
		else
		{
			noFeedbacks.show();
			summeryBoxes.hide();
			feedbackSection.hide();
		}
	}
		
	
};

var setChartsDataArray = function(data)
{
	var locations = data.location;
	var topDays = data.days.days;
	topDays.sort(function(obj1, obj2) {
		return obj2.bounceRate - obj1.bounceRate;
	});
	var devices = data.device;
	var browsers = data.browser;
	var traffic = data.traffic;
	var topIssues = data.topIssues;
	var issues	= new Array();
	
	$.each(topIssues,function(){
		issues.push(this);
	});
	
	if(data.homepage && data.homepage[0])
	{
		chartsData["home-ab"] = {value: data.homepage[0].bounceRate, total: data.homepage[0].bounces, img: imgDirPath + "home.png"};
		chartsData["home-ru"] = {value: data.homepage[0].retUser.bounceRate, total: data.homepage[0].retUser.bounces, img: imgDirPath + "home.png"};
		chartsData["home-nu"] = {value: data.homepage[0].newUser.bounceRate, total: data.homepage[0].newUser.bounces, img: imgDirPath + "home.png"};
	}
	var websites = data.website;
	
	for (var i = 0; i < 5; i++)
	{
		if (websites[i])
		{
			chartsData["most"+(i+1)] = {value: Math.floor(websites[i].bounceRate), title: websites[i].title, total: websites[i].bounces, url: websites[0].url, img: ""};
		}
	}



	var browsersRadial = new Array();
	for (var i = 0; i < 5; i++)
	{
		if (browsers[i])
		{
			var img = getImgByTitle(browsers[i].browser);
			var browser = {percent: browsers[i].bounceRate, img: img, title: browsers[i].browser.capitalize(), total: browsers[i].bounces,showTitle: true};
			browsersRadial.push(browser);
		}
	}

	var devices = data.device;
	var deviceValues = new Array();
	for (var i = 0; i < 3; i++)
	{
		if (devices[i])
		{
			var img = getImgByTitle(devices[i].type);
			var device = {value: Math.floor(devices[i].bounceRate), img: imgDirPath + img, title: devices[i].type.capitalize()};
			deviceValues.push(device);
		}
	}

	var days = data.days.days;
	var daysValues = new Array();
	for (var i = 0; i < 7; i++)
	{
		if (days[i])
		{
			var img = getImgByTitle(days[i].day);
			var day = {percent: days[i].bounceRate, img: img, title: days[i].day.capitalize(), total: days[i].bounces};
			daysValues.push(day);
		}
	}


	var trafficS = new Array();
	for (var i = 0; i < 4; i++)
	{
		if (traffic[i])
		{
			var img = getImgByTitle(traffic[i].type);
			var t = {percent: traffic[i].bounceRate, img: img, title: traffic[i].type.capitalize(), total: traffic[i].bounces,showTitle: true};
			trafficS.push(t);
		}
	}

	var keywords = data.keywords;
	var keywordValues = new Array();
	for (var i = 0; i < 5; i++)
	{
		if (keywords[i])
		{
			var k = {keyword: keywords[i].keyword, bounces: keywords[i].bounces, bounceRate: keywords[i].bounceRate};
			keywordValues.push(k);
		}
	}
	
	var locations = data.location;
	var locationValues = new Array();
	
	for(var i=0; i<3; i++ )
	{
		if(locations[i])
		{
			var l = {bounceRate: locations[i].bounceRate, bounces: locations[i].bounces, title: locations[i].name};
			locationValues.push(l);
		}
	}

	chartsData["keywordChart"] = {value: keywordValues};

	chartsData["browsersRad"] = {value: browsersRadial, img: imgDirPath + "browser.png"};
	chartsData["browsersBubble"] = {value: deviceValues, img: ""};
	if(locations[0])
		chartsData["areas"] = {value: [{bounceRate: locations[0].bounceRate, bounces: locations[0].bounces, title: locations[0].name},
				{bounceRate: locations[0].region.bounceRate, bounces: locations[0].region.bounces, title: locations[0].region.name},
				{bounceRate: locations[0].city.bounceRate, bounces: locations[0].city.bounces, title: locations[0].city.name}], img: imgDirPath + "geo-location.png"};
	
	chartsData["countries"] = {value: locationValues, img: ""};
	chartsData["daily-rates"] = {value: daysValues, img: imgDirPath + "day-of-the-week.png"};
	chartsData["weekdayBubble"] = {value:
				[{title: "MON-FRI", bounceRate: Math.floor(data.days.weekdays.bounceRate),bounces: data.days.weekdays.bounces, img: "/static/images/site2013/manage/mon-fri.png"},
					{title: "SAT-SUN", bounceRate: Math.floor(data.days.weekend.bounceRate),bounces: data.days.weekend.bounces,  img: "/static/images/site2013/manage/sat-sun.png"}], img: ""};
	chartsData["peak-time"] = {value: data.hours.bounceRate, total: data.hours.bounces, img: "dountTime", hour: data.hours.hour};
	chartsData["traffic-source-rad"] = {value: trafficS , img: imgDirPath + "traffic-source.png"};

	var feeling = data.visitorsFeeling;
	chartsData["visitors-feelings-chart"] = {value:
				{positive: {value: feeling.positive.percent, total: feeling.positive.total, img: imgDirPath + "sentiment-good.png"},
					negative: {value: feeling.negative.percent, total: feeling.negative.total, img: imgDirPath + "sentiment-bad.png"},
					nuetral: {value: feeling.nuteral.percent, total: feeling.nuteral.total, img: imgDirPath + "sentiment-average.png"}}, img: ""};

	var catValues = new Array();		
	for(var i=0; i<3; i++)
	{
		if(issues[i])
		{
			var issue = {main: {title: issues[i].categoryName, value: Math.round(100*issues[i].categoryPercent), img: "/static/images/site2013/manage/time.png"}
				, sub: {title: issues[i].subCategoryName, value:Math.round(100*issues[i].subCategoryPercent)}};
			
			catValues.push(issue);
		}
	}
	chartsData["top-reported-issues"] = {value: catValues };


};

var drawDashboard = function()
{
	var dashboardItems = $('.dashboard .content .horizontal-chart-cube');
	dashboardItems.each(function() {
		var bounce = $(this).find(".number-title");
		var title = $(this).find(".description span");
		var canvas = $(this).find("canvas");
		var id = $(this).attr("id");
		var img = $(this).find(".icon");
		if (dashboardCharts[id])
		{
			bounce.html(numberWithCommas(dashboardCharts[id].bounce));
			title.html(dashboardCharts[id].title);
			if (dashboardCharts[id].img)
			{
				var imgElement =  $(this).find(".icon");
				imgElement.html('<img src="'+imgDirPath+"ga-reports/"+dashboardCharts[id].img+'">');
			}
			var data = setChart(canvas[0], "horizontal", dashboardCharts[id].bounceRate, dashboardCharts[id].img);

			$(this).click(function() {
				$('html, body').animate({
					scrollTop: $(dashboardCharts[id].sectionId).offset().top
				}, 2000);

			});
		}
	});

	
	var bounceRateValue = Math.floor(dashboardCharts["totalDashboard"].bounceRate);
	var total = {value: {positive: {value: 100 - bounceRateValue, img: imgDirPath + "users-grey.png"},
			negative: {value: bounceRateValue, img: imgDirPath + "users-white.png"},
			nuetral: {value: 0, img: imgDirPath + "sentiment-average.png"}}, img: ""};
	
	var worldBounceRate = 49;
	initScale(worldBounceRate, bounceRateValue);
	

	var dashboardTotal = $("#totalDashboard");
	dashboardTotal.find(".bounces").html(numberWithCommas(dashboardCharts["totalDashboard"].bounce));
	dashboardTotal.find(".visits").empty().prepend(numberWithCommas(dashboardCharts["totalDashboard"].visits));
	dashboardTotal.find(".bounce-rate").html(bounceRateValue);
	var canvas = dashboardTotal.find(".canvas");

	setChart(canvas[0], "100icons", total.value, "");

	var kDashboard = $('.dashboard .content .summary-box');
	kDashboard.each(function() {
		var content = $(this).find(".content");
		var id = $(this).attr("id");
		if (dashboardCharts[id] && dashboardCharts[id].value)
		{
			var value = dashboardCharts[id].value;
			if(!isNaN(value))
				value = numberWithCommas(value);
			content.html(value);
		}
	});
};

var initScale = function(worldAvg, siteAbn)
{
	var wordElement = $(".dashboard .scale-wrapper .world");
	var siteElement = $(".dashboard .scale-wrapper .me");
	
	if(worldAvg && siteAbn)
	{
		wordElement.css("top", (100-worldAvg-2)+"%");
		siteElement.css("top", (100-siteAbn-2)+"%");
	}
}

var drawCharts = function()
{
	var infographics = $('.infographics');
	infographics.each(function() {
		var charts = $(this).find(".chart");
		charts.each(function() {
			var canvas = $(this).find("canvas");
			var type = $(this).attr("type");
			var id = $(this).attr("id");
			if (chartsData[id] && (type != "100icons" && type != "keywords"))
				var data = setChart(canvas[0], type, chartsData[id].value, chartsData[id].img);
			switch (type)
			{
				case "dount":
					{
						var detailsElement = $(this).find(".details");

						var details =numberWithCommas(Math.floor(chartsData[id].total)) + " (" + Math.floor(chartsData[id].value) + "%)";
						var color = data.ui._helper.getColorByValue(chartsData[id].value);

						detailsElement.html(details);

						detailsElement.css("color", color);

						var hourElement = $(this).find(".hour");
						var nextHour = Number(chartsData[id].hour) + 1;
						if (nextHour == 24)
							nextHour = 0;
						var hour = chartsData[id].hour + ":00 - " + nextHour + ":00";

						hourElement.html(hour);

						break;
					}
				case "horizontal":
					{
						var detailsElement = $(this).find(".details");
						var titleElement = detailsElement.find(".title");
						var totalElement = detailsElement.find(".total");
						var urlElement = $(this).find(".url");
						
						if(chartsData[id] && chartsData[id].total)
						{
							var details =numberWithCommas( Math.floor(chartsData[id].total) )+ " (" + Math.floor(chartsData[id].value) + "%)";
							var color = data.ui._helper.getColorByValue(chartsData[id].value);

							titleElement.html(chartsData[id].title);
							totalElement.html(details);
							//urlElement.html(chartsData[id].url);

							totalElement.css("color", color);
						}
						break;
					}
				case "radial":
					{
						chartsData[id].value.sort(function(obj1, obj2) {
							return obj2.percent - obj1.percent;
						});

						var topValue = chartsData[id].value[0];
						var detailsElement = $(this).find(".details");
						var titleElement = detailsElement.find(".title");
						var dataElement = detailsElement.find(".data");

						var color = data.ui._helper.getColorByValue(topValue.percent);
						var details = numberWithCommas(Math.floor(topValue.total)) + " (" + Math.floor(topValue.percent) + "%)";

						titleElement.html(topValue.title);
						dataElement.html(details);
						dataElement.css("color", color);

						break;
					}
				case "dount-combo":
					{
						var countryElement = $(this).find(".country");

						var countryTitleElement = $(this).find(".country > .title").html(chartsData[id].value[0].title);
						color = data.ui._helper.getColorByValue(chartsData[id].value[0].bounceRate);
						var countryDataElement = $(this).find(".country > .data")
								.html(numberWithCommas(chartsData[id].value[0].bounces) + " (" + Math.floor(chartsData[id].value[0].bounceRate) + "%)")
								.css("color", color);

						var regionTitleElement = $(this).find(".region > .title").html(chartsData[id].value[1].title);
						color = data.ui._helper.getColorByValue(chartsData[id].value[1].bounceRate);
						var regionDataElement = $(this).find(".region > .data")
								.html(numberWithCommas(chartsData[id].value[1].bounces) + " (" + Math.floor(chartsData[id].value[1].bounceRate) + "%)")
								.css("color", color);
						color = data.ui._helper.getColorByValue(chartsData[id].value[2].bounceRate);
						var cityTitleElement = $(this).find(".city > .title").html(chartsData[id].value[2].title);
						var cityDataElement = $(this).find(".city > .data")
								.html(numberWithCommas(chartsData[id].value[2].bounces) + " (" + Math.floor(chartsData[id].value[2].bounceRate) + "%)")
								.css("color", color);

						break;
					}
				case "100icons":
					{
						var canvas = $(this).find(".canvas");
						var data = setChart(canvas[0], type, chartsData[id].value, chartsData[id].img);

						var negative = $("#visitors-feelings .negative .data").html(numberWithCommas(chartsData[id].value.negative.total) + " (" + Math.floor(chartsData[id].value.negative.value) + "%)");
						var positive = $("#visitors-feelings .positive .data").html(numberWithCommas(chartsData[id].value.positive.total) + " (" + Math.floor(chartsData[id].value.positive.value) + "%)");
						var nuteral = $("#visitors-feelings .nuetral .data").html(numberWithCommas(chartsData[id].value.nuetral.total) + " (" + Math.floor(chartsData[id].value.nuetral.value) + "%)");
						break;
					}
				case "keywords":
					{
						var canvas = $(this).find(".keyword-canvas");
						var data = setChart(canvas, type, chartsData[id].value,"");
						break;
					}
			}
		});
	});
	
	initTopReportedChart(chartsData["top-reported-issues"]);
};




//paper.install(window);



$(document).ready(function() {
	datetimeWidget = new KPL_Datetime_UI.RangeWidget($(window.top.mainTemplates.getTemplate("datetime-widget").build())[0], window.top.calendar);
	datetimeWidget.addChangeStateCallback(function() {
		if (!datetimeWidget.isActive())
		{


			//	sessionStorage.removeItem('KPL_Inbox_Selected_Items');
			updateCharts(true);
		}

	});
	$(".paperImages").hide();

	var startDate = window.top.calendar.startDate.toString();
	var endDate = window.top.calendar.endDate.toString();


	var endDateArray = endDate.split(" ");
	var startDateArray = startDate.split(" ");
	dateTimeRange = startDateArray[0] + ", " + startDateArray[2] + " " + startDateArray[1] + "," + startDateArray[3] + "-" + endDateArray[0] + ", " + endDateArray[2] + " " + endDateArray[1] + "," + endDateArray[3];

	var stringModel = new KPL_Model.String();
	//	var inputElement = document.createElement("input");
	//	var inputUI = new KPL_UI_Input.String(inputElement, stringModel, "Hello");

	var calenderItem = KPL_Toolbar.createDropdownItem("set-editor-calender", "Calender", datetimeWidget, dateTimeRange);
	//	var searchItem = KPL_Toolbar.createDropdownItem("set-editor-search","Search",inputUI);
	var exportItem = KPL_Toolbar.createDropdownItem("set-export", "Export");

	toolbarList.reset();
	toolbarList.beginMultipleChange();
	//	toolbarList.getRootItem().addChild(searchItem);

	toolbarList.getRootItem().addChild(calenderItem);
	toolbarList.getRootItem().addChild(exportItem);
	toolbarList.endMultipleChange();

	toolbarRightList.reset();

});


$(window).load(function() {


//	chartsData["feedbacks"] = [feedback, feedback, feedback, feedback, feedback];	
	var feedback = {mood: "Negative", category: "Technical Issues"
		, sub_category: "Page is not loading properly", grade: "2"
		, feedback: "My name is Inigo Montoya. You killed my father. Prepare to die",
		info: {
			date: "Monday, 01.07.14",
			time: "10:30 am",
			user: "New User",
			traffic_source: "Organic Traffic",
			browser: "Chrome",
			device: "Mobile user",
			url: ".../sadasd/coccc.com",
			keyword: "premium"
		}};

	updateCharts();


});


function getRandomArbitary(min, max) {
	return Math.random() * (max - min) + min;
}



function setChart(canvas, type, data, img)
{
	var model = new KPL_Infographics.Model();
	model.setValue(data);
	if (img)
		model.setImg(img);
	model.setType(type);
	var ui = new KPL_Infographics.UI(canvas, model);
	var data = {model: model, ui: ui};
	data.ui.start();


	return data;
}

function initTopReportedChart(data)
{
	var container = ("#top-reported-issues .categories");
	var categories = $(container).find(".category");

	var values = data.value;

	values.sort(function(obj1, obj2) {
		return obj2.main.value - obj1.main.value;
	});
	if(values[0])
	{
		categories.each(function(index) {

			var mainTitleElement = $(this).find(".main-category .title");
			var mainValueElement = $(this).find(".main-category .value");
			var subTitleElement = $(this).find(".sub-category .title");
			var subValueElement = $(this).find(".sub-category .value");
			var categoryIcon = $(this).find(".category-icon img");

			categoryIcon.attr("src", values[index].main.img);

			mainTitleElement.html(values[index].main.title);
			mainValueElement.html(Math.floor(values[index].main.value) + "% ");
			subTitleElement.html(values[index].sub.title);
			subValueElement.html((Math.floor(values[index].sub.value) + "% "));
		});
	}
}

function getComments()
{
	var restClient = new KPL_Common.RESTClient("GET", "get-feedback-layout");
	restClient.call(function(data) {
		
		var topFeedbacksClient = new KPL_Common.RESTClient("POST", "get-top-feedbacks");
		feedbackTemplate = data;
		topFeedbacksClient.call(function(data){
			var feedbackSection = $("#top-comments .comments");
			var lastRow;

			for (var i = 0; i < data.length; i++)
			{
				if (i % 2 == 0)
				{
					lastRow = $("<div class='row-fluid'></div>");
					feedbackSection.append(lastRow);
				}

				lastRow.append(feedbackTemplate);
				var domFeedbacks = feedbackSection.find(".comment-box");
				var currentFeedback = $(domFeedbacks[domFeedbacks.length - 1]).addClass("feedback-" + i);
				renderFeedbackBox(currentFeedback, data[i]);
				
			}
			window.top.scrollUI.update();
		});
	});

}

function renderFeedbackBox(container, data)
{
	
	var moodElement = container.find(".mood");
	var moodTitleElement = container.find(".mood-title");

	var categoryElement = container.find(".category");
	var subCategoryElement = container.find(".sub-category");
	var gradeElement = container.find(".grade");

	var commentElement = container.find(".feedback");

	// info tab
	var dateElement = container.find(".date .data");
	var timeElement = container.find(".time .data");
	//var userElement = container.find(".user .data");
	//var trafficElement = container.find(".traffic-source");
	var browserElement = container.find(".browser");
//	var deviceElement = container.find(".device");
	var urlElement = container.find(".url .data");
//	var keywordElement = container.find(".keyword .data");

	moodElement.addClass(data.mood.toLowerCase().replace(/ /g,"_"));
	moodTitleElement.html(data.mood.toUpperCase());

	categoryElement.html(data.category);
	subCategoryElement.html(data.sub_category);
	gradeElement.html("Grade-" + data.grade);
	gradeElement.addClass("grade-" + data.grade);
	commentElement.html(data.description);

	var date = new Date(data.creation_date);
	var day = getDayName(date.getDay());
	var ampm= 'am'; 
    var h=  date.getHours();
    var m= date.getMinutes();
		if(h>= 12){
        if(h>12) h -= 12;
        ampm= 'pm';
    }
	var time = h + ":" + m + " "+ampm;
	date = date.getDate() + "." + (date.getMonth()+1)+ "." +date.getFullYear();
	dateElement.html(day + " " +date);
	timeElement.html(time);
	//userElement.html(data.info.user);

	//trafficElement.find(".data").html(data.info.traffic_source);
	//trafficElement.addClass(data.info.traffic_source.replace(/\s+/g, '-').toLowerCase());
	console.log(data.info.browser);
	browserElement.find(".data").html(data.info.browser);
	browserElement.addClass(data.info.browser.replace(/\s+/g, '-').toLowerCase());
	//deviceElement.find(".data").html(data.info.device);
	//deviceElement.addClass(data.info.device.replace(/\s+/g, '-').toLowerCase());
	urlElement.html(data.url);
	//keywordElement.html(data.info.keyword);

	container.find(".drilldown-title").click(function() {
		var open = $(this).find(".open");
		var arrow = $(this).find(".bottom-arrow");
		console.log(open.length)
		if(open.length > 0)
		{
			arrow.removeClass("open");
			arrow.addClass("closed");
		}
		else
		{
			arrow.removeClass("closed");
			arrow.addClass("open");
		}
		var drill = container.find(".drilldown-section");
		drill.slideToggle(500);
		
		window.top.scrollUI.update();

	});

	
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};