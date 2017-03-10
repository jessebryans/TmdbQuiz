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
 			quizApp.userDecadeChoice = year;
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

 			});
 		});

 		$('.question10').on('click', function(e) {
 			e.preventDefault();
 			quizApp.displayQuestion(quizApp.generateYear());
 		});

 	}

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

 	quizApp.generateFiveRandomDescQuestion = function() {
 		let descQuestionArray = [];
 		for (var i = 0; i < 4; i++) {
 			descQuestionArray.push(quizApp.generateRandomDescQuestion());
 		}
 		quizApp.descQuestionArray = descQuestionArray;
 		return descQuestionArray;
 	}

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
 		$.when(...quizApp.castCheckArray).done(function() {
 			quizApp.generateCastQuestionsArray();
 			quizApp.generateFiveRevQuestions();
 			quizApp.generateFiveYearQuestions();
 			quizApp.generateFiveRandomDescQuestion();
 		});
 	}

 	quizApp.generateCastData = function() {
 		let fiveMovies = quizApp.pickFiveMovies();
 		quizApp.getCastForFiveMovies(fiveMovies);
 		let roleQuestionMovie = quizApp.pickRoleMovie();
 	}

 	quizApp.generateFiveYearQuestions = function() {
 		let yearQuestionArray = [];
 		for (var i = 0; i < 4; i++) {
 			yearQuestionArray.push(quizApp.generateYear());
 		}
 		quizApp.yearQuestionArray = yearQuestionArray;
 		return yearQuestionArray;
 	}

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
 			question: 'Which year was this movie released?',
 			type: 'multipleChoice',
 			movie: movieByYearAnswer,
 			title: movieByYearAnswer.title
 		}
 		return questionObject;
 	};

 	quizApp.generateWrongYears = function(correctAnswer) {
 		let wrongAnswers = [];
 		let max = 4;
 		let min = 1
 		for (var i = 0; wrongAnswers.length < 3; i++) {
 			let randoNum = Math.floor(Math.random() * (max - min + 1));
 			let randomNumlower = Math.floor(Math.random() * (2 - 1 + 1));
 			let wrongAnswer;
 			if (randomNumlower === 1) {
 				wrongAnswer = (quizApp.userDecadeChoice + 5) + randoNum;
 			} else {
 				wrongAnswer = (quizApp.userDecadeChoice + 5) - randoNum;
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
 		for (otherMovie in quizApp.castdata) {
 			let randomCastMemeber = Math.floor(Math.random() * (quizApp.castdata[otherMovie].cast.length));
 			if (otherMovie !== movie && castArray.length < 3) {
 				castArray.push(quizApp.castdata[otherMovie].cast[randomCastMemeber].name);
 			}
 		}
 		return castArray;
 	}

 	//Displaying Question

 	quizApp.displayQuestion = (question) => {
 		$('.questions__text').empty('');
 		$('.questions__text').append(quizApp.generateYear().question);

 		// console.log(quizApp.generateYear().question);
 		// var multiButtons = Math.floor(Math.random() * quizApp.generateYear().allYears[0];
 		let questionobj = quizApp.generateYear();

 		$('#answerOne').text(questionobj.allYears[0])
 		$('#answerTwo').text(questionobj.allYears[1])
 		$('#answerThree').text(questionobj.allYears[2])
 		$('#answerFour').text(questionobj.allYears[3])
 			// console.log(questionobj.allYears)
 	}


 	//when user selects a button (on.click) determine if it is the wrong or right answer

 	// $('#radioButtonsYear').on('click', function(e) {
 	// 	console.log(quizApp.generateYear.questionobj.yearNum)
 	// });
 	//prompt or alert appears
 	// if answer is right go to next wuestion 
 	//else keep choosing

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


 	quizApp.getRandomYearRevenueMovies = function(year){
 		return $.ajax({
 			url: 'https://api.themoviedb.org/3/discover/movie',
 			type: 'GET',
 			dataType: 'JSON',
 			data: {
 				api_key: '8a92833b6f0e0a614c460724797ccc79', // our key is limited to 40 calls every 10 seconds.
 				format: 'json',
 				sort_by: 'revenue.desc', //puts most revenue movies at the top
 				primary_release_year: year //movies from this year
 			}
 		})
 	}

 	quizApp.generateRevenueQuestion = function() {
 		let randoNum = Math.floor(Math.random() * (9 - 0 + 1))
 		let randomYear = quizApp.userDecadeChoice + randoNum;
 		let revenueMoviesCheck = quizApp.getRandomYearRevenueMovies(randomYear);
 		quizApp.revMovieCheckArray.push(revenueMoviesCheck);
 	}

 	quizApp.generateFiveRevQuestions = function() {

 		let revQuestionArray = [];
 		quizApp.revMovieCheckArray = [];
 		for (var i = 0; i < 4; i++) {
 			quizApp.generateRevenueQuestion();
 		}
 		$.when(...quizApp.revMovieCheckArray).done(function(...data) {
 			data.forEach((index)=> {	
			let yearRevMovies = index[0].results;
			let questionObject = {};
			let randomIndex = Math.floor(Math.random() * ((yearRevMovies.length - 3) - 0 + 1));
			let wrongAnswers = [];
			let randomWrongIndexStart = Math.floor(Math.random() * (yearRevMovies.length - randomIndex + 1))
			for (var i = 0; i < 2; i++) {
				let wrongAnswer = yearRevMovies[(randomWrongIndexStart + i)].title;
				wrongAnswers.push(wrongAnswer)
			}
			// questionObject.year = randomYear;
			questionObject.moviesByRev = yearRevMovies;
			questionObject.question = 'Which of these movies made the largest amount of money?'
			questionObject.answer = yearRevMovies[randomIndex].title;
			questionObject.answerObject = yearRevMovies[randomIndex];
			questionObject.year = yearRevMovies[randomIndex].release_date.slice(0,4) * 1;
			questionObject.wrongAnswers = wrongAnswers;
			questionObject.type = 'multipleChoice';
			revQuestionArray.push(questionObject);
 			})
 		});
 		quizApp.revQuestionArray = revQuestionArray;
 		return revQuestionArray;
 	}


	quizApp.pickRoleMovie = function() {
		let movieObject	= quizApp.moviedata
		let randoNum = Math.floor(Math.random() * (movieObject.length)) + 1;
		let movieForRoleQ = movieObject[randoNum];
		let movieTitle = movieForRoleQ.title;
		let movieId = movieForRoleQ.id;
		let castObject = quizApp.getCasts(movieId);
		$.when(castObject).then(function(data) {
			let roleMovieCast = data.cast;
			// console.log(roleMovieCast);
			quizApp.generateRoleQuestion(roleMovieCast);
		});
		
	}
	
	// Which role did (this actor) play in (this movie)?
	quizApp.generateRoleQuestion = function(cast) {
		let correctCharacter = cast[0].character;
		let correctName = cast[0].name;
		let wrongCharactersArray = [];
		let randoNum = Math.floor(Math.random() * cast.length) + 1;
		let wrongCharacter = cast[randoNum].character;
		// console.log(wrongCharacter);
		for (let i = 0; i < 3; i++) {
			wrongCharactersArray.push(wrongCharacter);
		}
		let allCharacters = wrongCharactersArray;
		allCharacters.push(correctCharacter);
		let roleQuestionObject = {
			wrongCharactersArray: wrongCharactersArray,
			correctCharacter: correctCharacter,
			allCharacters: allCharacters,
			question: 'What character did (X) play in (Y)?',
			type: 'multipleChoice'
		}
		return roleQuestionObject;
	}

	quizApp.generateFiveRandomRoleQuestion = function() {
	 		let roleQuestionArray = [];
			for (var i = 0; i < 4; i++) {
				roleQuestionArray.push(quizApp.generateRoleQuestion());
			}
			quizApp.roleQuestionArray = roleQuestionArray;
			return roleQuestionArray;
	 	}


 	quizApp.init = function() {
 		quizApp.events();
 	};


 	$(function() {
 		quizApp.init();
 	});