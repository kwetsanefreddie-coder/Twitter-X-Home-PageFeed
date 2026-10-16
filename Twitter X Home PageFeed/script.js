
/* ==========================================
   Twitter/X Home Page - Base Functionality
   ========================================== */

// Select HTML elements
const tweetInput = document.getElementById("tweetInput");
const tweetButton = document.getElementById("tweetButton");
const tweetFeed = document.getElementById("tweetFeed");
const characterCount = document.getElementById("characterCount");
const sidebarPostButton = document.getElementById("sidebarPostButton");

const MAX_CHARACTERS = 280;

// Track followed accounts and the selected tab
const followedAccounts = new Set();
let activeTab = "For you";

// ==========================================
// Character Counter
// ==========================================

tweetInput.addEventListener("input", function () {
    characterCount.textContent =
        `${tweetInput.value.length} / ${MAX_CHARACTERS}`;
});

// ==========================================
// Create a Tweet
// ==========================================

function createTweet(message) {
    const tweet = document.createElement("article");
    tweet.className = "tweet";
    tweet.dataset.author = "freddie";
    tweet.dataset.tweetId = crypto.randomUUID();
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = "FK";

    const content = document.createElement("div");
    content.className = "tweet-content";

    const author = document.createElement("div");
    author.className = "tweet-author";

    const name = document.createElement("strong");
    name.textContent = "Freddie Kwetsane";

    const handle = document.createElement("span");
    handle.textContent = "@freddie · now";

    author.append(name, handle);

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    const actions = document.createElement("div");
    actions.className = "tweet-actions";

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.textContent = "♡ Like";

    const replyButton = document.createElement("button");
    replyButton.type = "button";
    replyButton.textContent = "↩ Reply";

    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.textContent = "↗ Share";

    actions.append(likeButton, replyButton, shareButton);
    content.append(author, paragraph, actions);
    tweet.append(avatar, content);

    return tweet;
}

// ==========================================
// Publish a Tweet
// ==========================================

function isValidTweet(message) {
    if (message.length === 0) {
        alert("Please write something before posting.");
        return false;
    }

    if (message.length > MAX_CHARACTERS) {
        alert("Your post exceeds 280 characters.");
        return false;
    }

    return true;
}

function addTweetToFeed(message) {
    const tweet = createTweet(message);
    tweetFeed.prepend(tweet);
    showFeed("For you");
}

function publishTweet() {
    const message = tweetInput.value.trim();

    if (!isValidTweet(message)) {
        return;
    }

    addTweetToFeed(message);

    // Clear the composer
    tweetInput.value = "";
    characterCount.textContent = `0 / ${MAX_CHARACTERS}`;
}

tweetButton.addEventListener("click", publishTweet);

// ==========================================
// Like, Reply and Share
// ==========================================

document.addEventListener("click", async function (event) {
    const button = event.target.closest("button");
if (!event.target.closest("#tweetFeed, #exploreResults")) {
    return;
}
    if (!button) {
        return;
    }

    const tweet = button.closest(".tweet");

    if (!tweet) {
        return;
    }

const originalTweet = tweet.closest("#exploreResults")
    ? Array.from(tweetFeed.querySelectorAll(".tweet")).find(
        item => item.dataset.tweetId === tweet.dataset.tweetId
      )
    : tweet;

if (!originalTweet) {
    return;
}

    // Like / Unlike
    if (
        button.textContent.includes("Like") ||
        button.textContent.includes("Liked")
    ) {
        
const originalLikeButton =
    originalTweet.querySelector(".tweet-actions button");

const liked = originalLikeButton.dataset.liked === "true";
const newLikedState = !liked;

originalLikeButton.dataset.liked = String(newLikedState);
originalLikeButton.textContent = newLikedState ? "♥ Liked" : "♡ Like";
originalLikeButton.style.color = newLikedState ? "#f91880" : "";

if (tweet !== originalTweet) {
    button.dataset.liked = String(newLikedState);
    button.textContent = originalLikeButton.textContent;
    button.style.color = originalLikeButton.style.color;
}

return;

    }

    // Reply to a post
    if (button.textContent.includes("Reply")) {
        const reply = prompt("Write your reply:");

        if (!reply || !reply.trim()) {
            return;
        }

        const replyText = reply.trim();

        if (replyText.length > MAX_CHARACTERS) {
            alert("Your reply exceeds 280 characters.");
            return;
        }

        
const replyElement = document.createElement("p");
replyElement.className = "tweet-reply";
replyElement.textContent = `↳ You replied: ${replyText}`;

// Always save the reply to the original Home tweet.
originalTweet.querySelector(".tweet-content")
    .appendChild(replyElement);

// Also display the reply immediately in Explore.
if (tweet !== originalTweet) {
    tweet.querySelector(".tweet-content")
        .appendChild(replyElement.cloneNode(true));
}


        return;
    }

    // Share a post
    if (button.textContent.includes("Share")) {
        const postText = tweet.querySelector(".tweet-content p").textContent;
        const shareText = `${postText}\n\n${window.location.href}`;

        try {
            await navigator.clipboard.writeText(shareText);
            alert("Post content and page link copied!");
        } catch (error) {
            alert("Unable to copy automatically. Please try again.");
        }
    }
});

