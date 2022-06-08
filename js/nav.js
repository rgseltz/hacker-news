'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage();
	// $storyForm.hide();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

function navNewStoryForm(evt) {
	console.log('navNewStoryForm', evt);
	hidePageComponents();
	$storyForm.show();
}

$navSubmitStory.on('click', navNewStoryForm);

function navFavorites(evt) {
	console.log('navFavorites', evt);
	addFavorites();
	hidePageComponents();
	$favStoriesList.show();
}

$navFavorites.on('click', navFavorites);

function navMyStories(evt) {
	console.log('navMyStories', evt);
	addOwnStories();
	hidePageComponents();
	$myStoriesList.show();
}

$navMyStories.on('click', navMyStories);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}
