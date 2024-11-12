document.addEventListener("DOMContentLoaded", function () {
  function getEntries() {
    const dataJSON = localStorage.getItem("entries");
    return dataJSON ? JSON.parse(dataJSON) : [];
  }

  let entries = getEntries();
  const form = document.getElementById("entryForm");
  const pendingArrivals = document.getElementById("pendingArrivals");
  const arrivedEntries = document.getElementById("arrivedEntries");
  const searchInput = document.querySelector("#search");
  const searchContainer = document.querySelector(".searchContainer");
  const checkboxEl = document.querySelector("#viewSide");

  const searchText = { search: "" };

  function generateId() {
    return `${Math.floor(Math.random() * 100000)}-${Date.now()}`;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const ticketNumber = document.getElementById("tickNum").value.trim();
    const paymentMode = document.getElementById("payment").value;

    if (!name || !ticketNumber || !paymentMode) {
      alert("Please fill in all fields.");
      return;
    }

    const newEntry = {
      name,
      ticketNumber,
      paymentMode,
      id: generateId(),
      checked: false,
    };

    entries.push(newEntry);
    localStorage.setItem("entries", JSON.stringify(entries));
    addEntryToDOM(newEntry);
    form.reset();
  });

  function filterEntries(searchObj) {
    if (!searchObj.search) {
      document.querySelector(".searchContainer").innerHTML = "";
      return;
    }
    searchContainer.innerHTML = "";
    const filteredEntries = entries.filter((entry) => {
      return entry.ticketNumber.includes(searchObj.search);
    });

    filteredEntries.forEach((entry) => {
      const entryElement = createEntryElement(entry);
      searchContainer.appendChild(entryElement);
    });
  }

  function createEntryElement(data) {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");

    entryDiv.innerHTML = `
        <span><strong>Name:</strong> ${data.name}</span>
        <span><strong>Ticket #:</strong> ${data.ticketNumber}</span>
        <span><strong>Payment:</strong> ${data.paymentMode}</span>
        <button class="delete-btn">Delete</button>
      `;

    const arrivedCheckbox = document.createElement("input");
    arrivedCheckbox.type = "checkbox";
    arrivedCheckbox.checked = data.checked;

    // Update checkbox status and sync across lists
    arrivedCheckbox.addEventListener("change", function () {
      data.checked = arrivedCheckbox.checked;
      localStorage.setItem("entries", JSON.stringify(entries));
      refreshEntriesDisplay();
      filterEntries(searchText);
    });

    entryDiv.appendChild(arrivedCheckbox);

    entryDiv
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        entries = entries.filter((entry) => entry.id !== data.id);
        localStorage.setItem("entries", JSON.stringify(entries));
        entryDiv.remove();
        refreshEntriesDisplay();
      });

    return entryDiv;
  }

  checkboxEl.addEventListener("change", (e) => {
    if (e.target.checked) {
      document
        .querySelector(".managing-arrivals")
        .classList.add("managing-arrivals-styles");
      document.querySelectorAll(".entry").forEach((entry) => {
        console.log(entry);
        entry.classList.add("updateEntry");
      });
    } else {
      document
        .querySelector(".managing-arrivals")
        .classList.remove("managing-arrivals-styles");
      document.querySelectorAll(".entry").forEach((entry) => {
        console.log(entry);
        entry.classList.remove("updateEntry");
      });
    }
  });

  function addEntryToDOM(entry) {
    const entryElement = createEntryElement(entry);
    if (entry.checked) {
      arrivedEntries.appendChild(entryElement);
    } else {
      pendingArrivals.appendChild(entryElement);
    }
  }

  function refreshEntriesDisplay() {
    pendingArrivals.innerHTML = "";
    arrivedEntries.innerHTML = "";
    entries.forEach((entry) => {
      addEntryToDOM(entry);
    });
  }

  entries.forEach((entry) => {
    addEntryToDOM(entry);
  });

  searchInput.addEventListener("input", (e) => {
    searchText.search = e.target.value;
    filterEntries(searchText);
  });
});