// ==========================================
// Follow / Unfollow
// ==========================================

document.querySelectorAll(".follow-suggestion")
    .forEach(function (suggestion) {
        const button = suggestion.querySelector("button");
        const handle = suggestion.querySelector("small").textContent;

        button.addEventListener("click", function () {
            if (followedAccounts.has(handle)) {
                followedAccounts.delete(handle);
                button.textContent = "Follow";
            } else {
                followedAccounts.add(handle);
                button.textContent = "Following";
            }

            if (activeTab === "Following") {
                showFeed("Following");
            }
        });
    });

// ==========================================
// Timeline Tabs
// ==========================================

function showFeed(tabName) {
    activeTab = tabName;

    document.querySelectorAll(".feed-tab")
        .forEach(function (tab) {
            tab.classList.toggle(
                "active",
                tab.textContent.trim() === tabName
            );
        });

    const tweets = tweetFeed.querySelectorAll(".tweet");

    tweets.forEach(function (tweet) {
        if (tabName === "For you") {
            tweet.hidden = false;
            return;
        }

        // Simplified Following feed for the base demo
        tweet.hidden = tweet.dataset.author !== "freddie";
    });
}

document.querySelectorAll(".feed-tab")
    .forEach(function (tab) {
        tab.addEventListener("click", function () {
            showFeed(tab.textContent.trim());
        });
    });

// ==========================================
// Sidebar Navigation
// ==========================================

document.querySelectorAll(".nav-link")
    .forEach(function (link) {
        link.addEventListener("click", function (event) {
            const destination = link.getAttribute("href");
            
if (destination === "#explore") {
    event.preventDefault();
    switchPage("explore");
    return;
}

if (destination === "#home") {
    event.preventDefault();
    switchPage("home");
    showFeed("For you");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
}

            if (destination === "#home") {
                showFeed("For you");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            } else {
                event.preventDefault();

                const pageName = link.textContent.trim();

                alert(
                    `${pageName} is not available in the base homepage yet.`
                );

                return;
            }

            document.querySelectorAll(".nav-link")
                .forEach(function (item) {
                    item.classList.remove("active");
                });

            link.classList.add("active");
        });
    });

// ==========================================
// Initial Setup
// ==========================================

showFeed("For you");


/* ==========================================
   DARK / LIGHT MODE FUNCTIONALITY
========================================== */

const themeToggle = document.getElementById("themeToggle");

// Restore previously selected theme
const savedTheme = localStorage.getItem("twitterTheme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "Dark Mode";
} else {
    themeToggle.textContent = "Light Mode";
}

// Switch between dark and light mode
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeToggle.textContent = "Dark Mode";
        localStorage.setItem("twitterTheme", "light");

    } else {

        themeToggle.textContent = "Light Mode";
        localStorage.setItem("twitterTheme", "dark");

    }

});

/* ==========================================
   TWEET COMPOSITION MODAL
========================================== */

