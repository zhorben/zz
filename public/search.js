window.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');

  let timeoutId

  searchInput.oninput = function (evt) {
    const { value } = evt.target

    if (value.length < 2) {
      return
    }
    
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      fetch(`/search?query=${value}&gender=men`, {
        method: "GET"
      })
    }, 100)
  }





  // form.onsubmit = function(event) {
  //   event.preventDefault();

  //   fetch("/login", {
  //     method: "POST",
  //     credentials: "include", // "omit" by default, for cookies to work
  //     body: new FormData(this)
  //   })
  //   .then(response => response.json())
  //   .then(response => {
  //     if (response.error) {
  //       alert(response.error.message);
  //     } else if (response.user) {
  //       alert("Welcome, " + response.user.displayName);
  //       window.location.reload(true);
  //     } else {
  //       throw new Error("Invalid response from the server");
  //     }
  //   })
  //   .catch(function(err) {
  //     alert("Error: " + err.message);
  //   });
  // }

});
