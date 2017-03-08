 	const quizApp = {};

	quizApp.getMovies = function() {
		$.ajax({
			url: 'https://api.themoviedb.org/3/discover/movie',
			type: 'GET',
			dataType: 'JSON',
			data: {
				api_key: '8a92833b6f0e0a614c460724797ccc79',
				sort_by: 'popularity.desc',
				feilds: 'person',
				primary_release_year: '2015'
			},
		})
		.done(function(data) {
			console.log("success");
			console.log(data)
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	}

	quizApp.getActors = function() {
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
			console.log(data)
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	}




	quizApp.init = function() {

	};

	$(function() {
		quizApp.init();
	})