const composeModalOverlay = document.getElementById("composeModalOverlay");
const composeModal = document.getElementById("composeModal");
const composeModalClose = document.getElementById("composeModalClose");
const modalTweetInput = document.getElementById("modalTweetInput");
const modalCharacterCount = document.getElementById("modalCharacterCount");
const modalPostButton = document.getElementById("modalPostButton");

let lastFocusedBeforeModal = null;

function getModalFocusableElements() {
    return Array.from(
        composeModal.querySelectorAll(
            'button:not([disabled]), [href], textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
    ).filter(function (element) {
        return !element.hasAttribute("hidden");
    });
}

function updateModalComposerState() {
    if (modalTweetInput.value.length > MAX_CHARACTERS) {
        modalTweetInput.value = modalTweetInput.value.slice(0, MAX_CHARACTERS);
    }

    const length = modalTweetInput.value.length;
    const hasText = modalTweetInput.value.trim().length > 0;

    modalCharacterCount.textContent = `${length} / ${MAX_CHARACTERS}`;
    modalPostButton.disabled = !hasText;
}

function openComposeModal() {
    lastFocusedBeforeModal = document.activeElement;
    composeModalOverlay.hidden = false;
    composeModalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("compose-modal-open");
    updateModalComposerState();
    modalTweetInput.focus();
}

function closeComposeModal() {
    composeModalOverlay.hidden = true;
    composeModalOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("compose-modal-open");
    modalTweetInput.value = "";
    updateModalComposerState();

    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
        lastFocusedBeforeModal.focus();
    } else {
        sidebarPostButton.focus();
    }
}

function publishModalTweet() {
    const message = modalTweetInput.value.trim();

    if (!isValidTweet(message)) {
        return;
    }

    addTweetToFeed(message);
    closeComposeModal();
}

sidebarPostButton.addEventListener("click", openComposeModal);
document.getElementById("mobilePostButton").addEventListener("click", openComposeModal);

composeModalClose.addEventListener("click", closeComposeModal);
modalPostButton.addEventListener("click", publishModalTweet);
modalTweetInput.addEventListener("input", updateModalComposerState);

composeModalOverlay.addEventListener("click", function (event) {
    if (event.target === composeModalOverlay) {
        closeComposeModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (composeModalOverlay.hidden) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closeComposeModal();
        return;
    }

    if (event.key !== "Tab") {
        return;
    }

    const focusableElements = getModalFocusableElements();

    if (focusableElements.length === 0) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});

/* ==========================================
   EXPLORE PAGE NAVIGATION
========================================== */

const homePage = document.getElementById("home");
const explorePage = document.getElementById("explorePage");
const exploreLink = document.querySelector('.nav-link[href="#explore"]');
const homeLink = document.querySelector('.nav-link[href="#home"]');

function switchPage(page) {
    const showingExplore = page === "explore";

    homePage.hidden = showingExplore;
    explorePage.hidden = !showingExplore;

    homeLink.classList.toggle("active", !showingExplore);
    exploreLink.classList.toggle("active", showingExplore);

    if (showingExplore) {
        document.getElementById("exploreSearchInput").focus();
    }
}

/* ==========================================
   EXPLORE SEARCH FUNCTIONALITY
========================================== */

const exploreSearchInput = document.getElementById("exploreSearchInput");
const exploreResults = document.getElementById("exploreResults");
const exploreNoResults = document.getElementById("exploreNoResults");

function searchExploreTweets() {
    const searchTerm = exploreSearchInput.value.trim().toLowerCase();
    const tweets = document.querySelectorAll("#tweetFeed .tweet");

    exploreResults.replaceChildren();

    let matchCount = 0;

    tweets.forEach(function (tweet) {
        const tweetText = tweet.textContent.toLowerCase();

        if (searchTerm === "" || tweetText.includes(searchTerm)) {
            const result = tweet.cloneNode(true);

            // Remove duplicate IDs, if any, from cloned content.
            result.querySelectorAll("[id]").forEach(function (element) {
                element.removeAttribute("id");
            });

            exploreResults.appendChild(result);
            matchCount++;
        }
    });

    exploreNoResults.hidden = matchCount !== 0;
}

exploreSearchInput.addEventListener("input", searchExploreTweets);
exploreLink.addEventListener("click", searchExploreTweets);


