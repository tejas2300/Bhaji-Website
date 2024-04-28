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
  location.reload();
  itemNameInput.focus();
});

// Function to display item with collapsible card

function displayItem(item) {
  const itemList = document.getElementById("itemList");

  // Create table row for the item
  const row = document.createElement("tr");

  // Create cells for item name and rate
  const nameCell = document.createElement("td");
  nameCell.textContent = item.name;

  const rateCell = document.createElement("td");
  rateCell.textContent = item.rate;

  // Append cells to the item row
  row.appendChild(nameCell);
  row.appendChild(rateCell);

  // Append item row to the table
  itemList.appendChild(row);

  // Create a new row for buttons
  const buttonsRow = document.createElement("tr");

  // Create cell for edit and delete buttons
  const buttonsCell = document.createElement("td");
  buttonsCell.className = "buttonRow"
  buttonsCell.colSpan = 2; // Span buttons cell across two columns
  buttonsCell.style.display = "none"; 

  // Create edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "editButton";
  editButton.style.display = "none";// Initially hide edit button
  buttonsCell.style.display = "none";
  editButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the row from toggling
    const newName = prompt("Enter new name:", item.name);
    const newRate = prompt("Enter new rate:", item.rate);
    if (newName !== null && newRate !== null) {
      updateItemInFirebase(item.key, newName, newRate);
      // Update displayed values
      nameCell.textContent = newName;
      rateCell.textContent = newRate;
      // Hide edit and delete buttons after editing
      editButton.style.display = "none";
      deleteButton.style.display = "none";
      buttonsCell.style.display = "none";
    }
  });

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "deleteButton";
  deleteButton.style.display = "none"; // Initially hide delete button
  buttonsCell.style.display = "none";
  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the row from toggling
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
      deleteItemFromFirebase(item.key);
      // Remove item row from display
      itemList.removeChild(row);
      // Remove buttons row from display
      itemList.removeChild(buttonsRow);
    }
  });

  // Add click event listener to toggle buttons visibility
  row.addEventListener("click", function () {
    // Toggle visibility of edit and delete buttons
    if (editButton.style.display === "none") {
      // Hide edit and delete buttons for all rows
      const allEditButtons = document.querySelectorAll(".editButton");
      allEditButtons.forEach(button => {
        button.style.display = "none";
      });
      const allDeleteButtons = document.querySelectorAll(".deleteButton");
      allDeleteButtons.forEach(button => {
        button.style.display = "none";
      });
      const allButtonRow = document.querySelectorAll(".buttonRow");
      allButtonRow.forEach(buttonsCell => {
        buttonsCell.style.display = "none";
      })

      // Show edit and delete buttons for the clicked row
      buttonsCell.style.display = "table-cell";
      editButton.style.display = "inline-block";
      deleteButton.style.display = "inline-block";
    } else {
      // Hide edit and delete buttons for the clicked row
      buttonsCell.style.display = "none";
      editButton.style.display = "none";
      deleteButton.style.display = "none";
    }
  });

  // Append buttons to the buttons cell
  buttonsCell.appendChild(editButton);
  buttonsCell.appendChild(deleteButton);

  // Append buttons cell to the buttons row
  buttonsRow.appendChild(buttonsCell);

  // Append buttons row to the table
  itemList.appendChild(buttonsRow);
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
  CreatePDFfromHTML();
});

// Add event listener for clear list button
const clearListButton = document.getElementById("clearList");
clearListButton.addEventListener("click", function () {
  database.ref("items").remove();
  document.getElementById("itemList").innerHTML = ""; // Clear the displayed items
  location.reload();
});

function CreatePDFfromHTML() {
  var HTML_Width = document.querySelector(".container").clientWidth;
  var HTML_Height = document.querySelector(".container").clientHeight;
  var top_left_margin = 15;
  var PDF_Width = HTML_Width + (top_left_margin * 2);
  var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  var canvas_image_width = HTML_Width;
  var canvas_image_height = HTML_Height;

  var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  html2canvas(document.querySelector(".container"), { scale: 2 }).then(function (canvas) {
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      for (var i = 1; i <= totalPDFPages; i++) {
          pdf.addPage(PDF_Width, PDF_Height);
          pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }

      var currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
      var filename = "Pai's vegitable - " + currentDate + ".pdf";
      pdf.save(filename);
      document.querySelector(".container").style.display = "block"; // Make sure to show the container after hiding it
  });
}


