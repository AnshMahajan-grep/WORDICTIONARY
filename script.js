document.addEventListener("DOMContentLoaded", function () {
    displayRecentWord();
    displaybookmarkedWord();
    displayquote();
  });
  
  // Hide loading animation on page load
  $(window).on("load", function () {
    $("#loading_animation").hide();
  });
  
  // Quote API
  async function displayquote() {
    try {
      const response = await fetch("https://type.fit/api/quotes");
      if (!response.ok) throw new Error("Failed to fetch from Type.fit");
  
      const data = await response.json();
      let quote_num = Math.floor(Math.random() * data.length);
      quote.innerHTML = `"${data[quote_num].text}"`;
      author.innerHTML = `~ ${data[quote_num].author || "Unknown"}`;
    } catch (error) {
      console.error("Error fetching Type.fit API:", error);
      // Fallback API
      try {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) throw new Error("Failed to fetch from Quotable.io");
  
        const data = await res.json();
        quote.innerHTML = `"${data.content}"`;
        author.innerHTML = `~ ${data.author}`;
      } catch (fallbackError) {
        quote.innerHTML = `"Failed to fetch quote. Try again later!"`;
        author.innerHTML = `~ System`;
      }
    }
  }
  
  // Search Button Functionality
  search_btn.addEventListener("click", async function () {
    bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark";
    show_result.style.display = "none";
  
    if (search_word.value.trim() === "") {
      var toastLiveExample = document.getElementById("liveToast");
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      return;
    }
  
    fetchWord();
    word_history_section.style.display = "none";
    loading_animation.style.display = "block";
  
    setTimeout(() => {
      loading_animation.style.display = "none";
      word_history_section.style.display = "block";
    }, 990);
    setTimeout(() => {
      show_result.style.display = "block";
    }, 1000);
  
    // Store recent searches
    let recentWord = JSON.parse(localStorage.getItem("recently_searched")) || [];
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`
    );
    const data = await response.json();
  
    let recentObj = {
      title: `${data[0].word}`,
      meaning: `${data[0].meanings[0].definitions[0].definition}`,
    };
  
    recentWord.push(recentObj);
    localStorage.setItem("recently_searched", JSON.stringify(recentWord));
    displayRecentWord();
  });
  
  // Reset Button Functionality
  reset_btn.addEventListener("click", function () {
    search_word.value = "";
    show_result.style.display = "none";
  });
  
  // Fetch Dictionary API
  async function fetchWord() {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`
    );
    const data = await response.json();
  
    if (response.ok) {
      bookmark_icon.style.display = "block";
      card_title.innerHTML = `${data[0].word}`;
      word_meaning.innerHTML = `<b><i>Meaning: </i></b>  ${data[0].meanings[0].definitions[0].definition}`;
      word_example.innerHTML = `<b><i>Example: </i></b>  ${data[0].meanings[0].definitions[0].example || "No example available"}`;
      word_audio_source.src = `${data[0].phonetics[0].audio}`;
      word_pronounciation.innerHTML = `<b><i>Pronunciation:</i></b>  ${data[0].phonetics[0].text || "N/A"}`;
    } else {
      card_title.innerHTML = `${data.title}`;
      word_meaning.innerHTML = `${data.message}`;
      word_example.innerHTML = `${data.resolution || ""}`;
      word_pronounciation.innerHTML = "";
      audio_btn.style.display = "none";
      bookmark_icon.style.display = "none";
    }
  }
  
  // Display Recent Searches with Delete Button
  function displayRecentWord() {
    let recentWord = JSON.parse(localStorage.getItem("recently_searched")) || [];
    let html = "";
  
    recentWord.forEach((element, index) => {
      html += `
        <div class="recent_word my-2 mx-2 card d-flex align-items-center justify-content-between" style="width: 20rem;">
          <div class="card-body">
            <button id="recent_popover" type="button" class="btn" data-bs-toggle="popover" 
            data-bs-trigger="hover focus" data-bs-placement="bottom" title="${element.title}"
            data-bs-content="${element.meaning}"> 
              <h5 class="card-title d-inline">${element.title}</h5>
            </button>
          </div>
          <button class="btn btn-danger btn-sm m-2 delete-btn" onclick="deleteRecentSearch(${index})">&times;</button>
        </div>`;
    });
  
    let recently_searched_element = document.getElementById("recently_searched");
    let recent_search_title = document.getElementById("recent_search_title");
  
    recently_searched_element.innerHTML = recentWord.length ? html : "";
    recent_search_title.style.display = recentWord.length ? "block" : "none";
  }
  
  // Delete Individual Recent Search
  function deleteRecentSearch(index) {
    let recentWord = JSON.parse(localStorage.getItem("recently_searched")) || [];
    recentWord.splice(index, 1);
    localStorage.setItem("recently_searched", JSON.stringify(recentWord));
    displayRecentWord();
  }
//bookmark
let bookmark_icon = document.getElementById("bookmark_icon");

bookmark_icon.addEventListener("click", function () {
  let bookmark_icon_class = bookmark_icon.getElementsByTagName("i")[0].className;
  
  let bookmarked_words = localStorage.getItem("bookmarked_words");
  let bookmarkedObj = bookmarked_words ? JSON.parse(bookmarked_words) : [];

  let bookmark_parent = this.parentElement;
  let wordToBookmark = bookmark_parent.getElementsByTagName("h5")[0].innerHTML;

  if (bookmark_icon_class === "bi bi-bookmark") {
    bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark-check-fill";

    if (!bookmarkedObj.includes(wordToBookmark)) {
      bookmarkedObj.push(wordToBookmark);
      localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
      displaybookmarkedWord();
    }
  } else {
    bookmark_icon.getElementsByTagName("i")[0].className = "bi bi-bookmark";

    let index = bookmarkedObj.indexOf(wordToBookmark);
    if (index !== -1) {
      bookmarkedObj.splice(index, 1);
      localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
      displaybookmarkedWord();
    }
  }
});

function displaybookmarkedWord() {
  let bookmarked_words = localStorage.getItem("bookmarked_words");
  let bookmarkedObj = bookmarked_words ? JSON.parse(bookmarked_words) : [];

  let html = "";
  bookmarkedObj.forEach(function (element, index) {
    html += `<li id=${index}>
                <h4>${element}
                    <button id=${index} type="button" class="btn-close text-reset"
                        aria-label="Close" onclick="delete_bookmarkWord(${index})">
                    </button>
                </h4>
             </li><br>`;
  });

  let bookmarked_words_element = document.getElementById("bookmarked_words_element");
  bookmarked_words_element.innerHTML = bookmarkedObj.length !== 0 ? html : `<h5>No words bookmarked !!</h5>`;
}

function delete_bookmarkWord(index) {
  let bookmarked_words = localStorage.getItem("bookmarked_words");
  let bookmarkedObj = bookmarked_words ? JSON.parse(bookmarked_words) : [];

  if (index >= 0 && index < bookmarkedObj.length) {
    bookmarkedObj.splice(index, 1);
    localStorage.setItem("bookmarked_words", JSON.stringify(bookmarkedObj));
    displaybookmarkedWord();
  }
}

/**
 * Back to top button
 */

//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
