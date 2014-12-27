var KPL_Infographics = {};

/*
 * Please notice the type of the model & the value are connected i.e
 *  |	 type	  |	value	
 *  |-------------|------------------------------------------------
 *  |	"dount"	  | single value i.e 80
 *  |-------------|------------------------------------------------
 *  |"dount-combo"| array with 3 values [inner, mid, outer]
 *  |-------------|------------------------------------------------
 *  |	"radial"  | array of "radial chancks"  
 *  |			  | each chanck = {percent: 80 ,img: 'home.png'}
 *  |-------------|------------------------------------------------
 *  | "horizontal"|
 *  |-------------|-------------------------------------------------
 *  |  "vertical" |
 */
KPL_Infographics.Model = function() {
	KPL_Model.Base.call(this);
	this._value = [];
	this._img = "";
	this._type = "";
};

KPL_Infographics.Model.prototype = new KPL_Model.Base();

KPL_Infographics.Model.prototype.getValue = function()
{
	return this._value;
};

KPL_Infographics.Model.prototype.setValue = function(value)
{
	this._value = value;
	this._changeSingle();
};

KPL_Infographics.Model.prototype.getImg = function()
{
	return this._img;
};

KPL_Infographics.Model.prototype.setImg = function(imgSrc)
{
	this._img = imgSrc;
	this._changeSingle();
};

KPL_Infographics.Model.prototype.getType = function()
{
	return this._type;
};

KPL_Infographics.Model.prototype.setType = function(type)
{
	this._type = type;
};


KPL_Infographics.Helper = function(userValues)
{
	this._static = "#d9d9db";
	if (!userValues)
	{
		// set default values for chart color and thrashold
		this._positive = "#00c273";
		this._neutral = "#ffab00";
		this._negative = "#ff495d";

		this._posotiveMax = 50;
		this._neutralMin = 50;
		this._neutralMax = 70;
		this._negativeMin = 70;
	}
	else
	{
		// in case of user \ industry defined values
		this._positive = userValues["positive"];
		this._neutral = userValues["neutral"];
		this._negative = userValues["negative"];

		this._posotiveMax = userValues["posotiveMax"];
		this._neutralMin = userValues["neutralMin"];
		this._neutralMax = userValues["neutralMax"];
		this._negativeMin = userValues["negativeMin"];
	}
};

KPL_Infographics.Helper.prototype.getColorByValue = function(value)
{
	if (value < 0)
		return this._static;
	if (value <= this._posotiveMax)
		return this._positive;
	if (value > this._neutralMin && value <= this._neutralMax)
		return this._neutral;
	if (value > this._negativeMin)
		return this._negative;
};

KPL_Infographics.Helper.prototype.degreesToRadians = function(deg)
{
	var rad = deg * (Math.PI / 180);
	return rad;
};

KPL_Infographics.Helper.prototype.calculatePoint = function(angle, arcRadius, centerX, centerY)
{
	return new paper.Point(centerX - arcRadius * Math.sin(angle),centerY + arcRadius * Math.cos(angle));//[centerX - arcRadius * Math.sin(angle), centerY + arcRadius * Math.cos(angle)];
};


/*
 * @param {float} radius
 * @param {float} position - the angle (radians) where the arc begin (where)
 * @param {float} length - length of the arc (% from 360) (how much)
 * @param {color} color
 * @param {boolean} roundedCorner
 * 
 */
KPL_Infographics.Helper.prototype.drawArc = function(radius, position, length, color, roundedCorner, width, centerX, centerY)
{
	var angle = Math.PI * 2 * length;
	var from = this.calculatePoint(position, radius, centerX, centerY);
	var through = new paper.Point(this.calculatePoint(position + (angle) / 2, radius, centerX, centerY));
	var to = new paper.Point(this.calculatePoint(angle + position, radius, centerX, centerY));

	var arc = new paper.Path.Arc(from, through, to);
	arc.strokeColor = color;
	arc.strokeWidth = width;
	if (roundedCorner)
		arc.strokeCap = 'round';
};

/**
 * @param {Canvas Element} container
 * @param {KPL_Infographics Model Object} chartData
 * @param {array[k]=v} customValues to initilize the helper
 */
