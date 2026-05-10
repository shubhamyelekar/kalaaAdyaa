const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const drawer = document.querySelector("[data-booking-drawer]");
const backdrop = document.querySelector("[data-booking-backdrop]");
const selectedClass = document.querySelector("[data-selected-class]");
const selectedClassInput = document.querySelector("[data-selected-class-input]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const whatsappSubmit = document.querySelector("[data-whatsapp-submit]");
const filters = document.querySelectorAll("[data-filter]");
const classRows = document.querySelectorAll(".class-row");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const whatsappNumber = "917090855044";

const buildWhatsAppUrl = (details = {}) => {
  const className = details.className || selectedClass.textContent || "Adya Yoga class";
  const messageParts = ["Namaste Vaishnavi,", `I would like to book: ${className}.`];
  if (details.name) messageParts.push(`Name: ${details.name}`);
  if (details.contact) messageParts.push(`Contact: ${details.contact}`);
  if (details.level) messageParts.push(`Practice level: ${details.level}`);
  if (details.note) messageParts.push(`Note: ${details.note}`);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageParts.join("\n"))}`;
};

const getFormDetails = () => {
  const formData = new FormData(bookingForm);
  return {
    className: selectedClass.textContent,
    name: formData.get("name")?.toString().trim(),
    contact: formData.get("contact")?.toString().trim(),
    level: formData.get("level")?.toString(),
    note: formData.get("note")?.toString().trim(),
  };
};

const updateContactLinks = () => {
  selectedClassInput.value = selectedClass.textContent;
  whatsappLinks.forEach((link) => {
    const details = link.dataset.whatsappSource === "drawer" ? getFormDetails() : {};
    link.href = buildWhatsAppUrl(details);
  });
};

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const openBooking = (className = "Adya Yoga class") => {
  selectedClass.textContent = className;
  updateContactLinks();
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.style.overflow = "hidden";
  const firstInput = drawer.querySelector("input:not([type='hidden'])");
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
updateContactLinks();

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
  if (event.key === "Escape" && drawer.classList.contains("open")) closeBooking();
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
      row.classList.toggle("hidden", !(value === "all" || row.dataset.tags.includes(value)));
    });
  });
});

whatsappSubmit.addEventListener("click", () => {
  if (!bookingForm.reportValidity()) return;
  formStatus.textContent = "Opening WhatsApp with your booking message.";
  window.open(buildWhatsAppUrl(getFormDetails()), "_blank", "noopener");
});

bookingForm.addEventListener("submit", () => {
  selectedClassInput.value = selectedClass.textContent;
  formStatus.textContent = "Sending form request in a new tab.";
});

bookingForm.addEventListener("input", updateContactLinks);
bookingForm.addEventListener("change", updateContactLinks);
