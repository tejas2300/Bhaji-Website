// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvm49QflESassIJWf7EJ6Vm6x5YOJIccI",
  authDomain: "pai-s-vegitable.firebaseapp.com",
  projectId: "pai-s-vegitable",
  storageBucket: "pai-s-vegitable.appspot.com",
  messagingSenderId: "680617814052",
  appId: "1:680617814052:web:38be6bb3b9d84df34d90b1",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the Firebase Realtime Database
const database = firebase.database();

// Function to save item to Firebase Realtime Database
function saveItemToFirebase(item) {
  const itemsRef = database.ref("items");
  const newItemRef = itemsRef.push();
  newItemRef
    .set(item)
    .then(() => {
      console.log("Item saved successfully");
    })
    .catch((error) => {
      console.error("Error saving item:", error);
    });
}

// Function to load items from Firebase Realtime Database
function loadItemsFromFirebase() {
  const itemsRef = database.ref("items");
  itemsRef.once("value", (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key; // Add key to the item
      displayItem(item);
    });
  });
}

// Load saved items from Firebase Realtime Database
loadItemsFromFirebase();

// Function to update item in Firebase Realtime Database
function updateItemInFirebase(itemKey, newName, newRate) {
  database
    .ref("items/" + itemKey)
    .update({
      name: newName,
      rate: newRate,
    })
    .then(() => {
      console.log("Item updated successfully");
    })
    .catch((error) => {
      console.error("Error updating item:", error);
    });
}

// Function to delete item from Firebase Realtime Database
function deleteItemFromFirebase(itemKey) {
  database
    .ref("items/" + itemKey)
    .remove()
    .then(() => {
      console.log("Item deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
    });
}

// Add event listener for form submission
const addItemForm = document.getElementById("addItemForm");
addItemForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const itemNameInput = document.getElementById("itemName");
  const itemRateInput = document.getElementById("itemRate");

  // Create item object
  const newItem = {
    name: itemNameInput.value,
    rate: itemRateInput.value,
  };

  // Save item to Firebase
  saveItemToFirebase(newItem);

  // Display item
  displayItem(newItem);

  // Clear form fields
  itemNameInput.value = "";
  itemRateInput.value = "";
});

// Function to display item
function displayItem(item) {
  const itemList = document.getElementById("itemList");
  const itemElement = document.createElement("div");
  itemElement.classList.add("item");

  // Create a table-like structure with borders
  const table = document.createElement("table");
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  const rateCell = document.createElement("td");
  const actionsCell = document.createElement("td");
  actionsCell.classList.add("actionsCell"); // Use class instead of id

  nameCell.textContent = item.name;
  rateCell.textContent = item.rate;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "editButton";
  editButton.addEventListener("click", function () {
    const newName = prompt("Enter new name:", item.name);
    const newRate = prompt("Enter new rate:", item.rate);
    if (newName !== null && newRate !== null) {
      updateItemInFirebase(item.key, newName, newRate);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "deleteButton";
  deleteButton.addEventListener("click", function () {
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
      deleteItemFromFirebase(item.key);
    }
  });

  actionsCell.appendChild(editButton);
  actionsCell.appendChild(deleteButton);

  row.appendChild(nameCell);
  row.appendChild(rateCell);
  row.appendChild(actionsCell);

  table.appendChild(row);
  itemElement.appendChild(table);

  itemList.appendChild(itemElement);
}

// Function to refresh item list
function refreshItemList() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = "";
  loadItemsFromFirebase();
}

// Add event listener for saving and generating PDF
const saveAndGeneratePDFButton = document.getElementById("saveAndGeneratePDF");
saveAndGeneratePDFButton.addEventListener("click", function () {
  // Trigger print dialog
  window.print();
});

// Add event listener for clear list button
const clearListButton = document.getElementById("clearList");
clearListButton.addEventListener("click", function () {
  database.ref("items").remove();
  document.getElementById("itemList").innerHTML = ""; // Clear the displayed items
});
