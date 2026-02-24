// Data model and storage
const STORAGE_KEY = "lf-items";

/** @typedef {{
 * id: string;
 * status: "lost" | "found";
 * title: string;
 * category: string;
 * description: string;
 * date: string;
 * location: string;
 * contactName: string;
 * contactEmail?: string;
 * contactPhone?: string;
 * imageUrl?: string;
 * }} Item
 */

/** @type {Item[]} */
let items = [];

const seedItems = [
  {
    id: "1",
    status: "lost",
    title: "Black Wallet",
    category: "Accessories",
    description: "Slim black leather wallet with several cards and an ID inside.",
    date: "2026-01-15",
    location: "Main Library Entrance",
    contactName: "Aisha Khan",
    contactEmail: "aisha@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "2",
    status: "found",
    title: "Campus ID Card",
    category: "Documents",
    description: "Student ID card with the name partially visible. Found near cafeteria.",
    date: "2026-01-18",
    location: "Central Cafeteria",
    contactName: "Mohit Verma",
    contactEmail: "",
    contactPhone: "+91 98765 43210",
    imageUrl: "",
  },
  {
    id: "3",
    status: "lost",
    title: "Silver Laptop",
    category: "Electronics",
    description: "13-inch silver laptop in a black sleeve, may have stickers on the lid.",
    date: "2026-01-20",
    location: "Computer Lab 2",
    contactName: "Riya Sharma",
    contactEmail: "riya@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "4",
    status: "found",
    title: "Keychain with Multiple Keys",
    category: "Keys",
    description: "Metal keychain with three keys and a small torch.",
    date: "2026-01-19",
    location: "Parking Area B",
    contactName: "Arjun Patel",
    contactEmail: "arjun@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "5",
    status: "lost",
    title: "Black Hoodie",
    category: "Clothing",
    description: "Plain black hoodie, medium size, no visible logo.",
    date: "2026-01-12",
    location: "Gym Changing Room",
    contactName: "Neha Singh",
    contactEmail: "",
    contactPhone: "+91 91234 56789",
    imageUrl: "",
  },
  {
    id: "6",
    status: "found",
    title: "Earbuds Case",
    category: "Electronics",
    description: "Small wireless earbuds case, black, without earbuds inside.",
    date: "2026-01-10",
    location: "Bus Stop Near Gate 1",
    contactName: "Karan Gupta",
    contactEmail: "karan@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "7",
    status: "lost",
    title: "Notebook with Graph Paper",
    category: "Documents",
    description: "Spiral notebook filled with engineering notes and diagrams.",
    date: "2026-01-09",
    location: "Lecture Hall A3",
    contactName: "Simran Kaur",
    contactEmail: "simran@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "8",
    status: "found",
    title: "Sports Water Bottle",
    category: "Accessories",
    description: "Black and white bottle, reusable, left near the basketball court.",
    date: "2026-01-14",
    location: "Sports Complex",
    contactName: "Dev Mishra",
    contactEmail: "",
    contactPhone: "+91 96543 21098",
    imageUrl: "",
  },
  {
    id: "9",
    status: "lost",
    title: "Scientific Calculator",
    category: "Electronics",
    description: "Standard black scientific calculator with worn-out buttons.",
    date: "2026-01-11",
    location: "Exam Hall C",
    contactName: "Rahul Mehta",
    contactEmail: "rahul@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "10",
    status: "found",
    title: "Black Backpack",
    category: "Accessories",
    description: "Medium-sized backpack with notebooks and pens inside.",
    date: "2026-01-16",
    location: "Canteen Seating Area",
    contactName: "Priya Das",
    contactEmail: "priya@example.com",
    contactPhone: "",
    imageUrl: "",
  },
  {
    id: "11",
    status: "lost",
    title: "Ring with Simple Band",
    category: "Accessories",
    description: "Plain metallic ring, sentimental value.",
    date: "2026-01-08",
    location: "Garden Benches",
    contactName: "Ankit Rao",
    contactEmail: "",
    contactPhone: "+91 99887 66554",
    imageUrl: "",
  },
];

function loadItems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      items = seedItems;
      return;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      items = parsed;
    } else {
      items = seedItems;
    }
  } catch {
    items = seedItems;
  }
}

function saveItems() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

// Routing
const pages = {
  home: document.getElementById("page-home"),
  items: document.getElementById("page-items"),
  report: document.getElementById("page-report"),
  about: document.getElementById("page-about"),
};

