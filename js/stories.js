'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;
let whiteStar = 'https://cdn3.iconfinder.com/data/icons/sympletts-free-sampler/128/star-512.png';
let blackStar =
	'https://icons-for-free.com/iconfiles/png/512/favourite+like+rating+special+star+icon-1320086047224423788.png';
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);
	console.log(story);
	const hostName = story.getHostName();
	if (currentUser) {
		const found = currentUser.favorites.find((favoriteStory) => favoriteStory.storyId === story.storyId);
		//find an image with a star and add <img> inside of this li online bring it down 25% width and height and put it in the href
		if (found) {
			return $(`
      <li>
        <img id="${story.storyId}" data-favorite-status="yes"
        src="${blackStar}" width=10 height=10></img>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
		} else {
			//find an image with an empty star and add <img> inside of this li online bring it down 25% width and height and put it in the href
			return $(`
    <li>
      <img id="${story.storyId}" data-favorite-status="no"
      src="${whiteStar}" width=10 height=10></img>
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
		}
	} else {
		return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
	}
}

function generateOwnStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	return $(`
		<li>
		<img id="${story.storyId}" data-favorite-status="yes"
        src="https://cdn2.vectorstock.com/i/1000x1000/01/71/trash-can-icon-vector-13490171.jpg" width=10 height=10></img>
		  <a href="${story.url}" target="a_blank" class="story-link">
			${story.title}
		  </a>
		  <small class="story-hostname">(${hostName})</small>
		  <small class="story-author">by ${story.author}</small>
		  <small class="story-user">posted by ${story.username}</small>
		</li>
	  `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}

// let newStory = await storyList.addStory(currentUser,
//   { title: "Test", author: "Me", url: "https://google.com" });
$storyForm.on('submit', async function(evt) {
	evt.preventDefault();
	console.log('upload story');
	const author = $('#story-author').val();
	const url = $('#story-url').val();
	const title = $('#story-title').val();
	console.log(author, url, title);
	let newStory = await storyList.addStory(currentUser, { title, author, url });
	console.log(newStory);
	putStoriesOnPage();
	$allStoriesList.prepend($story);
});

$allStoriesList.on('click', 'li', async function(evt) {
	evt.preventDefault();
	let favStories;
	console.log(evt.target);
	if (evt.target.tagName !== 'IMG') {
		return;
	} else {
		if (evt.target.getAttribute('src') === whiteStar) {
			favStories = await User.addStoryFavorite(currentUser, evt.target.id, 'post');
			evt.target.setAttribute('src', blackStar);
			console.log(favStories.user.favorites);
		} else {
			favStories = await User.addStoryFavorite(currentUser, evt.target.id, 'delete');
			evt.target.setAttribute('src', whiteStar);
		}
		currentUser.favorites = favStories.user.favorites.map((story) => new Story(story));
	}
});

function addFavorites() {
	console.debug('showFavorites');
	$favStoriesList.empty();

	// loop through all favorite stories and generate HTML for them
	for (let story of currentUser.favorites) {
		const $story = generateStoryMarkup(story);
		$favStoriesList.append($story);
	}

	$favStoriesList.show();
}

function addOwnStories() {
	console.debug('addOwnStories');
	$myStoriesList.empty();

	// loop through all favorite stories and generate HTML for them
	for (let story of currentUser.ownStories) {
		const $story = generateOwnStoryMarkup(story);
		$myStoriesList.append($story);
	}

	$myStoriesList.show();
}

$myStoriesList.on('click', 'img', async function(evt) {
	await StoryList.deleteStory(currentUser, evt.target.id);
});
// addFavorites();
// addOwnStories();
