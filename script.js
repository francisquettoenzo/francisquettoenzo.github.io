document.addEventListener("DOMContentLoaded", () => {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    let usedItems = JSON.parse(localStorage.getItem("usedItems")) || [];
    const itemsTableBody = document.querySelector("#itemsTable tbody");
    const usedItemsTableBody = document.querySelector("#usedItemsTable tbody");
    const itemNameInput = document.querySelector("#itemName");
    const itemQuantityInput = document.querySelector("#itemQuantity");
    const usedItemInput = document.querySelector("#usedItem");
    const usedQuantityInput = document.querySelector("#usedQuantity");
    const usedDateInput = document.querySelector("#usedDate");
    const usedUnitInput = document.querySelector("#usedUnit");

    function renderItems() {
        itemsTableBody.innerHTML = "";
        items.forEach((item, index) => {
            itemsTableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button onclick="openUsePopup(${index})">Utilizar</button>
                        <button onclick="removeItem(${index})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }

    function renderUsedItems() {
        usedItemsTableBody.innerHTML = "";
        usedItems.forEach((item, index) => {
            usedItemsTableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.date}</td>
                    <td>${item.unit}</td>
                    <td>
                        <button onclick="removeUsedItem(${index})">
                            <img src="trash-icon.png" alt="Excluir" class="trash-icon">
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    window.openUsePopup = (index) => {
        const item = items[index];
        usedItemInput.value = item.name;
        usedQuantityInput.value = "";
        document.getElementById("usePopup").style.display = "block";
        usedItemInput.disabled = true; // Desabilitar o campo do nome do item
    };

    window.removeItem = (index) => {
        items.splice(index, 1);
        localStorage.setItem("items", JSON.stringify(items));
        renderItems();
    };

    window.removeUsedItem = (index) => {
        usedItems.splice(index, 1);
        localStorage.setItem("usedItems", JSON.stringify(usedItems));
        renderUsedItems();
    };

    document.querySelector("#addItem").addEventListener("click", () => {
        const name = itemNameInput.value;
        const quantity = Number(itemQuantityInput.value);
        if (name && quantity > 0) {
            items.push({ name, quantity });
            localStorage.setItem("items", JSON.stringify(items));
            renderItems();
            closeRegisterPopup();
        } else {
            alert("Por favor, insira um nome e uma quantidade válida.");
        }
    });

    document.querySelector("#confirmUse").addEventListener("click", () => {
        const usedQuantity = Number(usedQuantityInput.value);
        const usedDate = usedDateInput.value;
        const usedUnit = usedUnitInput.value;

        const itemIndex = items.findIndex(item => item.name === usedItemInput.value);
        const item = items[itemIndex];

        if (item && usedQuantity > 0 && usedQuantity <= item.quantity) {
            item.quantity -= usedQuantity;
            usedItems.push({ name: item.name, quantity: usedQuantity, date: usedDate, unit: usedUnit });
            localStorage.setItem("items", JSON.stringify(items));
            localStorage.setItem("usedItems", JSON.stringify(usedItems));
            renderItems();
            renderUsedItems();
            closeUsePopup();
        } else {
            alert("Quantidade inválida.");
        }
    });

    document.querySelector("#openRegister").addEventListener("click", () => {
        document.getElementById("registerPopup").style.display = "block";
    });

    document.querySelectorAll(".close").forEach(element => {
        element.addEventListener("click", () => {
            element.closest(".popup").style.display = "none";
        });
    });

    function closeRegisterPopup() {
        document.getElementById("registerPopup").style.display = "none";
        itemNameInput.value = "";
        itemQuantityInput.value = "";
    }

    function closeUsePopup() {
        document.getElementById("usePopup").style.display = "none";
        usedItemInput.value = "";
        usedQuantityInput.value = "";
        usedDateInput.value = "";
        usedUnitInput.selectedIndex = 0; // Reseta o seletor
    }

    renderItems();
    renderUsedItems();
});
