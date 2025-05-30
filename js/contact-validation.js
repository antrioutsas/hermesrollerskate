// Δίγλωσσα μηνύματα σφάλματος
const errorMessages = {
    gr: {
        name: "Το όνομα είναι υποχρεωτικό.",
        surname: "Το επώνυμο είναι υποχρεωτικό.",
        email: "Το email είναι υποχρεωτικό.",
        category: "Η κατηγορία είναι υποχρεωτική.",
        subject: "Το θέμα είναι υποχρεωτικό.",
        message: "Το μήνυμα είναι υποχρεωτικό."
    },
    en: {
        name: "Name is required.",
        surname: "Surname is required.",
        email: "Email is required.",
        category: "Category is required.",
        subject: "Subject is required.",
        message: "Message is required."
    }
};

// Πεδία για validation
const requiredFields = [
    { id: "name-input", key: "name" },
    { id: "surname-input", key: "surname" },
    { id: "email-input", key: "email" },
    { id: "category-input", key: "category" },
    { id: "subject-input", key: "subject" },
    { id: "text-input", key: "message" }
];

// Εναλλαγή γλώσσας
function toggleLanguage() {
    const currentLang = localStorage.getItem("language") || "en";
    const newLang = currentLang === "en" ? "gr" : "en";
    localStorage.setItem("language", newLang);
    updateLanguage(newLang);
}

// Ενημέρωση περιεχομένου σε νέα γλώσσα
function updateLanguage(lang) {
    // Ενημέρωση σημαίας
    const flagImage = document.querySelector("#language-button img");
    if (lang === "en") {
        flagImage.src = "photo/greeceflag.png";
        flagImage.alt = "Greece Language";
    } else {
        flagImage.src = "photo/englandflag.jpg";
        flagImage.alt = "English Language";
    }

    // Ενημέρωση περιεχομένου
    const elements = document.querySelectorAll("[data-en]");
    elements.forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (tag === "title") {
            document.title = el.getAttribute(`data-${lang}`);
        } else if (
            (tag === "input" || tag === "textarea") &&
            el.hasAttribute("placeholder")
        ) {
            el.placeholder = el.getAttribute(`data-${lang}`);
        } else if (tag === "option") {
            el.textContent = el.getAttribute(`data-${lang}`);
        } else {
            el.innerHTML = el.getAttribute(`data-${lang}`);
        }
    });

    // Ενημέρωση lang στο <html>
    document.documentElement.lang = lang;

    requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        el.classList.remove("error");

        const group = el.closest(".input-group");
        const oldLabel = group.querySelector(".error-label");
        if (oldLabel) oldLabel.remove();
    });

}

// Validation φόρμας
document.getElementById("form").addEventListener("submit", function (e) {
    const lang = document.documentElement.lang || "gr";
    let isValid = true;

    requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        el.classList.remove("error");

        const group = el.closest(".input-group");
        const oldLabel = group.querySelector(".error-label");
        if (oldLabel) oldLabel.remove();
    });

    requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        const group = el.closest(".input-group");
        const isSelect = el.tagName === "SELECT";
        const empty = isSelect ? !el.value : !el.value.trim();

        if (empty) {
            el.classList.add("error");

            const errorMsg = document.createElement("div");
            errorMsg.classList.add("error-label");
            errorMsg.textContent = errorMessages[lang][field.key];
            group.insertBefore(errorMsg, el);

            isValid = false;
        }
    });

    if (!isValid) {
        e.preventDefault();
    }
});

// Καθαρισμός σφαλμάτων κατά την πληκτρολόγηση/αλλαγή
requiredFields.forEach(field => {
    const el = document.getElementById(field.id);
    const eventType = el.tagName === "SELECT" ? "change" : "input";

    el.addEventListener(eventType, () => {
        if (el.classList.contains("error")) {
            el.classList.remove("error");

            const group = el.closest(".input-group");
            const oldLabel = group.querySelector(".error-label");
            if (oldLabel) oldLabel.remove();
        }
    });
});

// Εκτέλεση αλλαγής γλώσσας στην αρχή (βάσει localStorage)
document.addEventListener("DOMContentLoaded", function () {
    const storedLang = localStorage.getItem("language") || "en";
    updateLanguage(storedLang);
});