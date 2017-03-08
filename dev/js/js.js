 	const quizApp = {};

	quizApp.getMovies = function(year) {
		$.ajax({
			url: 'https://api.themoviedb.org/3/discover/movie',
			type: 'GET',
			dataType: 'JSON',
			data: {
				api_key: '8a92833b6f0e0a614c460724797ccc79',
				format: 'json',
				// sort_by: 'popularity.desc',
				primary_release_year: year
			}
		})
		.done(function(data) {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		})
		.then(function(data) {
			console.log(data);
		});
		
	}

	quizApp.getCasts = function() {
		$.ajax({
			// **345678 placeholder until we get the movie id
			url: 'https://api.themoviedb.org/3/movie/345678/casts',
			type: 'GET',
			dataType: 'JSON',
			data: {
				api_key: '8a92833b6f0e0a614c460724797ccc79'
			},
		})
		.done(function(data) {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			// console.log(data);
		});
	}

quizApp.events = () => {
	$('#submitButton').on('click', (e) => {
		e.preventDefault();
		// Multiplied value by one to coerce string into number
		let year = ($('#yearSelection').val()*1);
		// Make an ajax call for the following nine years after #yearSelection
		for (i = 0; i < 10; i++) {
			quizApp.getMovies(year);
			console.log("Hello", year);
			year = year + 1;
		}
	});
}



	quizApp.init = function() {
		quizApp.events();
		quizApp.getMovies();

		/************
		INTRO
		************/
		/* Get the decade from the user
			on click event that listens to the select/text input
		*/
		/* Call ajax function to get movie data from chosen decade (maybe different ajax calls)
		*/

		/* on.submit (Generate categories, generate questions, shuffle, Play Game!)
			Categories (ideas): 
				- Big budget films
				- Box office flops
				- Classics
				- Award-winning films
				- by Genre (sci-fi, horror, comedy, animated, doc, shorts)
			Questions (ideas):
				- Which movie starred actors X and Y
				- Name one of the actors that starred in movie Z
				- Multiple choice questions!
			Function for shuffling questions/categories:
				(Shuffles the arrays)
				
				function shuffle(questions) {
				  var m = questions.length, t, i;
				  while (m) {
				    i = Math.floor(Math.random() * m--);
				    t = questions[m];
				    questions[m] = questions[i];
				    questions[i] = t;
				  }
				  return questions;
				}

				Calls the shuffle to run
				questions = shuffle(questions);
		*/	

		/************
		GAME WINDOW
		************/
		
		// Insert Questions function:
		// user clicks question tile and is prompted with an overlay
			// Overlay can contain question, answer box or buttons and pass/submit

		/*SCORE BOARD*/
		//generate users score
		//for every right answer increase score
		// for every wrong answer decrease score

		/*****************************
		Movie Data Available (property names):
			adult
			backdrop_path
			genre_ids
			id
			original_language
			original_title
			overview
			popularity
			poster_path
			release_date
			title
			video
			vote_average
			vote_count
		*****************************/
	};




	$(function() {
		quizApp.init();
	});