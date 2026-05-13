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
const testimonialList = document.querySelector("[data-testimonial-list]");
const whatsappNumber = "919611840159";
const schedule = window.ADYA_SCHEDULE || [];
const testimonials = window.ADYA_TESTIMONIALS || [];
let currentFilter = "all";
let nextClassName = "Traditional Yoga Class";

const escapeHtml = (value = "") => {
  return value.toString().replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[char];
  });
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "AY";
};

const buildWhatsAppUrl = (details = {}) => {
  const className = details.className || selectedClass?.textContent || "Adya Yoga class";
  const messageParts = ["Namaste Vaishnavi,", `I would like to book: ${className}.`];
  if (details.name) messageParts.push(`Name: ${details.name}`);
  if (details.contact) messageParts.push(`Contact: ${details.contact}`);
  if (details.level) messageParts.push(`Practice level: ${details.level}`);
  if (details.note) messageParts.push(`Note: ${details.note}`);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageParts.join("\n"))}`;
};

const getFormDetails = () => {
  if (!bookingForm) return {};
  const formData = new FormData(bookingForm);
  return {
    className: selectedClass?.textContent || "Adya Yoga class",
    name: formData.get("name")?.toString().trim(),
    contact: formData.get("contact")?.toString().trim(),
    level: formData.get("level")?.toString(),
    note: formData.get("note")?.toString().trim(),
  };
};

const updateContactLinks = () => {
  if (selectedClassInput && selectedClass) selectedClassInput.value = selectedClass.textContent;
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
  if (!nextClass || !nextClassTitle || !nextClassMeta || !nextClassLocation) return;
  nextClassName = nextClass.title;
  nextClassTitle.textContent = nextClass.title;
  nextClassMeta.textContent = `${nextClass.time} - ${nextClass.duration}`;
  nextClassLocation.textContent = `${nextClass.format} - ${nextClass.location}`;
};

const renderSchedule = () => {
  if (!scheduleList) return;
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

const renderTestimonials = () => {
  if (!testimonialList) return;
  const layout = testimonialList.dataset.testimonialLayout || "grid";

  if (!testimonials.length) {
    testimonialList.innerHTML = `
      <article class="rounded-lg border border-forest/15 bg-paper p-7 shadow-[0_18px_50px_rgba(24,54,45,0.08)] md:col-span-2 lg:col-span-3">
        <p class="font-display text-3xl leading-tight text-forest">Student stories will appear here soon.</p>
        <p class="mt-4 max-w-2xl leading-7 text-ink/62">Add testimonials in <span class="font-bold text-forest">testimonials.js</span> with the student's name, text, and an optional photo path.</p>
      </article>
    `;
    return;
  }

  const cardMarkup = testimonials.map((testimonial) => {
    const name = escapeHtml(testimonial.name || "Adya Yoga student");
    const text = escapeHtml(testimonial.text || "");
    const photo = testimonial.photo ? escapeHtml(testimonial.photo) : "";
    const initials = escapeHtml(getInitials(testimonial.name));
    const avatar = photo
      ? `<img class="size-14 rounded-full object-cover" src="${photo}" alt="${name}" loading="lazy" />`
      : `<div class="grid size-14 place-items-center rounded-full bg-amber/30 font-black text-forest">${initials}</div>`;

    return `
      <article class="testimonial-card rounded-lg border border-forest/15 bg-paper p-7 shadow-[0_18px_50px_rgba(24,54,45,0.08)]">
        <div class="flex items-center gap-4">
          ${avatar}
          <div>
            <h3 class="text-lg font-extrabold text-forest">${name}</h3>
            <p class="text-sm font-semibold text-ink/48">Adya Yoga student</p>
          </div>
        </div>
        <p class="testimonial-text mt-6 leading-8 text-ink/66">"${text}"</p>
      </article>
    `;
  });

  testimonialList.innerHTML = layout === "marquee"
    ? [...cardMarkup, ...cardMarkup].join("")
    : cardMarkup.join("");
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 20);
};

const openBooking = (className = "Adya Yoga class") => {
  if (!drawer || !backdrop || !selectedClass) return;
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
  if (!drawer || !backdrop) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.style.overflow = "";
};

window.addEventListener("scroll", setHeaderState);
setHeaderState();
updateNextClass();
renderSchedule();
renderTestimonials();
updateContactLinks();

if (navToggle && nav && header) {
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
}

document.querySelectorAll("[data-open-booking]").forEach((button) => {
  button.addEventListener("click", () => openBooking());
});

document.querySelectorAll("[data-book-class]").forEach((button) => {
  button.addEventListener("click", () => openBooking(button.dataset.bookClass));
});

if (nextClassButton) nextClassButton.addEventListener("click", () => openBooking(nextClassName));

document.querySelector("[data-close-booking]")?.addEventListener("click", closeBooking);
backdrop?.addEventListener("click", closeBooking);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer?.classList.contains("open")) closeBooking();
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

whatsappSubmit?.addEventListener("click", () => {
  if (!bookingForm.reportValidity()) return;
  formStatus.textContent = "Opening WhatsApp with your booking message.";
  window.open(buildWhatsAppUrl(getFormDetails()), "_blank", "noopener");
});

bookingForm?.addEventListener("submit", () => {
  if (selectedClassInput && selectedClass) selectedClassInput.value = selectedClass.textContent;
  if (formStatus) formStatus.textContent = "Sending your request.";
});

bookingForm?.addEventListener("input", updateContactLinks);
bookingForm?.addEventListener("change", updateContactLinks);