const navLinks = Array.from(document.querySelectorAll(".lf-nav-link"));

function showPage(name) {
  Object.entries(pages).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle("is-visible", key === name);
  });
  navLinks.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.route === name);
  });
}

function handleRouteClick(evt) {
  const target = evt.target.closest("[data-route]");
  if (!target) return;
  evt.preventDefault();
  const route = target.dataset.route;
  const reportType = target.dataset.reportType;
  if (route) {
    showPage(route);
    if (route === "report" && reportType) {
      setReportType(reportType);
    }
  }
}

document.body.addEventListener("click", handleRouteClick);

// Items rendering and filtering
const itemsGrid = document.getElementById("items-grid");
const itemsEmpty = document.getElementById("items-empty");
const clearSearchBtn = document.getElementById("clear-search");
const searchInput = document.getElementById("search-query");
const filterCategory = document.getElementById("filter-category");
const filterStatus = document.getElementById("filter-status");
const filterFromDate = document.getElementById("filter-from-date");
const filterToDate = document.getElementById("filter-to-date");

function uniqueCategories() {
  const set = new Set(items.map((i) => i.category).filter(Boolean));
  return Array.from(set).sort();
}

function populateCategoryFilter() {
  if (!filterCategory) return;
  const existing = new Set(
    Array.from(filterCategory.options).map((o) => o.value)
  );
  uniqueCategories().forEach((cat) => {
    if (!existing.has(cat)) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      filterCategory.appendChild(opt);
    }
  });
}

function matchesFilters(item) {
  const query = (searchInput?.value || "").trim().toLowerCase();
  const statusFilter = filterStatus?.value || "";
  const categoryFilter = filterCategory?.value || "";
  const from = filterFromDate?.value || "";
  const to = filterToDate?.value || "";

  if (query) {
    const haystack = (
      item.title +
      " " +
      item.category +
      " " +
      item.description +
      " " +
      item.location
    ).toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  if (statusFilter && item.status !== statusFilter) {
    return false;
  }

  if (categoryFilter && item.category !== categoryFilter) {
    return false;
  }

  if (from && item.date < from) {
    return false;
  }

  if (to && item.date > to) {
    return false;
  }

  return true;
}

function maskContact(item) {
  if (item.contactEmail) {
    const [name, domain] = item.contactEmail.split("@");
    if (!domain) return item.contactEmail;
    const visible = name.slice(0, 2);
    return `${visible}***@${domain}`;
  }
  if (item.contactPhone) {
    const trimmed = item.contactPhone.replace(/\s+/g, "");
    if (trimmed.length <= 4) return item.contactPhone;
    return "****" + trimmed.slice(-4);
  }
  return "Not provided";
}

function renderItems() {
  if (!itemsGrid || !itemsEmpty) return;
  itemsGrid.innerHTML = "";

  const filtered = items.filter(matchesFilters);

  if (!filtered.length) {
    itemsEmpty.hidden = false;
    return;
  }

  itemsEmpty.hidden = true;

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "lf-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.itemId = item.id;

    const header = document.createElement("div");
    header.className = "lf-card-header";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const badge = document.createElement("span");
    badge.className = "lf-badge";
    badge.textContent = item.status === "lost" ? "Lost" : "Found";

    header.appendChild(title);
    header.appendChild(badge);

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "lf-card-image";
    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;
      imageWrapper.appendChild(img);
    } else {
      imageWrapper.textContent = "No image";
    }

    const meta = document.createElement("div");
    meta.className = "lf-card-meta";
    meta.innerHTML = `
      <div><strong>Category:</strong> ${item.category}</div>
      <div><strong>Date:</strong> ${item.date}</div>
      <div><strong>Location:</strong> ${item.location}</div>
    `;

    const footer = document.createElement("div");
    footer.className = "lf-card-footer";
    const contact = document.createElement("span");
    contact.textContent = `Contact: ${maskContact(item)}`;
    const detailHint = document.createElement("span");
    detailHint.textContent = "View details";
    footer.appendChild(contact);
    footer.appendChild(detailHint);

    card.appendChild(header);
    card.appendChild(imageWrapper);
    card.appendChild(meta);
    card.appendChild(footer);

    itemsGrid.appendChild(card);
  });
}

// Item detail dialog
const detailDialog = document.getElementById("item-detail");
const detailContent = document.getElementById("item-detail-content");