KPL_Infographics.UI = function(container, paperModel, customValues) {
	KPL_UI.Base.call(this, container, paperModel);
	this._paperScope =  new paper.PaperScope();
	if (container instanceof HTMLCanvasElement)
	{
		this._paperScope.setup(container);
		this.isPaper = true;
	}
	else
		this.isPaper = false;
	this._eventCallbacks = [];
	if (!customValues)
		this._helper = new KPL_Infographics.Helper();
	else
		this._helper = new KPL_Infographics.Helper(customValues);
	this.updateSize();

};

KPL_Infographics.UI.prototype = new KPL_UI.Base();

/*
 * Updade canvas size
 * shoud be used before rendering in case of window resize 
 * or on first draw after setting up the canvas aspect ratio 
 */
KPL_Infographics.UI.prototype.updateSize = function()
{
	
	
	if (this.model.getType() == "dount")
	{
		this._radius = (this._width / 2);
		this._width = $(this.container).width() * .9;
		this._height = $(this.container).height() * .9;
	}
	else if (this.model.getType() == "dount-combo")
	{
		this._innerRadius = this._width * .2864583333333333;
		this._midRadius = this._width * .390625;
		this._outerRadius = this._width / 2;
		this._width = $(this.container).width() * .9;
		this._height = $(this.container).height() * .9;
	}
	else if (this.model.getType() == "radial")
	{
		this._innerRadius = this._width * .1640625;
		this._outerRadius = this._width * .46875;
		this._singleStroke = this._width * .0260416666666667;
		this._width = $(this.container).width() * .9;
		this._height = $(this.container).height() * .9;
	}
	else if (this.model.getType() == "bubble")
	{
		this._width = $(this.container).width() * .95;
		this._height = $(this.container).height() *.95;
	}
	else
	{
		this._width = $(this.container).width();// * .9;
		this._height = $(this.container).height();// * .9;
	}
	
	this._centerX = (this._width / 2) + (this._width * .05);
	this._centerY = (this._height / 2) + (this._height * .05);
};

KPL_Infographics.UI.prototype.render = function() {
	this._isRendering = true;
	if(this.isPaper)
		paper = this._paperScope;
	if (this.model.getType() == "dount")
	{
		// set canvas aspect ratio to 1 
		$(this.container).attr("height", $(this.container).width()+"px");;
		this.updateSize();
		this.drawDount();
	}
	else if (this.model.getType() == "dount-combo")
	{
		$(this.container).attr("height", $(this.container).width()+"px");
		this.updateSize();
		this.drawDounatCombo();
	}
	else if (this.model.getType() == "radial")
	{
		
		$(this.container).attr("height", $(this.container).width()+"px");
		this.updateSize();
		this.drawRadialChart();
	}
	else if (this.model.getType() == "horizontal")
	{
		this.drawHorizontalChart();
	}
	else if (this.model.getType() == "vertical")
	{
		this.updateSize();
		this.drawVerticalChart();
	}
	else if(this.model.getType() ==  "bubble")
	{
		this.updateSize();
		this.drawBubbleChart();
	}
	else if(this.model.getType() ==  "100icons")
	{
		this.updateSize();
		this.draw100IconsChart();
	}
	else if(this.model.getType() ==  "keywords")
	{
		this.drawKeywordsChart();
	}
	if(this.isPaper)
		this._paperScope.view.draw();
	this._isRendering = false;
};

KPL_Infographics.UI.prototype.isRendering = function()
{
	return this._isRendering;
}

KPL_Infographics.UI.prototype.drawDount = function()
{
	var rad = this._helper.degreesToRadians(180);
	var center = new paper.Point(this._centerX, this._centerY);
	// fill circle with background color
	var circle = new paper.Path.Circle(center, this._radius);
	circle.strokeColor = this._helper.getColorByValue(-1);
	circle.strokeWidth = 10;

	// fill percent of the circle
	var percent = this.model.getValue() / 100;
	var color = this._helper.getColorByValue(this.model.getValue());

	this._helper.drawArc(this._radius, rad, (percent), color, true, 10, this._centerX, this._centerY);


	// add img in the middle of the graph
	var raster = new paper.Raster({
		source: this.model.getImg(),
		position: center
	});

	raster.scale(.7);
};

