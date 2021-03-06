var p1points = 0;
var p2points = 0;
var p3points = 0;
var p4points = 0;
var p1mj = 0;
var p2mj = 0;
var p3mj = 0;
var p4mj = 0;
var p1name = "";
var p2name = "";
var p3name = "";
var p4name = "";
var windRotation = [1,2,3,4];
var inning = 1;


function newLabels() {
	p1name = document.getElementById("p1name").value;
	p2name = document.getElementById("p2name").value;
	p3name = document.getElementById("p3name").value;
	p4name = document.getElementById("p4name").value;

	document.querySelector("label[for=points1]").innerHTML = p1name;
	document.querySelector("label[for=points2]").innerHTML = p2name;
	document.querySelector("label[for=points3]").innerHTML = p3name;
	document.querySelector("label[for=points4]").innerHTML = p4name;

	var continueQ = document.querySelector('input[name="continue"]:checked');
	if (continueQ.value == "yes") continueGame();
	hideDiv("welcome"); showDiv("mahjong");
}

function continueGame() {
	p1points = Number(document.getElementById("p1pts").value);
	p2points = Number(document.getElementById("p2pts").value);
	p3points = Number(document.getElementById("p3pts").value);
	p4points = Number(document.getElementById("p4pts").value);

	var previousInning = document.querySelector('input[name="inningCheck"]:checked');   
	inning = Number(previousInning.value);

	var windTurn = Number(document.getElementById('windTurn').value);

	windRotation[0] = windTurn;

	for (var i=1;i<4;i++) {
		if (windRotation[i-1] == 4) windRotation[i] = 1;
		else windRotation[i] = windRotation[i-1] + 1;
	}

	displayResults();
}

function play() {
	var results = [
		["p1",document.getElementById("points1").value,windRotation[0]],
		["p2",document.getElementById("points2").value,windRotation[1]],
		["p3",document.getElementById("points3").value,windRotation[2]],
		["p4",document.getElementById("points4").value,windRotation[3]],
	];
	
	var win = document.querySelector('input[name="win"]:checked').value;
	mjCounter(win);

	var winner;
	var east;
	var mode = "Regular";
	for (var i = 0; i < 4; i++) {
		if (results[i][2] == 1) east = results[i];
		if (results[i][0] == win) winner = results[i];
	}

	if (winner == east) {
		mode = "EastWin";
		results.splice(results.indexOf(east),1);
		results.unshift(east);

	} else {
		results.splice(results.indexOf(east),1);
		results.splice(results.indexOf(winner),1);
		results.unshift(east);
		results.unshift(winner);
	}


	if (mode == "Regular") {
		var points1 = results[2][1];
		var points2 = results[3][1];
		var pointsE = results[1][1];
		var pointsW = results[0][1];
		
		results[1][1] = ((pointsE - points1) * 2) + ((pointsE - points2)*2) - (pointsW * 2);			
		results[2][1] = ((points1 - pointsE)*2) + (points1 - points2) - pointsW;
		results[3][1] = ((points2 - pointsE)*2) + (points2 - points1) - pointsW;
		results[0][1] = pointsW * 4;

		windRotate();
		if (windRotation[0] == 1) inning++;
	}

	else if (mode == "EastWin") {
		var pointsE = results[0][1];
		var points1 = results[1][1];
		var points2 = results[2][1];
		var points3 = results[3][1];

		results[0][1] = pointsE * 6;
		results[1][1] = (points1 - points2) + (points1 - points3) - (pointsE * 2);
		results[2][1] = (points2 - points1) + (points2 - points3) - (pointsE * 2);
		results[3][1] = (points3 - points1) + (points3 - points2) - (pointsE * 2);
	}

	for (i = 0; i < 4; i++) {
		var ptCount = results[i][1];
		switch(results[i][0]) {
			case "p1":
			p1points += ptCount;
			break;
			case "p2":
			p2points += ptCount;
			break;
			case "p3":
			p3points += ptCount;
			break;
			case "p4":
			p4points += ptCount;
			break;
		}
	}
	
	if (inning > 4) {
		endGame();
		hideDiv("mahjong");
		showDiv("endGame");		
	}
		
	else {
		displayResults();
		clearChildren(document.getElementById('pointsForm'));
	}
}

