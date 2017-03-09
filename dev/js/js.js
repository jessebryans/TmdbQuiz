 	const quizApp = {};

 	quizApp.getMovies = function(year) {
 		return $.ajax({
 			url: 'https://api.themoviedb.org/3/discover/movie',
 			type: 'GET',
 			dataType: 'JSON',
 			data: {
 				api_key: '8a92833b6f0e0a614c460724797ccc79', // our key is limited to 40 calls every 10 seconds.
 				format: 'json',
 				sort_by: 'popularity.desc', //puts most popular movies at the top
 				primary_release_year: year //movies from this year
 			}
 		})

 	}

 	quizApp.getCasts = function(movieId) { //takes movie id, gets cast and crew for that movie
 		return $.ajax({
 			url: `https://api.themoviedb.org/3/movie/${movieId}/casts`,
 			type: 'GET',
 			dataType: 'JSON',
 			data: {
 				api_key: '8a92833b6f0e0a614c460724797ccc79'
 			},
 		})
 	}

 	quizApp.events = () => {
 		$('#submitButton').on('click', (e) => {
 			e.preventDefault();
 			// Multiplied value by one to coerce string into number
 			let year = ($('#yearSelection').val() * 1);
 			// Make an ajax call for the following nine years after #yearSelection
 			quizApp.movieChecks = [];

 			for (i = 0; i < 10; i++) {
 				quizApp.movieChecks.push(quizApp.getMovies(year));
 				// console.log("Hello", year);
 				year = year + 1;
 			}
 			$.when(...quizApp.movieChecks).done((...results) => {
 				// console.log(results);
 				let betterArray = results.map((array) => {
 					return array[0].results;
 				})
 				let finalArray = [];
 				betterArray.forEach((movieGroup) => {
 						movieGroup.forEach((movie) => {
 							finalArray.push(movie);
 						})
 					}) //end of double loop
 				quizApp.moviedata = finalArray;
 				quizApp.generateCastData();
 				quizApp.generateRandomCastQuestion();
 			});
<<<<<<< HEAD


=======
>>>>>>> d02278a60223e250f2a4862d9083fe757b8af42e
 		});
 	}


 	quizApp.init = function() {
 		quizApp.events();
 	};



 	quizApp.removeTitleFromDescription = function(description, title) {
 		let titleWords = title;
 		var newDescription = description;
 		titleWords = titleWords.split(''); //splits the title into an array of words
 		titleWords.forEach((word, index) => { //removes non alphanumeric characters from each word (IE Max: becomes Max)

 			titleWords[index] = titleWords[index].replace(/\W/g, '');
 			newDescription = newDescription.replace(new RegExp(titleWords[index], 'gi'), '*Blank*');

 		});
 		return {
 			description: newDescription,
 			title: title,
 			origDec: description
 		};
 	}

 	quizApp.questionDescription = function(descriptionObject) {
 		let actualTitle = descriptionObject.title;
 		let description = descriptionObject.description;
 		let wrongAnswers = [];
 		let movieObject = quizApp.moviedata; //This needs to target the results of our ajax request
 		let randoNum = Math.floor(Math.random() * (movieObject.length - 4)) + 1
 		for (var i = 0; i < 4; i++) {
 			let randoIndex = randoNum + i
 			wrongAnswers.push(movieObject[randoIndex].title)
 		}
 		let allTitles = wrongAnswers;
 		allTitles.push(actualTitle);
 		const questionObject = {
 			wrongAnswers: wrongAnswers,
 			answer: actualTitle,
 			allTitles: allTitles,
 			question: 'Name the movie that this text is describing!',
 			type: 'multipleChoice',
 			descriptionBlanked: description,
 			origDesc: descriptionObject.origDesc
 		}
 		return questionObject;
 	}

 	quizApp.generateRandomDescQuestion = function() {
 		let movieObject = quizApp.moviedata;
 		let answerMovieIndex = Math.floor(Math.random() * (movieObject.length)) + 1;
 		let randomMovieEntry = movieObject[answerMovieIndex];
 		let cleanDescription = quizApp.removeTitleFromDescription(randomMovieEntry.overview, randomMovieEntry.title)
 		let questionObject = quizApp.questionDescription(cleanDescription);
 		console.log(questionObject);
 		return questionObject;
 	}

	quizApp.leadActor = function(castIndex) { //gets lead actor for correct movie 
		
		let castDataKeys = Object.keys(quizApp.castdata)
		let movieCast = quizApp.castdata[castDataKeys[castIndex]] // maybe not???
		let leadActor = movieCast.cast[0].name
		// console.log('leadActor:', leadActor)
		return leadActor;
	};




	quizApp.wrongAnswers = function(wrongIndex) {
		let wrongMovieCast = [];
		let castDataKeys = Object.keys(quizApp.castdata)
		// console.log('wrong index:', wrongIndex)
		// console.log('castDataKeys:', castDataKeys)
		console.log('castdata:', quizApp.castdata)
		let movieCast = quizApp.castdata[castDataKeys[wrongIndex]]
		// console.log('movieCast:', movieCast)
		for (var i = 1; i < 5; i++) {
			
			let wrongActors = movieCast.cast[i].name
			wrongMovieCast.push(wrongActors)
			} 
			return wrongMovieCast;	
		}// let incorrectActors = wrongMovieCast;
	

	 	

  	quizApp.generateRandomCastQuestion = () => {
  		let arrayOfQuestions = [];
  		for (var i = 0; i < 4; i++) {
  			let question = quizApp.getCastQuestion(i);
  			arrayOfQuestions.push(question)

 		
 		}
 		console.log(arrayOfQuestions);
 			
 		}

 		quizApp.getCastQuestion = function(i) {
 			  		
 		let correctActor = quizApp.leadActor(i);
		let wrongArray = quizApp.wrongAnswers(i);
		return {
			answer: correctActor,
			wrongAnswers: wrongArray
		}
 		}
 		
 		// let allActors = wrongActors;
 		// allActors.push(actualActor);
 		// const questionObject = {
 		// 	wrongAnswers: wrongAnswers,
 		// 	answer: actualActor,
 		// 	allActors: allActors,
 		// 	question: 'Name the actor or actress that stars in this movie!',
 		// 	type: 'multipleChoice'
 		// }
 		// // return questionObject;
 	

 	quizApp.pickFiveMovies = function() {
 		let theMovies = [];
 		for (var i = 0; i < 5; i++) { //do this 5 times
 			let randoNum = Math.floor(Math.random() * (quizApp.moviedata.length)) + 1
 			theMovies.push(quizApp.moviedata[randoNum]);
 		}
 		return theMovies;
 	}

 	quizApp.getCastForFiveMovies = function(theMoviesArray) {
 		quizApp.castdata = {};
 		quizApp.castCheckArray = [];

 		theMoviesArray.forEach((movie) => {
 			let movieId = movie.id;
 			let movieTitle = movie.title;
 			let castCheck = quizApp.getCasts(movieId);
 			quizApp.castCheckArray.push(castCheck);

 			$.when(castCheck).done((data) => {
 				console.log('first');
 				quizApp.castdata[movieTitle] = data;
 				quizApp.castdata[movieTitle].title = movieTitle;
 			});
 		})
<<<<<<< HEAD


=======
 		$.when(...quizApp.castCheckArray).done(function() {
 			quizApp.generateCastQuestionsArray()
 		});
>>>>>>> d02278a60223e250f2a4862d9083fe757b8af42e

 	}

 	quizApp.generateCastData = function() {
 		let fiveMovies = quizApp.pickFiveMovies();
 		quizApp.getCastForFiveMovies(fiveMovies);

 	}




 	$(function() {
 		quizApp.init();
 	});

