$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

		$('.inspiration-getter').submit( function(event){
			event.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answers = $('#answer').val();
		topAnswer(answers);
		
	});
});


// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});

};
	
	// this function takes the top-answer object returned by StackOverflow 
	// and creates new result to be appended to DOM
	var showAnswer = function(answer) {
			
			// clone our result template code
			var result = $('.templates .answers').clone();
			
			// Set the question properties in result
			var answerElem = result.find('.name-text');
			answerElem.html(answer.user.display_name);
			// set the date asked property in result
			var profile = result.find('.profile-img');
			profile.html(answer.user.profile_image);

			// set the #views for question property in result
			var viewed = result.find('.reputation');
			viewed.html(answer.user.reputation);

			return result;
		};


	var topAnswer = function(answers){
		var result = $.ajax({
			url: "http://api.stackexchange.com/2.2/tags/" + answers + "/top-answerers/all_time?site=stackoverflow",
			data: answers,
			dataType: "jsonp",
			type: "GET"

		})
		.done(function(result){
				var searchResults = showSearchResults(answers, result.items.length);

						$('.search-results').html(searchResults);

						$.each(result.items, function(i, item) {
							var question = showAnswer(item);
							$('.results').append(question);
						});
					})
		.fail(function(jqXHR, error, errorThrown){
				var errorElem = showError(error);
						$('.search-results').append(errorElem);
					});
	};


