 	const quizApp = {};

 	// courtesy of http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 	quizApp.shuffle = function(a) {
 		for (let i = a.length; i; i--) {
 			let j = Math.floor(Math.random() * i);
 			[a[i - 1], a[j]] = [a[j], a[i - 1]];
 		}
 	}

 	quizApp.firebaseInit = function() {
 		// Initialize Firebase
 		var config = {
 			apiKey: "AIzaSyDHFyTJOQj_A7LGzwiw9bnvCkPhBXXviIU",
 			authDomain: "trebeksquad-quiz-app.firebaseapp.com",
 			databaseURL: "https://trebeksquad-quiz-app.firebaseio.com",
 			storageBucket: "trebeksquad-quiz-app.appspot.com",
 			messagingSenderId: "434381434216"
 		};
 		firebase.initializeApp(config);
 		quizApp.dbref = firebase.database().ref();
 		quizApp.dbref.on('value', (response) => {
 				$('.scores__results').empty();
 				let highScores = response.val().highScores;
 				highScores = highScores.sort((a, b) => {
 					return b.score - a.score
 				});
 				quizApp.highScores = highScores;
 				highScores.forEach((score, index) => {
 					$('.scores__results').append(`<li><p><span class="userName scoreName${index}"></span><span class="userScore scoreNum${index}"></span></p></li>`);
 					$(`.scoreName${index}`).text(score.name + ': ');
 					$(`.scoreNum${index}`).text(score.score);

 				})
 			})
 			// quizApp.dbref.child("highScores");
 	}

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

 		$('.highScoreinput__form').on('submit', function(event) {
 			event.preventDefault();
 			/* Act on the event */
 			let scoreToChange = quizApp.highScores[quizApp.userScoreTakeoverNum];
 			scoreToChange.name = $('.newHighName').val();
 			scoreToChange.score = quizApp.userScore;
 			quizApp.dbref.child('highScores').set(quizApp.highScores);

 			$('.highScoreinput').fadeOut('slow');
 		});

 		$('#submitButton').on('click', (e) => {
 			e.preventDefault();
 			// Multiplied value by one to coerce string into number
 			$('.landingSplash').fadeOut('slow', function() {
 				$('.main').fadeIn('slow');
 			});;
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

 		$('.gameCategory').on('click', '.gameButton', function(event) {
 			event.preventDefault();
 			quizApp.currentQuestionBtn = null;
 			quizApp.currentQuestionBtn = $(this);
 		});

 		$('.gameCategory').on('click', '.gameButtonYear', function(event) {
 			event.preventDefault();
 			let questionAddress = $(this).data().question;
 			let questionObj = eval(questionAddress);
 			$('.questions__text').html(`<h3>${questionObj.question}</h3><p class="question__movieTitle"></p>`)
 			$('.question__movieTitle').text(questionObj.title)
 			quizApp.shuffle(questionObj.allYears);
 			questionObj.allYears.forEach((year) => {
 				$(`.questions__options`).append(`<div class="year_${year}"></div>`)
 				$(`.year_${year}`).append(`<label for="year_${year}">${year}</label>`)
 				$(`.year_${year}`).append(`<input type="radio" id="year_${year}"name="answer" value="${year}">`);
 			});
 			$('.questions').fadeIn('slow');
 		});

 		$('.gameCategory').on('click', '.gameButtonDesc', function(event) {
 			event.preventDefault();
 			let questionAddress = $(this).data().question;
 			let questionObj = eval(questionAddress);
 			$('.questions__text').html(`<h3>${questionObj.question}</h3><p class="question__movieDesc"></p>`)
 			$('.question__movieDesc').text(questionObj.descriptionBlanked)
 			quizApp.shuffle(questionObj.wrongAnswers);
 			questionObj.wrongAnswers.forEach((title, movieTitle) => {
 				$(`.questions__options`).append(`<div class="movieTitle_${movieTitle}"></div>`)
 				$(`.movieTitle_${movieTitle}`).append(`<label for="movieTitle_${movieTitle}">${title}</label>`)
 				$(`.movieTitle_${movieTitle}`).append(`<input type="radio" id="movieTitle_${movieTitle}"name="answer" value="${title}">`);
 			});
 			$('.questions').fadeIn('slow');
 		});

 		$('.gameCategory').on('click', '.gameButtonCast', function(event) {
 			event.preventDefault();
 			let questionAddress = $(this).data().question;
 			let questionObj = eval(questionAddress);
 			$('.questions__text').html(`<h3>${questionObj.question}</h3><p class="question__movieTitle"></p>`)
 			$('.question__movieTitle').text(questionObj.title);
 			quizApp.shuffle(questionObj.allOptions);
 			questionObj.allOptions.forEach((title, movieTitle) => {
 				$(`.questions__options`).append(`<div class="movieTitle_${movieTitle}"></div>`)
 				$(`.movieTitle_${movieTitle}`).append(`<label for="movieTitle_${movieTitle}">${title}</label>`)
 				$(`.movieTitle_${movieTitle}`).append(`<input type="radio" id="movieTitle_${movieTitle}"name="answer" value="${title}">`);
 			});
 			$('.questions').fadeIn('slow');
 		});

 		$('.gameCategory').on('click', '.gameButtonRev', function(event) {
 			event.preventDefault();
 			let questionAddress = $(this).data().question;
 			let questionObj = eval(questionAddress);
 			$('.questions__text').html(`<h3>${questionObj.question}</h3><p class="question__movieTitle"></p>`)
 			$('.question__movieTitle').text(questionObj.year);
 			quizApp.shuffle(questionObj.allOptions);
 			questionObj.allOptions.forEach((title, movieTitle) => {
 				$(`.questions__options`).append(`<div class="movieTitle_${movieTitle}"></div>`)
 				$(`.movieTitle_${movieTitle}`).append(`<label for="movieTitle_${movieTitle}">${title}</label>`)
 				$(`.movieTitle_${movieTitle}`).append(`<input type="radio" id="movieTitle_${movieTitle}"name="answer" value="${title}">`);
 			});
 			$('.questions').fadeIn('slow');
 		});

 		$('.questions').on('submit', 'form', function(event) {
 			event.preventDefault();
 			let currentQuestionObj = eval(quizApp.currentQuestionBtn.data().question);
 			let actualAnswer = currentQuestionObj.answer;
 			let userAnswer = $('.questions input[type=radio]:checked').val();
 			// console.log(actualAnswer, userAnswer, actualAnswer == userAnswer)
 			if (actualAnswer == userAnswer) {
 				quizApp.correctAnswer();
 			} else {
 				quizApp.wrongAnswer();
 			}
 		});

 		$('.questions').on('click', '.questions__giveUp', function(event) {
 			event.preventDefault();
 			quizApp.wrongAnswer();
 		});
 	}

 	quizApp.correctAnswer = function() {
 		$('.questions').fadeOut('slow', function() {
 			$('.questions').html(`<div class="wrapper">
 										<button class="questions__giveUp">Pass</button>
 											<div class="questions__text"> 
 											</div>
 											<!--Radio Buttons-->
 											<form action="submit" id="radioButtonsYear">
 												<div class="questions__options">
 													
 												</div>
 												<input type="submit" class="">
 											</form>
 										</div>`)
 			quizApp.questionsRemaining--;
 			quizApp.endOfGameCheck();
 		});
 		let pointsToGain = quizApp.currentQuestionBtn.text().replace('$', '') * 1;
 		let currentPoints = quizApp.userScore;
 		quizApp.userScore = currentPoints + pointsToGain;
 		$('.main__header__score').text(quizApp.userScore);
 		quizApp.currentQuestionBtn.remove();

 	}

 	quizApp.wrongAnswer = function() {
 		$('.questions').fadeOut('slow', function() {
 			$('.questions').html(`<div class="wrapper">
								<button class="questions__giveUp">Pass</button>
									<div class="questions__text"> 
									</div>
									<!--Radio Buttons-->
									<form action="submit" id="radioButtonsYear">
										<div class="questions__options">
											
										</div>
										<input type="submit" class="">
									</form>
								</div>`)
 			quizApp.questionsRemaining--;
 			quizApp.endOfGameCheck();
 		});
 		let pointsToLose = quizApp.currentQuestionBtn.text().replace('$', '') * 1;
 		let currentPoints = quizApp.userScore;
 		quizApp.userScore = currentPoints - pointsToLose;
 		$('.main__header__score').text(currentPoints - pointsToLose)
 		quizApp.currentQuestionBtn.remove();

 	}

 	quizApp.endOfGameCheck = function() {
 		if (quizApp.questionsRemaining <= 0) {
 			$('.main').fadeOut('slow', function() {
 				if (quizApp.userScore > 0) {
 					$('.yourScoreGoesHere').text('Nice Job! Your final score was ' + quizApp.userScore + '!');
 				} else {
 					$('.yourScoreGoesHere').text('Ouch! Your final score was ' + quizApp.userScore + '!');
 				}
 				let highFound = false;
 				quizApp.highScores.forEach((score, index)=> {
 					if(quizApp.userScore > score.score && highFound === false) {
 						highFound = true;
 						$('.highScoreinput__blerb').text('Your score was higher than the number ' + (index + 1) + ' score of ' + score.score + '! Enter your name and hit submit!')
 						quizApp.userScoreTakeoverNum = index;
 						$('.highScoreinput').fadeIn('slow', function() {
 							
 						});
 					}
 				})

 				$('.scores__fade').fadeIn('slow', function() {

 				});
 			});
 		}
 	}


 	quizApp.removeTitleFromDescription = function(description, title) {
 		let titleWords = title;
 		let newDescription = description;
 		titleWords = titleWords.split(' '); //splits the title into an array of words
 		// console.log(titleWords);
 		titleWords.forEach((word, index) => { //removes non alphanumeric characters from each word (IE Max: becomes Max)

 			titleWords[index] = titleWords[index].replace(/\W/g, '');
 			if (word.toLowerCase() !== 'at' && word.toLowerCase() !== 'of' && word.toLowerCase() !== 'will' && word.toLowerCase() !== 'can' && word.toLowerCase() !== 'or' && word.toLowerCase() !== 'if' && word.toLowerCase() !== 'on' && word.toLowerCase() !== 'to' && word.toLowerCase() !== 'a' && word.toLowerCase() !== 'is' && word.toLowerCase() !== 'and' && word.toLowerCase() !== 'the' && word.toLowerCase() !== 'it' && word.length > 1) {
 				newDescription = newDescription.replace(new RegExp(titleWords[index], 'gi'), '*Blank*');
 			}

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
 		let backupDesc = descriptionObject.origDec;
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
 			origDesc: backupDesc
 		}
 		return questionObject;
 	}

 	quizApp.generateRandomDescQuestion = function() {
 		let movieObject = quizApp.moviedata;
 		let answerMovieIndex = Math.floor(Math.random() * (movieObject.length)) + 1;
 		let randomMovieEntry = movieObject[answerMovieIndex];
 		let cleanDescription = quizApp.removeTitleFromDescription(randomMovieEntry.overview, randomMovieEntry.title)
 		let questionObject = quizApp.questionDescription(cleanDescription);
 		// console.log(questionObject);
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
 			// quizApp.generateFiveRandomRoleQuestion();
 			$.when(...quizApp.revMovieCheckArray).done(() => quizApp.populateGameBoard());
 		});
 	}

 	quizApp.generateCastData = function() {
 		let fiveMovies = quizApp.pickFiveMovies();
 		quizApp.getCastForFiveMovies(fiveMovies);
 		// let roleQuestionMovie = quizApp.pickRoleMovie();
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
 			question: `Which year was ${movieByYearAnswer.title} released?`,
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

 			if (correctAnswer === wrongAnswer) {
 				isUnique = false;
 			}
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

 	quizApp.getRandomYearRevenueMovies = function(year) {
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
 			data.forEach((index) => {
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
 				questionObject.question = 'Which movie made the most money in:'
 				questionObject.answer = yearRevMovies[randomIndex].title;
 				questionObject.answerObject = yearRevMovies[randomIndex];
 				questionObject.year = yearRevMovies[randomIndex].release_date.slice(0, 4) * 1;
 				questionObject.wrongAnswers = wrongAnswers;
 				let allOptions = [...questionObject.wrongAnswers];
 				allOptions.push(questionObject.answer);
 				questionObject.allOptions = allOptions;

 				questionObject.type = 'multipleChoice';
 				revQuestionArray.push(questionObject);
 			})
 		});
 		quizApp.revQuestionArray = revQuestionArray;
 		return revQuestionArray;
 	}


 	// quizApp.pickRoleMovie = function() {
 	// 	let roleMovieArray = [];
 	// 	let movieObject	= quizApp.moviedata
 	// 	let randoNum = Math.floor(Math.random() * (movieObject.length)) + 1;
 	// 	let movieForRoleQ = movieObject[randoNum];
 	// 	roleMovieArray.push(movieForRoleQ);
 	// 	let movieTitle = movieForRoleQ.title; // ERROR - 'title' UNDEFINED
 	// 	// console.log('Movie title =>', movieTitle);
 	// 	let movieId = movieForRoleQ.id;
 	// 	let castObject = quizApp.getCasts(movieId);
 	// 	$.when(castObject).then(function(data) {
 	// 		let roleMovieCast = data.cast;
 	// 		quizApp.generateRoleQuestion(roleMovieCast);
 	// 	});
 	// }

 	// // Which role did (this actor) play in (this movie)?
 	// quizApp.generateRoleQuestion = function(cast) {
 	// 		let roleQuestionObject = {};
 	// 		// console.log('Main Character', cast[0].character);
 	// 		let correctCharacter = cast[0].character; // ERROR - '0' UNDEFINED
 	// 		let correctName = cast[0].name;
 	// 		let wrongCharactersArray = [];
 	// 		let randoArray = [];
 	// 		for (let i = 0; i < 3; i++) {
 	// 			let randoNum = Math.floor(Math.random() * (cast.length - 1)) + 1;
 	// 			randoArray.push(randoNum);
 	// 			let wrongCharacter = cast[randoNum].character; // ERROR - 'character' UNDEFINED
 	// 			// console.log('Wrong character =>', wrongCharacter);
 	// 			wrongCharactersArray.push(wrongCharacter);
 	// 		}
 	// 		// console.log(randoArray);
 	// 		// console.log('Characters Array', wrongCharactersArray);
 	// 		let allCharacters = wrongCharactersArray;
 	// 		allCharacters.push(correctCharacter);
 	// 		// console.log('All Characters', allCharacters);

 	// 		roleQuestionObject.wrongAnswers = wrongCharactersArray;
 	// 		roleQuestionObject.correctAnswer = correctCharacter;
 	// 		roleQuestionObject.allCharacters = allCharacters;
 	// 		roleQuestionObject.question = `What character did this actor play in in this movie?`;
 	// 		roleQuestionObject.type = 'multipleChoice';
 	// 		// console.log(roleQuestionObject);
 	// 		return roleQuestionObject;
 	// }

 	// quizApp.generateFiveRandomRoleQuestion = function(cast) {
 	//  		let roleQuestionArray = [];
 	//  		quizApp.roleQuestionArray = roleQuestionArray;
 	// 		for (var i = 0; i < 4; i++) {
 	// 			// quizApp.roleQuestionArray.push(quizApp.pickRoleMovie());
 	// 			quizApp.roleQuestionArray.push(quizApp.generateRoleQuestion());
 	// 		}
 	// 		console.log('Role Array', quizApp.roleQuestionArray);
 	// 		return quizApp.roleQuestionArray;
 	// }


 	quizApp.populateGameBoard = function() {
 		$('.main__header__score').text('0');
 		quizApp.questionsRemaining = 0;
 		for (var i = 0; i < quizApp.yearQuestionArray.length; i++) {
 			let points = '$' + (100 * (i + 1));
 			let question = `quizApp.yearQuestionArray[${i}]`;
 			$('.main__game__category__year').append(`<li><button class="button${i} gameButton gameButtonYear" data-question="${question}">${points}</button></li>`);
 			quizApp.questionsRemaining++;
 		}
 		for (var i = 0; i < quizApp.descQuestionArray.length; i++) {
 			let points = '$' + (100 * (i + 1));
 			let question = `quizApp.descQuestionArray[${i}]`;
 			$('.main__game__category__desc').append(`<li><button class="button${i} gameButton gameButtonDesc" data-question="${question}">${points}</button></li>`);
 			quizApp.questionsRemaining++;
 		}
 		for (var i = 0; i < quizApp.revQuestionArray.length; i++) {
 			let points = '$' + (100 * (i + 1));
 			let question = `quizApp.revQuestionArray[${i}]`;
 			$('.main__game__category__rev').append(`<li><button class="button${i} gameButton gameButtonRev" data-question="${question}">${points}</button></li>`);
 			quizApp.questionsRemaining++;

 		}
 		for (var i = 0; i < (quizApp.castQuestions.length - 1); i++) {
 			let points = '$' + (100 * (i + 1));
 			let question = `quizApp.castQuestions[${i}]`;
 			$('.main__game__category__cast').append(`<li><button class="button${i} gameButton gameButtonCast" data-question="${question}">${points}</button></li>`);
 			quizApp.questionsRemaining++;
 		}
 		// for (var i = 0; i < (quizApp.roleQuestionArray.length - 1); i++) {
 		// 	let points = '$' + (100 * (i + 1));
 		// 	let question = `quizApp.roleQuestionArray[${i}]`;
 		// 	$('.main__game__category__role').append(`<li><button class="button${i} gameButton gameButtonRole" data-question="${question}">${points}</button></li>`);
 		// }
 	}

 	quizApp.init = function() {
 		quizApp.userScore = 0;
 		quizApp.firebaseInit();
 		quizApp.events();
 	};

 	$(function() {
 		quizApp.init();
 	});