KPL_Infographics.UI.prototype.drawDounatCombo = function()
{
	var comboFactor = .75;

	var innerPercent = this.model.getValue()[2].bounceRate;
	var middlePercent = this.model.getValue()[1].bounceRate;
	var outerPercent = this.model.getValue()[0].bounceRate;

	this._helper.drawArc(this._innerRadius, 0, comboFactor, this._helper.getColorByValue(-1), true, 7.5, this._centerX, this._centerY);
	this._helper.drawArc(this._midRadius, 0, comboFactor, this._helper.getColorByValue(-1), true, 10, this._centerX, this._centerY);
	this._helper.drawArc(this._outerRadius, 0, comboFactor, this._helper.getColorByValue(-1), true, 12.5, this._centerX, this._centerY);

	this._helper.drawArc(this._innerRadius, 0, (innerPercent * comboFactor) / 100, this._helper.getColorByValue(innerPercent), true, 7.5, this._centerX, this._centerY);
	this._helper.drawArc(this._midRadius, 0, (middlePercent * comboFactor) / 100, this._helper.getColorByValue(middlePercent), true, 10, this._centerX, this._centerY);
	this._helper.drawArc(this._outerRadius, 0, (outerPercent * comboFactor) / 100, this._helper.getColorByValue(outerPercent), true, 12.5, this._centerX, this._centerY);

	
	var center = new paper.Point(this._centerX, this._centerY);
	// add img in the middle of the graph
	var raster = new paper.Raster({
		source: this.model.getImg(),
		position: center
	});
	
	var outerTextPoint = this._helper.calculatePoint(0, this._outerRadius, this._centerX, this._centerY);
	outerTextPoint.y = outerTextPoint.y + 6;
	outerTextPoint.x = outerTextPoint.x + 9;	

	var midTextPoint = this._helper.calculatePoint(0, this._midRadius, this._centerX, this._centerY);
	midTextPoint.y = midTextPoint.y + 6;
	midTextPoint.x = midTextPoint.x + 9;	
	var innerTextPoint = this._helper.calculatePoint(0, this._innerRadius, this._centerX, this._centerY);
	innerTextPoint.y = innerTextPoint.y + 6;
	innerTextPoint.x = innerTextPoint.x + 9;	
	
	var outerText = new paper.PointText({
				point: outerTextPoint,
				content: 'Country',
				fillColor: 'black',
				fontFamily: 'Courier New',
				fontWeight: '400',
				fontSize: 20
	});
	var midText = new paper.PointText({
					point: midTextPoint,
					content: 'Region',
					fillColor: 'black',
					fontFamily: 'Courier New',
					fontWeight: '400',
					fontSize: 20
		});
	var innerText = new paper.PointText({
					point: innerTextPoint,
					content: 'City',
					fillColor: 'black',
					fontFamily: 'Courier New',
					fontWeight: '400',
					fontSize: 20
		});

	//raster.scale(.8);

};

KPL_Infographics.UI.prototype.drawRadialChart = function()
{

	var chancks = this.model.getValue();
	var baseRadius = this._innerRadius;
	var width = this._singleStroke;
	var img = this.model.getImg();

	var split = (chancks.length + 1);
	var splitAngle = this._helper.degreesToRadians(360 / (chancks.length + 1));
	var length = 360 / (chancks.length + 1) / 360;

	// draw outer line
	var center = new paper.Point(this._centerX, this._centerY);
	var circle = new paper.Path.Circle(center, this._outerRadius);
	circle.strokeColor = this._helper.getColorByValue(-1);
	circle.strokeWidth = 3;
	
	if(img)
	{
		var raster = new paper.Raster({
			source: img,
			position: center
		});
		raster.scale(.8);
	}
	for (var i = 0; i < 10; i++)
	{

		for (var j = 0; j < split - 1; j++)
		{
			var position =0.5*Math.PI + splitAngle * (j);
			var color = this._helper.getColorByValue(chancks[j].percent);

			if ((chancks[j].percent / 10) - 1 > i)
				this._helper.drawArc(baseRadius, position + 0.01, length - 0.003, color, false, width, this._centerX, this._centerY);

		}
		if (i === 6)
		{
			var text = new paper.PointText({
				point: this._helper.calculatePoint(0.5*Math.PI, baseRadius, this._centerX, this._centerY),
				content: '20%\n40%\n60%\n80%',
				fillColor: 'black',
				fontFamily: 'Courier New',
				fontWeight: '400',
				fontSize: 20
			});
			text.rotate(90);
		}
		baseRadius = baseRadius + width + 2;

		if (i === 9)
		{
			for (var k = 0; k < chancks.length; k++)
			{
				var rasterPos = 0.5*splitAngle + (0.5*Math.PI + splitAngle * (k));
				var rasterPoint = this._helper.calculatePoint(rasterPos, this._outerRadius, this._centerX, this._centerY);
				var raster = new paper.Raster({
					source: chancks[k].img,
					position: rasterPoint
				});
				if(chancks[k].showTitle)
				{
					var titleToggle;
					if(rasterPoint.y > this._centerY)
						titleToggle = 1;
					else
						titleToggle = -1;
					if((rasterPoint.y+ (35 * titleToggle)) < 10)
					{
						var titlePos =   new paper.Point(rasterPoint.x+ (60), rasterPoint.y);
					}
					else
						var titlePos =   new paper.Point(rasterPoint.x, rasterPoint.y+ (35 * titleToggle));
					
					var text = new paper.PointText({
					point: titlePos,
					content: chancks[k].title,
					fillColor: 'black',
					fontFamily: 'Courier New',
					fontSize: 20,
					justification: "center"

					});
				}
			
			}
		}

	}
};


