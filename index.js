// Intercept fetch
(function() {
console.log("Injection started");
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await origFetch.apply(this, args);
    const cloned = response.clone();
    cloned.json().then(data => {
      console.log("%c[API][fetch]%c Data:", "color: green; font-weight: bold;", "color: default;", data);
    }).catch(() => {
      cloned.text().then(text => {
        console.log("%c[API][fetch]%c Text:", "color: green; font-weight: bold;", "color: default;", text);
      });
    });
    return response;
  };
})();

// Intercept XMLHttpRequest
(function() {
console.log("Injection started");
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...args) {
    this.addEventListener('load', function() {
      try {
        const contentType = this.getResponseHeader("content-type") || "";
        if (contentType.includes("application/json")) {
          console.log("%c[API][XHR]%c Data:", "color: blue; font-weight: bold;", "color: default;", JSON.parse(this.responseText));
        } else {
          console.log("%c[API][XHR]%c Text:", "color: blue; font-weight: bold;", "color: default;", this.responseText);
        }
      } catch (e) {
        console.log("%c[API][XHR]%c (error parsing):", "color: blue; font-weight: bold;", "color: default;", this.responseText);
      }
    });
    return origOpen.apply(this, args);
  };
})();