function newGameReload() {
	if(confirm('Are you sure you want to start a new game? All data for this game will be lost')) {
		window.location.reload(true);
	}
}

function clearChildren(element) {
   for (var i = 0; i < element.childNodes.length; i++) {
      var e = element.childNodes[i];
      if (e.className != "windSelect") {
	      if (e.tagName) switch (e.tagName.toLowerCase()) {
	         case 'input':
	            switch (e.type) {
	               case "radio":
	               case "checkbox": e.checked = false; break;
	               case "button":
	               case "submit":
	               case "image": break;
	               default: e.value = ''; break;
	            }
	            break;
	         case 'select': e.selectedIndex = 0; break;
	         case 'textarea': e.innerHTML = ''; break;
	         default: clearChildren(e);
	      }
	  }
   }
}

function windRotate() {
	for (i=0;i<4;i++) {
		var w = windRotation[i];
		if (w == 1) w = 4;
		else w--;
		windRotation[i] = w;
	}
}

function wind(w) {
	switch(w) {
		case 1: return "East";
		case 2: return "South";
		case 3: return "West";
		case 4: return "North";
	}
}

function displayWinds() {
	document.getElementById("p1w").innerHTML = wind(windRotation[0]);
	document.getElementById("p2w").innerHTML = wind(windRotation[1]);
	document.getElementById("p3w").innerHTML = wind(windRotation[2]);
	document.getElementById("p4w").innerHTML = wind(windRotation[3]);
}

function mjCounter(player) {
	switch (player) {
		case "p1": p1mj++; break;
		case "p2": p2mj++; break;
		case "p3": p3mj++; break;
		case "p4": p4mj++; break;
	}
}

function displayResults() {
	document.getElementById("inning").innerHTML = `We are in the inning of the ${wind(inning)}.`;
	document.getElementById("demo1").innerHTML = `<b>${p1name}</b> has <b>${p1points}</b> points. Total Mah-Jongs: ${p1mj}.`;
	document.getElementById("demo2").innerHTML = `<b>${p2name}</b> has <b>${p2points}</b> points. Total Mah-Jongs: ${p2mj}.`;
	document.getElementById("demo3").innerHTML = `<b>${p3name}</b> has <b>${p3points}</b> points. Total Mah-Jongs: ${p3mj}.`;
	document.getElementById("demo4").innerHTML = `<b>${p4name}</b> has <b>${p4points}</b> points. Total Mah-Jongs: ${p4mj}.`;

	displayWinds();
}

function endGame() {
	var endWinner = "";
	var endWinnerPoints = 0;
	var mostMj = "";
	var mostMjNum = 0;
	var topMj = true;
		
	var pointsArray = [[p1name,p1points,p1mj],[p2name,p2points,p2mj],[p3name,p3points,p3mj],[p4name,p4points,p4mj]];
		for (var i = 0; i < 4; i++) {
			if (pointsArray[i][1] > endWinnerPoints) {
				endWinner = pointsArray[i][0];
				endWinnerPoints = pointsArray[i][1];
			}
			if ((pointsArray[i][2] == mostMjNum) && pointsArray[i][2] != 0) topMj = false;
			if (pointsArray[i][2] > mostMjNum) {
				mostMj = pointsArray[i][0];
				mostMjNum = pointsArray[i][2];
			}
		}
	document.getElementById("endMessage").innerHTML = 
		`<p>The game has ended.</p>
		<h2><b>The winner is ${endWinner}!</b></h2> 
		<p>${p1name} has ${p1points} points. Total Mah-Jongs: ${p1mj}.</p>
		<p>${p2name} has ${p2points} points. Total Mah-Jongs: ${p2mj}.</p>
		<p>${p3name} has ${p3points} points. Total Mah-Jongs: ${p3mj}.</p>
		<p>${p4name} has ${p4points} points. Total Mah-Jongs: ${p4mj}.</p>
		`;
	if (topMj) document.getElementById("mostMj").innerHTML = `<p>The player with the most numbers of Mah-Jong wins was ${mostMj} with ${mostMjNum} wins.</p>`;
}

function showDiv(elementID) {
	document.getElementById(elementID).style.display="block";
}
function hideDiv(elementID) {
	document.getElementById(elementID).style.display="none";
}