<<<<<<< HEAD
 	//of the five random movies we need the name of the film and the top actor
 	//generate wrong answers for quiz
 	//and then write the question program

=======
 	quizApp.generateYear = function() {
 		let max = quizApp.moviedata.length;
 		let min = 0;
 		let randomNum = Math.floor(Math.random() * (max - min + 1));

 		//generated movies for random year
 		let movieByYearAnswer = quizApp.moviedata[randomNum];

 		//get relase date from movie
 		let correctReleaseDate = movieByYearAnswer.release_date;
 		//slicing it to only get the year and not the month and day
 		let yearNum = (correctReleaseDate.slice(0, 4) * 1);
 		// variable for wrong answers
 		let wrongAnswers = quizApp.generateWrongYears(yearNum);

 		let allYears = [];
 		allYears.push(...wrongAnswers); //...spreads array out into comma separated values
 		allYears.push(yearNum)

 		const questionObject = {
 			wrongAnswers: wrongAnswers,
 			answer: yearNum,
 			allYears: allYears,
 			question: 'Which year was this movie release?',
 			type: 'multipleChoice',
 			movie: movieByYearAnswer,
 			title: movieByYearAnswer.title
 		}
 		return questionObject;
 	};

 	//create wrong answers
 	quizApp.generateWrongYears = function(correctAnswer) {
 		let wrongAnswers = [];
 		let max = 5;
 		let min = 1
 		for (var i = 0; wrongAnswers.length < 3; i++) {
 			let randoNum = Math.floor(Math.random() * (max - min + 1));
 			let randomNumlower = Math.floor(Math.random() * (2 - 1 + 1));
 			let wrongAnswer;
 			if (randomNumlower === 1) {
 				wrongAnswer = correctAnswer + randoNum;
 			} else {
 				wrongAnswer = correctAnswer - randoNum;
 			}
 			let isUnique = true;

 			wrongAnswers.forEach(function(year) {
 				if (year === wrongAnswer) {
 					isUnique = false;
 				}
 			})
 			if (isUnique === true) {
 				wrongAnswers.push(wrongAnswer)
 			}

 		}
 		return wrongAnswers;
 	}

 	quizApp.getRandomCastArray = function(movie) {
 		let castArray = [];
 		for(otherMovie in quizApp.castdata){
 			let randomCastMemeber = Math.floor(Math.random() * (quizApp.castdata[otherMovie].cast.length));
 			if(otherMovie !== movie && castArray.length < 3){
 				castArray.push(quizApp.castdata[otherMovie].cast[randomCastMemeber].name);
 			}
 		}
 		return castArray;
 	}

 	quizApp.generateCastQuestion = function(movie) {
 		let correctAnswer = quizApp.castdata[movie].cast[0].name;
 		let wrongAnswers = quizApp.getRandomCastArray(movie);
 		let allOptions = [];
 		allOptions.push(...wrongAnswers);
 		allOptions.push(correctAnswer);
 		let questionObject = {
 			wrongAnswers: wrongAnswers,
 			answer: correctAnswer,
 			allOptions: allOptions,
 			question: 'Who was the lead actor in this film?',
 			type: 'multipleChoice',
 			movie: quizApp.castdata[movie],
 			title: quizApp.castdata[movie].title
 		}
 		return questionObject;
 	}



 	quizApp.generateCastQuestionsArray = function() {
 		castQuestionArray = [];
 		for (movie in quizApp.castdata) {
 			let newQuestion = quizApp.generateCastQuestion(movie);
 			castQuestionArray.push(newQuestion);
 		}
 		quizApp.castQuestions = castQuestionArray;
 		return castQuestionArray
 	}
>>>>>>> d02278a60223e250f2a4862d9083fe757b8af42e