function openItemDetail(id) {
  if (!detailDialog || !detailContent) return;
  const item = items.find((i) => i.id === id);
  if (!item) return;

  detailContent.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = item.title;

  const badge = document.createElement("span");
  badge.className = "lf-badge";
  badge.textContent = item.status === "lost" ? "Lost" : "Found";

  const header = document.createElement("div");
  header.className = "lf-card-header";
  header.appendChild(title);
  header.appendChild(badge);

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "lf-card-image";
  imageWrapper.style.marginBottom = "0.75rem";
  if (item.imageUrl) {
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;
    imageWrapper.appendChild(img);
  } else {
    imageWrapper.textContent = "No image";
  }

  const details = document.createElement("div");
  details.className = "lf-card-meta";
  details.innerHTML = `
    <div><strong>Category:</strong> ${item.category}</div>
    <div><strong>Date:</strong> ${item.date}</div>
    <div><strong>Location:</strong> ${item.location}</div>
    <div style="margin-top:0.5rem;"><strong>Description:</strong><br/>${item.description}</div>
    <div style="margin-top:0.5rem;"><strong>Contact name:</strong> ${item.contactName}</div>
    <div><strong>Email:</strong> ${item.contactEmail || "Not provided"}</div>
    <div><strong>Phone:</strong> ${item.contactPhone || "Not provided"}</div>
  `;

  detailContent.appendChild(header);
  detailContent.appendChild(imageWrapper);
  detailContent.appendChild(details);

  if (typeof detailDialog.showModal === "function") {
    detailDialog.showModal();
  }
}

if (itemsGrid) {
  itemsGrid.addEventListener("click", (evt) => {
    const card = evt.target.closest(".lf-card");
    if (!card) return;
    const id = card.dataset.itemId;
    if (id) openItemDetail(id);
  });

  itemsGrid.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter" || evt.key === " ") {
      const card = evt.target.closest(".lf-card");
      if (!card) return;
      evt.preventDefault();
      const id = card.dataset.itemId;
      if (id) openItemDetail(id);
    }
  });
}

if (detailDialog) {
  detailDialog.addEventListener("click", (evt) => {
    if (evt.target === detailDialog) {
      detailDialog.close();
    }
  });
}

document.body.addEventListener("click", (evt) => {
  const closeBtn = evt.target.closest("[data-close-dialog]");
  if (closeBtn && detailDialog && detailDialog.open) {
    detailDialog.close();
  }
});

// Filters wiring
["input", "change"].forEach((type) => {
  if (searchInput) searchInput.addEventListener(type, renderItems);
  if (filterCategory) filterCategory.addEventListener(type, renderItems);
  if (filterStatus) filterStatus.addEventListener(type, renderItems);
  if (filterFromDate) filterFromDate.addEventListener(type, renderItems);
  if (filterToDate) filterToDate.addEventListener(type, renderItems);
});

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (filterCategory) filterCategory.value = "";
    if (filterStatus) filterStatus.value = "";
    if (filterFromDate) filterFromDate.value = "";
    if (filterToDate) filterToDate.value = "";
    renderItems();
  });
}

// Report page logic
const reportStatusInput = document.getElementById("report-status");
const tabLost = document.getElementById("tab-lost");
const tabFound = document.getElementById("tab-found");
const labelDateKind = document.getElementById("label-date-kind");
const labelLocationKind = document.getElementById("label-location-kind");

function setReportType(type) {
  if (!reportStatusInput) return;
  const isLost = type === "lost";
  reportStatusInput.value = isLost ? "lost" : "found";
  if (tabLost && tabFound) {
    tabLost.classList.toggle("is-active", isLost);
    tabFound.classList.toggle("is-active", !isLost);
    tabLost.setAttribute("aria-selected", String(isLost));
    tabFound.setAttribute("aria-selected", String(!isLost));
  }
  if (labelDateKind) labelDateKind.textContent = isLost ? "lost" : "found";
  if (labelLocationKind) labelLocationKind.textContent = isLost ? "lost" : "found";
}

if (tabLost) {
  tabLost.addEventListener("click", () => setReportType("lost"));
}
if (tabFound) {
  tabFound.addEventListener("click", () => setReportType("found"));
}

// Form validation and submission
const reportForm = document.getElementById("report-form");
const successBox = document.getElementById("report-success");

