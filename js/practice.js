document.getElementById("auth-btn").addEventListener("click", () => {
  const login = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();

  const correctLogin = "eugene";
  const correctPassword = "Delivery987";

  if (login === correctLogin && password === correctPassword) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("app-content").style.display = "block";
  } else {
    document.getElementById("auth-error").textContent =
      "❌ Неверный логин или пароль";
  }
});

const form = document.querySelector(".registration-form");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const formData = {};
  for (let element of form.elements) {
    if (element.name) {
      formData[element.name] = element.value.trim();
    }
  }

  formData.id = Date.now().toString();

  const currentData = JSON.parse(localStorage.getItem("clientData") || "[]");
  currentData.push(formData);
  localStorage.setItem("clientData", JSON.stringify(currentData));
  form.reset();
});

const getFormData = (form) => {
  const formData = {};
  for (let element of form.elements) {
    if (element.name) {
      formData[element.name] = element.value.trim();
    }
  }
  return formData;
};

document.querySelector(".search-client").addEventListener("click", () => {
  const formData = getFormData(form);
  const clients = JSON.parse(localStorage.getItem("clientData") || "[]");
  let found;

  if (formData.name) {
    const nameInput = formData.name?.trim().toLowerCase();
    found = clients.filter(
      (client) => client.name?.trim().toLowerCase() === nameInput
    );
  } else if (formData.phone) {
    const phoneInput = formData.phone?.trim().toLowerCase();
    found = clients.filter(
      (client) => client.phone?.trim().toLowerCase() === phoneInput
    );
  } else {
    return; // ничего не введено — просто выходим
  }

  if (found.length > 0) {
    const clientList = document.getElementById("clientList");
    clientList.innerHTML = "";

    found.forEach((client) => {
      const card = document.createElement("div");
      card.className = "client-card";
      card.innerHTML = `
        <strong>Имя:</strong> ${client.name || "❌"}<br>
        <strong>Телефон:</strong> ${client.phone || "❌"}<br>
        <strong>Адрес:</strong> ${client.address || "❌"}<br>
        <button data-id="${client.id}" class="select-client">Выбрать</button>
      `;
      clientList.appendChild(card);
    });

    document.getElementById("clientModal").style.display = "flex";
  }
});

document.querySelector(".show-map").addEventListener("click", () => {
  const nameInput = document
    .querySelector('input[name="name"]')
    .value.trim()
    .toLowerCase();

  const clients = JSON.parse(localStorage.getItem("clientData") || "[]");
  const found = clients.find(
    (client) => client.name?.trim().toLowerCase() === nameInput
  );

  if (found && found.address) {
    const encodedAddress = encodeURIComponent(found.address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapUrl, "_blank");
  }

  form.reset();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("select-client")) {
    const selectedId = e.target.dataset.id;
    const clients = JSON.parse(localStorage.getItem("clientData") || "[]");
    const selectedClient = clients.find((c) => c.id === selectedId);

    if (selectedClient?.address) {
      const encodedAddress = encodeURIComponent(selectedClient.address);
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(mapUrl, "_blank");
    }

    document.getElementById("clientModal").style.display = "none";
  }

  if (e.target.classList.contains("close-btn")) {
    document.getElementById("clientModal").style.display = "none";
  }
});