KPL_Infographics.UI.prototype.drawHorizontalChart = function()
{	
	var chanckWidth = this._width / 10 - 2;
	var color = this._helper.getColorByValue(this.model.getValue());
	var baseColor = this._helper.getColorByValue(-1);
	var value = this.model.getValue();

	for (var i = 0; i < 10; i++)
	{
		var from = new paper.Point(i * chanckWidth + 2, 0);
		var to = new paper.Point(i * chanckWidth + chanckWidth, 0);
		var line = new paper.Path.Line(from, to);
		line.strokeWidth = 10;
		if (value >= ((i + 1) * 10 - 5))
			line.strokeColor = color;
		else
			line.strokeColor = baseColor;
	}
};

KPL_Infographics.UI.prototype.drawVerticalChart = function()
{
	
	var chanckHeight	= this._height / 10 - 2;
	var chanckWidth		= this._width;
	var baseColor		= this._helper.getColorByValue(-1);
	var values			= this.model.getValue();
	var chartGap		= this._width / values.length;
	// draw chart layout
	for (var i = 0; i < 11; i++)
	{
		var from = new paper.Point(0, i * chanckHeight);
		if(i%2 == 0)
		{
			var to = new paper.Point(chanckWidth, i * chanckHeight);
		}
		else
		{
			var to = new paper.Point(chanckWidth - 30, i * chanckHeight);
			var text = new paper.PointText({
				point: new paper.Point(chanckWidth - 25, i * chanckHeight+5),
				content: 100 - i*10 + "%",
				fillColor: 'black',
				fontFamily: 'Courier New',
				fontWeight: '400',
				fontSize: 20
			});
			
		}
		
		var line = new paper.Path.Line(from, to);
		line.strokeWidth = 2;
		line.strokeColor = baseColor;
		line.dashArray = [10, 4];
	}
	
	
	
	for(i = 0; i < values.length; i++)
	{
		var value	= 10-values[i].bounceRate/10;
		var from	= new paper.Point(3+ i* chartGap,(value)*chanckHeight);
		var to		= new paper.Point(3+ i* chartGap, chanckHeight*10 );
		var line	= new paper.Path.Line(from, to);
		line.strokeWidth = 7;
		var color  = this._helper.getColorByValue(values[i].bounceRate);
		line.strokeColor = color;
		//TODO: add title & text
		var titlePoint = new paper.Point(from.x+ 8, from.y);
		var dataPoint = new paper.Point(from.x+ 8, from.y + 23);
		var title = new paper.PointText({
				point:  titlePoint,
				content: values[i].title,
				fillColor: "black",
				fontFamily: "Open Sans, Helvetica",
				fontWeight: '400',
				fontSize: 23,
				textAlign: "center"
		});
		var data = new paper.PointText({
				point:  dataPoint,
				content: values[i].bounces + " ("+Math.floor(values[i].bounceRate) + "%)",
				fillColor: color,
				fontFamily: "Open Sans, Helvetica",
				fontWeight: '400',
				fontSize: 23
		});
	}
};

