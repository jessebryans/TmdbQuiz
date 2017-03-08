	const quizApp = {};

	quizApp.getMovies = function() {
		$.ajax({
			url: 'https://api.themoviedb.org/3/discover/movie',
			type: 'GET',
			dataType: 'JSON',
			data: {
				api_key: '8a92833b6f0e0a614c460724797ccc79', // our key is limited to 40 calls every 10 seconds.
				format: 'json'
				sort_by: 'popularity.desc', //puts most popular movies at the top
				primary_release_year: '2015' //movies from this year
			}
		})
		.done(function(data) { //runs if ajax calls works
			console.log("success");
			console.log(data)
		})
		.fail(function() { //runs if ajax call fails
			console.log("error");
		})
		.always(function() { //runs no matter what
			console.log("complete");
		})
		
	}





	quizApp.init = function() {
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