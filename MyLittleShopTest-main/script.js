const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".contact"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

// Toggle sidebar
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

// Check if dark mode was previously enabled
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark");
  modeText.innerText = "الوضع المضيء";
}

// Toggle dark/light mode
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  if(body.classList.contains("dark")){
    modeText.innerText = "الوضع المضيء";
    localStorage.setItem("darkMode", "enabled");
  } else {
    modeText.innerText = "الوضع المظلم";
    localStorage.setItem("darkMode", "disabled");
  }
});

// Close sidebar automatically on small screens
function handleResize() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add("close");
  }
}

// Initial check
handleResize();

// Listen for window resize
window.addEventListener("resize", handleResize);

// Image gallery functionality
const shoes = [
  { id: 1, image: "Images/FRONT.PNG" },
  { id: 2, image: "Images/BACK.PNG" },
  { id: 3, image: "Images/SIDE.PNG" },
  { id: 4, image: "Images/CLOSE.png" }
];

const mainImage = document.querySelector('.shoe-image');
const icons = document.querySelectorAll('.SectionIcon');

function updateImage(shoeId) {
  const selectedShoe = shoes.find(shoe => shoe.id === shoeId);
  mainImage.src = selectedShoe.image;

  // Remove active class from all icons
  icons.forEach(icon => icon.classList.remove('active'));

  // Add active class to current icon
  document.querySelector(`[data-shoe="${shoeId}"]`).classList.add('active');
}

icons.forEach(icon => {
  icon.addEventListener('click', () => {
      const shoeId = parseInt(icon.getAttribute('data-shoe'));
      updateImage(shoeId);
  });
});

// Initial load
updateImage(1);