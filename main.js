import "./style.css";

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAQUCXf2KzhOBzZiyAOiQZz5bDnLqnwea8",
  authDomain: "first-hello-67ab0.firebaseapp.com",
  databaseURL: "https://first-hello-67ab0-default-rtdb.firebaseio.com",
  projectId: "first-hello-67ab0",
  storageBucket: "first-hello-67ab0.appspot.com",
  messagingSenderId: "668893748956",
  appId: "1:668893748956:web:158821d9a3723c7b099e19",
  measurementId: "G-YV8NPR1YL3",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const notify = document.querySelector(".notify");

// data send

function saveData() {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;

  if (!name || !email) {
    notify.innerText = "Please Fill The Form";
    return;
  }

  // Making key

  const userId = Date.now();

  set(ref(database, "users/" + userId), {
    name: name,
    email: email,
  });
  notify.innerText = "Data Saved";
  document.querySelector("#name").value = "";
  document.querySelector("#email").value = "";

  getData();
}

const saveDataBtn = document.querySelector("#save");
saveDataBtn.addEventListener("click", saveData);

// get data

function getData() {
  const userRef = ref(database, "users/");
  get(userRef).then((snapshot) => {
    const data = snapshot.val();

    const table = document.querySelector("table");
    let html = "";
    Object.keys(data).forEach((key) => {
      const { name, email } = data[key];

      html += `
        <tr>
          <td>${name}</td>
          <td>${email}</td>
          <td> <button class="edit" onClick="editUser('${key}')">Edit</button> </td>
          <td> <button class="delete" onClick="deleteUser('${key}')">Delete</button> </td>

        </tr>

         `;
    });
    table.innerHTML = html;
  });
}

getData();

// delete data

window.deleteUser = function (key) {
  const userRef = ref(database, `users/${key}`);
  remove(userRef);
  notify.innerHTML = "data deleted !";
  getData();
};

//  edit data

window.editUser = function (key) {
  const userRef = ref(database, `users/${key}`);
  get(userRef).then((item) => {
    const name = item.val().name;
    const email = item.val().email;

    document.querySelector("#name").value = name;
    document.querySelector("#email").value = email;

    document.querySelector(".update_btn").classList.add("show");

    document.querySelector(".save_btn").classList.add("hide");

    const update_form_btn = document.querySelector("#update_form");
    update_form_btn.addEventListener("click", updateForm);

    function updateForm() {
      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;

      if (name !== "" || email !== "") {
        set(userRef, {
          name: name,
          email: email,
        });
        notify.innerHTML = "Updated Data";

        getData();

        document.querySelector(".update_btn").classList.remove("show");

        document.querySelector(".save_btn").classList.remove("hide");

        document.querySelector("#name").value = "";
        document.querySelector("#email").value = "";
      } else {
        notify.innerHTML = "Plz add Data";
      }
    }
  });
};
