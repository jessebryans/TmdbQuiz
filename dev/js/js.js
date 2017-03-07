	const quizApp = {};

	quizApp.getMovies = function() {
		$.ajax({
			url: 'https://api.themoviedb.org/3/discover/movie',
			type: 'GET',
			dataType: 'JSON',
			data: {
				api_key: '8a92833b6f0e0a614c460724797ccc79',
				format: 'json',
				limit: 50
				// sort_by: 'popularity.desc'
				// primary_release_year: '2015'
			}
		})
		// .done(function(data) {
		// 	console.log("success");
		// 	console.log(data)
		// })
		// .fail(function() {
		// 	console.log("error");
		// })
		// .always(function() {
		// 	console.log("complete");
		.then(function(data) {
			console.log(data);
		};
		
	}





	quizApp.init = function() {
		quizApp.getMovies();
		console.log("success!");
		/************
		INTRO
		************/
		/*get the decade from the user (select decade button)
			on click event that listens to the input box, radio buttons or dropdown list
				-
		*/

		/*contact database get movie data from chosen decade (maybe different ajax calls)
		*/

		// on.submit (Play Game!)


		/************
		GAME WINDOW
		************/
		
		// quizApp.getQuestions(function() {
			// generate questions from 6 categories (some how???)
			//questions about which movie starred actors X and Y
			//or name one of the actors that starred in movie Z
			//or even multiple choice questions!
		// });
		// generate html from questions
		// user clicks question tile for pop-up window (overlay)
		
		/*SCORE BOARD*/
		//generate users score
		//for every right answer increase score
		// for every wrong answer decrease score

		/*****************************
		Key Properties to use
		- popularity
		- vote_average
		- release_date
		- overview
		- original_title (for the movie title)
		*****************************/
	};




	$(function() {
		quizApp.init();
	});