KPL_Infographics.UI.prototype.drawBubbleChart = function()
{
	var values	= this.model.getValue();
	var width	= this._width;
	var centerY = this._height/2;
	var centerX = this._width/2;
	
	
	var maxRadius = this._width/2;
	
	var red		= "#ff495d";
	var black	= "#40404a";
	var gray	= "#66666e";
	var pinUpPath = "/static/images/site2013/manage/marker-top.png";
	var pinDownPath = "/static/images/site2013/manage/marker-down.png";
	values.sort(function(obj1, obj2){
		return obj2.value - obj1.value;
	});
	
	bigRad = maxRadius * (values[0].value/100);
	centerX = bigRad;
	depth = 0;
	lastRad = 0;
	
	for(var i = 0; i< values.length; i++)
	{
		var radius = (maxRadius * (values[i].value/100));
		if(i > 0)
			depth += 2*lastRad - .5*radius;
					
		centerX = radius + depth;
		lastRad = radius;
		
		
		var center = new paper.Point(centerX, centerY);
		var circle = new paper.Path.Circle({
			center: center,
			radius: radius
		});
		var color;
		switch(i)
		{
			case 0: color = red;
					break;
			case 1:	color = black;
					break;
			case 2:	color = gray;
					break;
		}
		circle.fillColor = color;
		if(values[i].value >= 20)
		var icon = new paper.Raster({
			source: values[i].img,
			position: center
		});
		icon.scale(.7);
		
		var toggle;
		var marker;
		if( i%2 == 0)
		{	
			toggle=1;
			marker = pinDownPath;
		}
		else
		{
			toggle =-1;
			marker = pinUpPath;
		}
//		var pin = new paper.Raster({
//			source: marker,
//			position: new paper.Point(centerX, centerY + toggle*(radius+5))
//		});
		
		var title = new paper.PointText({
				point:  new paper.Point(centerX,centerY + toggle*(radius +25)),
				content: values[i].title,
				fillColor: color,
				fontFamily: "Open Sans, Helvetica",
				fontWeight: '400',
				fontSize: 23,
				justification: "center"
		});
		var data = new paper.PointText({
				point:  new paper.Point(centerX,centerY + toggle*(radius +55)),
				content: values[i].value + "%",
				fillColor: color,
				fontFamily: "Open Sans, Helvetica",
				fontWeight: '800',
				fontSize: 23,
				justification: "center"
		});
	}
};

KPL_Infographics.UI.prototype.draw100IconsChart = function()
{

	var values	= this.model.getValue();
	var nuetralValue;
	if(!values.nuetral)
		nuetralValue = 0;
	else
		nuetralValue = values.nuetral.value;
	
	var positiveStep = values.positive.value + nuetralValue + values.negative.value;
	var nuetralStep	 = values.negative.value + nuetralValue;
	var negativeStep = values.negative.value;
	
	var iconWidth = this._width/27;
	var iconHeight = iconWidth;
	var cnt = 0;
	container = this.container;

	$(container).empty();
	for(var i=0; i<25 ; i++)
	{
		var column = $('<div id="column_'+i+'" class="column"></div>');
		for(var j=0; j< 4; j++)
		{
			cnt++;
			
			var icon;
			var src;
			var type;
			
			if(cnt <= negativeStep)
				type = "negative";
			else if(cnt <= nuetralStep && cnt > negativeStep)
				type = "nuetral";
			else if(cnt <= positiveStep && cnt > nuetralStep)
				type = "positive";
			

			icon = '<div class="' + type + '"><img src="' + values[type].img + '"></div>';
			
			column.append(icon);
		}
		$(container).append(column);
		
	}	
};

KPL_Infographics.UI.prototype.drawKeywordsChart = function()
{
	var container = this.container;
	var values	= this.model.getValue();
	$(container).empty();
	for (var i = 0; i < values.length; i++)
	{
		var color = this._helper.getColorByValue(values[i].bounceRate);
		$(container).append('<div class="keywordLine" id="keyword_' + (i + 1) + '"><span class="bounce">' + values[i].bounces + '</span><span class="bounce-rate"> (' + Math.floor(values[i].bounceRate) + '%)</span><span class="dash">-</span><span class="keyword">' + values[i].keyword + '</span></div>');
		$('#keyword_' + (i + 1)).css("color", color);							
	}
};