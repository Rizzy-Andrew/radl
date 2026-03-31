const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
  const query = searchInput.value.toLowerCase();
  
  const items = document.querySelectorAll("ol li");
  
  items.forEach(function(item) {
    const name = item.textContent.toLowerCase();
    
    if (name.includes(query)) {
      item.style.display = "flex";  // show it
    } else {
      item.style.display = "none";  // hide it
    }
  });
});
