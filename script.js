const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
  const query = searchInput.value.toLowerCase();
  
  const items = document.querySelectorAll("ol li");
  
  items.forEach(function(item) {
    const name = item.textContent.toLowerCase();
    
    if (name.includes(query)) {
      item.style.visibility = "visible";  // show it
      item.style.height = "";             // restore height
    } else {
      item.style.visibility = "hidden";   // hide it but keep space
      item.style.height = "0";            // collapse the space
      item.style.padding = "0";           // collapse padding
      item.style.margin = "0";            // collapse margin
      item.style.border = "none";         // hide border
    }
  });
});
