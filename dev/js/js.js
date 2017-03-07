	const quizApp = {};

	quizApp.getMovies = function() {
		$.ajax({
			url: 'https://api.themoviedb.org/3/discover/movie',
			type: 'GET',
			dataType: 'JSON',
			data: {
				api_key: '8a92833b6f0e0a614c460724797ccc79',
				sort_by: 'popularity.desc',
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





	quizApp.init = function() {

	};

	$(function() {
		quizApp.init();
	})