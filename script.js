const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const drawer = document.querySelector("[data-booking-drawer]");
const backdrop = document.querySelector("[data-booking-backdrop]");
const selectedClass = document.querySelector("[data-selected-class]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const filters = document.querySelectorAll("[data-filter]");
const classRows = document.querySelectorAll(".class-row");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const openBooking = (className = "Adya Yoga class") => {
  selectedClass.textContent = className;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  const firstInput = drawer.querySelector("input");
  window.setTimeout(() => firstInput.focus(), 160);
};

const closeBooking = () => {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.style.overflow = "";
};

window.addEventListener("scroll", setHeaderState);
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  header.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    header.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll("[data-open-booking]").forEach((button) => {
  button.addEventListener("click", () => openBooking());
});

document.querySelectorAll("[data-book-class]").forEach((button) => {
  button.addEventListener("click", () => openBooking(button.dataset.bookClass));
});

document.querySelector("[data-close-booking]").addEventListener("click", closeBooking);
backdrop.addEventListener("click", closeBooking);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("open")) {
    closeBooking();
  }
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const value = filter.dataset.filter;
    filters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    classRows.forEach((row) => {
      const shouldShow = value === "all" || row.dataset.tags.includes(value);
      row.classList.toggle("hidden", !shouldShow);
    });
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const name = formData.get("name").toString().trim();
  formStatus.textContent = `Thank you, ${name || "friend"}. This request is ready to send via WhatsApp or email.`;
  bookingForm.reset();
});
