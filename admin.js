// Elements
const nameInput = document.getElementById("productName");
const imgInput = document.getElementById("productImage");
const previewImg = document.getElementById("previewImg");
const dropText = document.getElementById("dropText");
const addBtn = document.getElementById("addProductBtn");
const categoryList = document.getElementById("categoryList");

let categories = JSON.parse(localStorage.getItem("categories")) || [];
let editId = null; // Track product being edited

// Image Preview
imgInput.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            dropText.style.display = "none";
        };
        reader.readAsDataURL(file);
    }
});

// Add / Update Product
addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const file = imgInput.files[0];

    if (!name && !editId) {
        alert("Please enter product name!");
        return;
    }

    // Edit mode
    if (editId) {
        const index = categories.findIndex(p => p.id === editId);
        if (!file) {
            // Only name change
            categories[index].name = name;
        } else {
            // Image + name change
            const reader = new FileReader();
            reader.onload = e => {
                categories[index].name = name;
                categories[index].image = e.target.result;
                saveAndRefresh();
            };
            reader.readAsDataURL(file);
            return;
        }
        saveAndRefresh();
        return;
    }

    // Add new product
    if (!file) {
        alert("Please select an image!");
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        const newCategory = {
            id: Date.now(),
            name: name,
            image: e.target.result
        };
        categories.push(newCategory);
        saveAndRefresh();
    };
    reader.readAsDataURL(file);
});

// Display Categories
function showCategories() {
    categoryList.innerHTML = "";
    categories.forEach(cat => {
        const card = document.createElement("div");
        card.classList.add("category-card");
        card.innerHTML = `
            <img src="${cat.image}" alt="${cat.name}" />
            <p>${cat.name}</p>
            <div style="display:flex; gap:5px; justify-content:center;">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        categoryList.appendChild(card);

        // Edit
        card.querySelector(".edit-btn").addEventListener("click", () => {
            editId = cat.id;
            nameInput.value = cat.name;
            previewImg.src = cat.image;
            previewImg.style.display = "block";
            dropText.style.display = "none";
            addBtn.textContent = "Update Product";
        });

        // Delete
        card.querySelector(".delete-btn").addEventListener("click", () => {
            categories = categories.filter(c => c.id !== cat.id);
            saveAndRefresh();
        });
    });
}

function saveAndRefresh() {
    localStorage.setItem("categories", JSON.stringify(categories));
    nameInput.value = "";
    imgInput.value = "";
    previewImg.style.display = "none";
    dropText.style.display = "block";
    addBtn.textContent = "Add Product";
    editId = null;
    showCategories();
}

// Initial load
showCategories();