const fieldTitle = document.getElementById("field-title");
const fieldCategory = document.getElementById("field-category");
const fieldDescription = document.getElementById("field-description");
const fieldDate = document.getElementById("field-date");
const fieldLocation = document.getElementById("field-location");
const fieldContactName = document.getElementById("field-contact-name");
const fieldContactEmail = document.getElementById("field-contact-email");
const fieldContactPhone = document.getElementById("field-contact-phone");
const fieldImageUrl = document.getElementById("field-image-url");

const errorTitle = document.getElementById("error-title");
const errorCategory = document.getElementById("error-category");
const errorDescription = document.getElementById("error-description");
const errorDate = document.getElementById("error-date");
const errorLocation = document.getElementById("error-location");
const errorContactName = document.getElementById("error-contact-name");
const errorContactEmail = document.getElementById("error-contact-email");
const errorContactPhone = document.getElementById("error-contact-phone");
const errorImageUrl = document.getElementById("error-image-url");

function clearErrors() {
  [
    fieldTitle,
    fieldCategory,
    fieldDescription,
    fieldDate,
    fieldLocation,
    fieldContactName,
    fieldContactEmail,
    fieldContactPhone,
    fieldImageUrl,
  ].forEach((field) => field && field.classList.remove("is-invalid"));

  [
    errorTitle,
    errorCategory,
    errorDescription,
    errorDate,
    errorLocation,
    errorContactName,
    errorContactEmail,
    errorContactPhone,
    errorImageUrl,
  ].forEach((el) => {
    if (el) el.textContent = "";
  });
}

function validateReportForm() {
  let isValid = true;
  clearErrors();

  if (fieldTitle && !fieldTitle.value.trim()) {
    isValid = false;
    fieldTitle.classList.add("is-invalid");
    if (errorTitle) errorTitle.textContent = "Title is required.";
  }

  if (fieldCategory && !fieldCategory.value) {
    isValid = false;
    fieldCategory.classList.add("is-invalid");
    if (errorCategory) errorCategory.textContent = "Category is required.";
  }

  if (fieldDescription && !fieldDescription.value.trim()) {
    isValid = false;
    fieldDescription.classList.add("is-invalid");
    if (errorDescription) errorDescription.textContent = "Description is required.";
  }

  if (fieldDate && !fieldDate.value) {
    isValid = false;
    fieldDate.classList.add("is-invalid");
    if (errorDate) errorDate.textContent = "Date is required.";
  }

  if (fieldLocation && !fieldLocation.value.trim()) {
    isValid = false;
    fieldLocation.classList.add("is-invalid");
    if (errorLocation) errorLocation.textContent = "Location is required.";
  }

  if (fieldContactName && !fieldContactName.value.trim()) {
    isValid = false;
    fieldContactName.classList.add("is-invalid");
    if (errorContactName) errorContactName.textContent = "Contact name is required.";
  }

  if (fieldContactEmail && fieldContactEmail.value) {
    const value = fieldContactEmail.value;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      isValid = false;
      fieldContactEmail.classList.add("is-invalid");
      if (errorContactEmail) errorContactEmail.textContent = "Enter a valid email address.";
    }
  }

  if (fieldImageUrl && fieldImageUrl.value) {
    try {
      // basic URL validation
      new URL(fieldImageUrl.value);
    } catch {
      isValid = false;
      fieldImageUrl.classList.add("is-invalid");
      if (errorImageUrl) errorImageUrl.textContent = "Enter a valid URL.";
    }
  }

  return isValid;
}

if (reportForm) {
  reportForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if (!validateReportForm()) return;

    const status = reportStatusInput?.value === "found" ? "found" : "lost";
    const newItem = {
      id: String(Date.now()),
      status,
      title: fieldTitle?.value.trim() || "",
      category: fieldCategory?.value || "",
      description: fieldDescription?.value.trim() || "",
      date: fieldDate?.value || "",
      location: fieldLocation?.value.trim() || "",
      contactName: fieldContactName?.value.trim() || "",
      contactEmail: fieldContactEmail?.value.trim() || "",
      contactPhone: fieldContactPhone?.value.trim() || "",
      imageUrl: fieldImageUrl?.value.trim() || "",
    };

    items.unshift(newItem);
    saveItems();
    populateCategoryFilter();
    renderItems();

    if (successBox) {
      successBox.hidden = false;
    }
    reportForm.reset();
    clearErrors();
  });
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Initialisation
loadItems();
populateCategoryFilter();
renderItems();
showPage("home");

