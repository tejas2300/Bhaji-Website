// Your Firebase configuration
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
      refreshItems();
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

  // Clear form fields
  itemNameInput.value = "";
  itemRateInput.value = "";
});

// Function to display item with collapsible card
function displayItem(item) {
  const itemList = document.getElementById("itemList");
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("item-card");

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  cardHeader.textContent =
    "Item Name: " + item.name + " - Item Rate: " + item.rate;

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  cardContent.style.display = "none"; // Initially hide card content

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "editButton";
  editButton.style.display = "none"; // Initially hide edit button

  editButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the card from toggling
    const newName = prompt("Enter new name:", item.name);
    const newRate = prompt("Enter new rate:", item.rate);
    if (newName !== null && newRate !== null) {
      updateItemInFirebase(item.key, newName, newRate);
      refreshItems();
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "deleteButton";
  deleteButton.style.display = "none"; // Initially hide delete button

  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the card from toggling
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
      deleteItemFromFirebase(item.key);
      refreshItems();
    }
  });

  cardHeader.addEventListener("click", function () {
    const isVisible = cardContent.style.display === "block";
    // Hide all card contents
    const allCardContents = document.querySelectorAll(".card-content");
    allCardContents.forEach((content) => {
      if (content !== cardContent) {
        content.style.display = "none";
      }
    });
    // Toggle visibility of clicked item's content
    cardContent.style.display = isVisible ? "none" : "block";
    // Toggle edit and delete button visibility
    editButton.style.display = isVisible ? "none" : "block";
    deleteButton.style.display = isVisible ? "none" : "block";
  });

  cardContent.appendChild(editButton);
  cardContent.appendChild(deleteButton);

  cardContainer.appendChild(cardHeader);
  cardContainer.appendChild(cardContent);

  itemList.appendChild(cardContainer);
}

// Function to refresh item list
function refreshItems() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = ""; // Clear the current list
  loadItemsFromFirebase(); // Load items from Firebase again
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
