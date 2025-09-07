// Инициализация SQL.js
initSqlJs({
  locateFile: (file) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
}).then((SQL) => {
  // Создаём базу в памят
  // и
  let db = new SQL.Database();

  // Создаём таблицу
  const saved = localStorage.getItem("mydb");
  if (saved) {
    db = new SQL.Database(new Uint8Array(JSON.parse(saved)));
  } else {
    db = new SQL.Database();
    db.run(
      "CREATE TABLE clients (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, address TEXT)"
    );
  }

  // Кнопка "Добавить клиента"
  document.querySelector(".add-client").addEventListener("click", (e) => {
    // e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    db.run("INSERT INTO clients (name, phone, address) VALUES (?, ?, ?)", [
      name,
      phone,
      address,
    ]);

    localStorage.setItem("mydb", JSON.stringify(Array.from(db.export())));

    alert("Клиент добавлен!");
  });

  // Кнопка "Показать всех клиентов"

  document.querySelector(".show-client").addEventListener("click", () => {
    const result = db.exec("SELECT * FROM clients");
    document.getElementById("output").textContent = JSON.stringify(
      result,
      null,
      1
    );
  });
});