// function CreatePDFfromHTML() {
//   const container = document.querySelector('.container');
//   const itemList = document.getElementById('itemList');
//   const rows = Array.from(itemList.querySelectorAll('tr'));
//   const itemsPerPage = 50; // Number of items per page
//   const totalPages = Math.ceil(rows.length / itemsPerPage);

//   // Function to add items to each page
//   const addItemsToPage = (pdf, pageIndex, imgData) => {
//       // Set up styling for the PDF
//       pdf.setFont("helvetica");
//       pdf.setFontSize(12);

//       // Add content to each page
//       const startIndex = pageIndex * itemsPerPage;
//       const endIndex = Math.min(startIndex + itemsPerPage, rows.length);
//       let yOffset = 40; // Initial Y offset for items
//       for (let i = startIndex; i < endIndex; i++) {
//           const cells = rows[i].querySelectorAll('td');
//           if (cells.length >= 2) { // Check if there are at least 2 cells in the row
//               const itemName = cells[0].innerText;
//               const itemRate = cells[1].innerText;

//               // Add item name and rate
//               pdf.text(30, yOffset, itemName);
//               pdf.text(100, yOffset, itemRate);

//               yOffset += 10; // Increment Y offset for next item
//           }
//       }
//   };

//   // Load the background image
//   const img = new Image();
//   img.onload = function() {
//       // Generate PDF with pagination
//       let pdf = new jsPDF();
//       for (let i = 0; i < totalPages; i++) {
//           if (i > 0) {
//               pdf.addPage(); // Add new page for each page after the first one
//           }
//           pdf.addImage(this, 'JPEG', 0, 0, 210, 297); // Add background image to each page
//           addItemsToPage(pdf, i); // Add items to each page
//       }

//       // Save the PDF file
//       const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
//       const filename = "Pai's vegetable - " + currentDate + ".pdf";
//       pdf.save(filename);
//   };
//   img.src = "./vegi_background_a4.jpg";
// }

// function CreatePDFfromHTML() {
//   const container = document.querySelector('.container');
//   const itemList = document.getElementById('itemList');
//   const rows = Array.from(itemList.querySelectorAll('tr'));
//   const itemsPerPage = 50; // Number of items per page
//   const totalPages = Math.ceil(rows.length / itemsPerPage);

//   // Function to add items to each page with borders and header
//   const addItemsToPage = (pdf, pageIndex, imgData) => {
//       // Set up styling for the PDF
//       pdf.setFont("helvetica");
//       pdf.setFontSize(12);

//       // Add header with logo and contact details
//       if (pageIndex === 0) {
//           pdf.addImage(imgData, 'PNG', 30, 10, 60, 60); // Logo
//           pdf.text(100, 30, '📧 paisvegetables@gmail.com'); // Email
//           pdf.text(100, 40, '📞 9960780088'); // Phone number
//       }

//       // Add content to each page
//       const startIndex = pageIndex * itemsPerPage;
//       const endIndex = Math.min(startIndex + itemsPerPage, rows.length);
//       let yOffset = 80; // Initial Y offset for items below header
//       for (let i = startIndex; i < endIndex; i++) {
//           const cells = rows[i].querySelectorAll('td');
//           if (cells.length >= 2) { // Check if there are at least 2 cells in the row
//               const itemName = cells[0].innerText;
//               const itemRate = cells[1].innerText;

//               // Draw borders for each cell
//               pdf.rect(30, yOffset, 70, 10); // Item name cell
//               pdf.rect(100, yOffset, 50, 10); // Item rate cell

//               // Add item name and rate
//               pdf.text(35, yOffset + 7, itemName);
//               pdf.text(105, yOffset + 7, itemRate);

//               yOffset += 10; // Increment Y offset for next item
//           }
//       }
//   };

//   // Load the logo image
//   const img = new Image();
//   img.onload = function() {
//       // Generate PDF with pagination
//       let pdf = new jsPDF();
//       for (let i = 0; i < totalPages; i++) {
//           if (i > 0) {
//               pdf.addPage(); // Add new page for each page after the first one
//           }
//           pdf.addImage(this, 'JPEG', 0, 0, 210, 297); // Add logo image to each page
//           addItemsToPage(pdf, i, this); // Add items to each page with borders and header
//       }

//       // Save the PDF file
//       const currentDate = new Date().toLocaleDateString().replace(/\//g, "-");
//       const filename = "Pai's vegetable - " + currentDate + ".pdf";
//       pdf.save(filename);
//   };
//   img.src = "./vegi_background_a4.jpg";
// }
