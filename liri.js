//Core node package of reading and writing files
var fs = require("fs");
var userInput = process.argv[2];
var request = require("request");
var Spotify = require('node-spotify-api');
var nodeArgs = process.argv;
var Twitter = require("twitter");
//Get the twitter's keys from another file
var twitter = require("./keys.js");

//Get the users input info to trigger the right funtion
switch (userInput) {
	case "movie-this":
		movie();
		break;
	case "my-tweets":
		tweets();
		break;
	case "spotify-this-song":
		spotify();
		break;
	case "do-what-it-says":
		doTheSays();
		break;
}

//Do what it says function
function doTheSays() {
	//read the text from random file
	fs.readFile("random.txt","utf8", function(err, data) {
		//if there are some errors, log the errors
		if (err) {
			return console.log(error);
		//otherwise run the info
		} else {
			var dataArr = data.split(",");
			//sign the user input in dataArr
			userInput = dataArr[0];
			//put two empty strings in the dataArr
			dataArr.splice(1, 0, "", "");
			//sign the new dataArr contains with empty strings to nodeArgs 
			nodeArgs = dataArr;
			//Get the users input info to trigger the right funtion
			switch (userInput) {
				case "movie-this":
					movie();
					break;
				case "my-tweets":
					tweets();
					break;
				case "spotify-this-song":
					spotify();
					break;
				case "do-what-it-says":
					doTheSays();
					break;
			}
		}
	});
}
//Spotify function
function spotify() {

	//Creat an empty variable for holding the spotify input
	var spotifyInput = "";
	//spotify API keys
	var spotify = new Spotify({
		id: "1dbb4d564c6f4e4b9ebd96a744920cdf",
		secret: "11cf992a816f4956b0f6bcb94bcba4c0"
	});
	//If the uer does not put any song in, it will default by the song's name called "The sign"
	if (nodeArgs.length === 3) {
		spotifyInput = "The Sign Ace of Base"
	} else {
		//This for loop will take the uer's input by multiple words
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i > 3 && i <nodeArgs.length) {
				spotifyInput = spotifyInput + "+" + nodeArgs[i];
			} else {
				spotifyInput = spotifyInput + nodeArgs[i];
			}
		}
	}
	//Creat an empty variable to hold the query from the user
	var input = {type:'track', query:spotifyInput};
	//Search the name of the song in Spotify by user's input
	spotify.search(input, function(err, data) {
		//if not errors, log the info
		if (!err) {
			console.log("the artist: " + data.tracks.items[0].artists[0].name); 
			console.log("the song's name: " + data.tracks.items[0].name);
		 	console.log("the link of the song: " + data.tracks.items[0].preview_url); 
		 	console.log("the song is from this album: " + JSON.stringify(data.tracks.items[0].album, null, 2));
		//if it has errors, log the error messages
		} else {
		 return console.log('Error occurred: ' + err);
		}
	});

}

//twitter function
function tweets() {
	//creat a varible to grab twitter's keys
	var client = new Twitter(twitter);

	//get into Twitter's data by timeline
	client.get('statuses/user_timeline', function(error, tweets, response){
		//If it has error, log error messages
		if (error) {
			console.log(error);
		//If there is no error, log the 20 tweets info
		} else {
			for (var i = 0; i < 10; i++) {
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);
			}
		}
	});
}

//Movie function
function movie() {
	// Create an empty variable for holding the movie name
	var movieName = "";

	//If user does not put anything, movieName will be defaulted by the name of "Mr.Nobody"
	if (nodeArgs.length === 3) {
		movieName = "Mr.Nobody";
		//If user puts movie names, it will show the movie's info
	} else {
		//This statement will take a move with multiple words  
		for (var i = 3; i < nodeArgs.length; i++) {
			if (i > 3 && i <nodeArgs.length) {
				movieName = movieName + "+" + nodeArgs[i];
			} else {
				movieName = movieName + nodeArgs[i];
			}
		}
	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {
		// If the request is successful, log the info
		if (!error && response.statusCode === 200) {
			console.log("the name of the movie: " + JSON.parse(body).Title);
			console.log("Year the movie came out: " + JSON.parse(body).Year);
			console.log("IMBD rating of the movie: " + JSON.parse(body).Rated);
			console.log("Rotten tomatoes rating of the movie: " + JSON.parse(body).Ratings[2].Value);
			console.log("Country of the movie was produced: " + JSON.parse(body).Country);
			console.log("Language of the movie: " + JSON.parse(body).Language);
			console.log("Plot of the movie: " + JSON.parse(body).Plot);
			console.log("Actors in the movie: " + JSON.parse(body).Actors);
		}

	});

}