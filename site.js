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
const scheduleList = document.querySelector("[data-schedule-list]");
const nextClassTitle = document.querySelector("[data-next-class-title]");
const nextClassMeta = document.querySelector("[data-next-class-meta]");
const nextClassLocation = document.querySelector("[data-next-class-location]");
const nextClassButton = document.querySelector("[data-book-next-class]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const practiceCards = document.querySelectorAll(".practice-card");
const whatsappNumber = "917090855044";
const schedule = window.ADYA_SCHEDULE || [];
let currentFilter = "all";
let nextClassName = "Traditional Yoga Class";

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

const getNextClass = () => {
  if (!schedule.length) return null;
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  return schedule.find((item) => item.startHour > currentHour) || schedule[0];
};

const updateNextClass = () => {
  const nextClass = getNextClass();
  if (!nextClass) return;
  nextClassName = nextClass.title;
  nextClassTitle.textContent = nextClass.title;
  nextClassMeta.textContent = `${nextClass.time} - ${nextClass.duration}`;
  nextClassLocation.textContent = `${nextClass.format} - ${nextClass.location}`;
};

const renderSchedule = () => {
  const visibleSchedule = schedule.filter((item) => {
    return currentFilter === "all" || item.period === currentFilter || item.mode === currentFilter;
  });

  scheduleList.innerHTML = visibleSchedule.map((item) => {
    const modeLabel = item.mode === "offline" ? "In Person" : "Online";
    const modeTagClass = item.mode === "offline"
      ? "bg-amber/20 text-[#6f5218] border-amber/35"
      : "bg-sage/15 text-forest border-sage/30";
    return `
      <article class="class-row grid gap-4 py-6 md:grid-cols-[150px_minmax(0,1fr)_150px] md:items-center md:gap-5" data-tags="${item.period} ${item.mode}">
        <time class="font-black text-clay">${item.time}</time>
        <div>
          <h3 class="text-xl font-extrabold text-forest">${item.title}</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="schedule-tag rounded-full border px-3 py-1 text-xs font-black uppercase ${item.mode === "offline" ? "schedule-tag-offline" : "schedule-tag-online"}">${modeLabel}</span>
            <span class="rounded-full border border-forest/15 bg-ivory px-3 py-1 text-xs font-black uppercase text-forest">${item.format}</span>
            <span class="rounded-full border border-forest/15 bg-ivory px-3 py-1 text-xs font-black uppercase text-forest">${item.duration}</span>
          </div>
          <p class="mt-1 text-sm text-ink/56">${item.location}</p>
          <p class="mt-2 leading-7 text-ink/62">${item.description}</p>
        </div>
        <div class="flex md:justify-end">
          <button class="w-fit rounded-full bg-forest px-5 py-3 font-extrabold text-paper transition hover:-translate-y-0.5" type="button" data-book-class="${item.title} (${item.time})">Book</button>
        </div>
      </article>
    `;
  }).join("");

  scheduleList.querySelectorAll("[data-book-class]").forEach((button) => {
    button.addEventListener("click", () => openBooking(button.dataset.bookClass));
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
updateNextClass();
renderSchedule();
updateContactLinks();

practiceCards.forEach((card) => {
  const toggle = card.querySelector(".practice-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    practiceCards.forEach((item) => {
      if (item !== card) item.classList.remove("expanded");
    });
    card.classList.toggle("expanded");
  });
});

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

nextClassButton.addEventListener("click", () => openBooking(nextClassName));

document.querySelector("[data-close-booking]").addEventListener("click", closeBooking);
backdrop.addEventListener("click", closeBooking);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("open")) closeBooking();
});

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    currentFilter = filter.dataset.filter;
    filters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    renderSchedule();
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
