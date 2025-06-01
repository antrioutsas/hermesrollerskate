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

// Redirect messages
const redirectMessages = {
    gr: (sec) => `Θα μεταφερθείτε αυτόματα στην αρχική σελίδα σε ${sec} δευτερόλεπτα...`,
    en: (sec) => `You will be redirected to the homepage in ${sec} seconds...`
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

let intervalId;
let countdown = 15;
let activeRedirect = false;

// Εναλλαγή γλώσσας
function toggleLanguage() {
    const currentLang = localStorage.getItem("language") || "en";
    const newLang = currentLang === "en" ? "gr" : "en";
    localStorage.setItem("language", newLang);
    updateLanguage(newLang);
}

// Ενημέρωση περιεχομένου σε νέα γλώσσα
function updateLanguage(lang) {
    const flagImage = document.querySelector("#language-button img");
    flagImage.src = lang === "en" ? "photo/greeceflag.png" : "photo/englandflag.jpg";
    flagImage.alt = lang === "en" ? "Greece Language" : "English Language";

    const elements = document.querySelectorAll("[data-en]");
    elements.forEach(el => {
        const tag = el.tagName.toLowerCase();
        if (tag === "title") {
            document.title = el.getAttribute(`data-${lang}`);
        } else if ((tag === "input" || tag === "textarea") && el.hasAttribute("placeholder")) {
            el.placeholder = el.getAttribute(`data-${lang}-placeholder`) || el.getAttribute(`data-${lang}`);
        } else if (tag === "option") {
            el.textContent = el.getAttribute(`data-${lang}`);
        } else if (tag === "button" || tag === "a") {
            el.textContent = el.getAttribute(`data-${lang}`);
        } else {
            el.innerHTML = el.getAttribute(`data-${lang}`);
        }
    });

    // Ενημέρωση redirect message αν είναι ενεργό
    if (activeRedirect) {
        document.getElementById("redirect-message").textContent = redirectMessages[lang](countdown);
    }

    document.documentElement.lang = lang;

    // Καθαρισμός error εμφανίσεων
    requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        el.classList.remove("error");
        const group = el.closest(".input-group");
        const oldLabel = group.querySelector(".error-label");
        if (oldLabel) oldLabel.remove();
    });
}

// Υποβολή φόρμας
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
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

    if (isValid) {
        const formData = new FormData(this);
        fetch("send.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("form").style.display = "none";

                    const responseBox = document.getElementById("form-response");
                    const successMessages = {
                        gr: "✅ Ευχαριστούμε για το μήνυμά σας! Θα επικοινωνήσουμε μαζί σας σύντομα.",
                        en: "✅ Thank you for your message! We'll get back to you shortly."
                    };
                    responseBox.setAttribute("data-gr", successMessages.gr);
                    responseBox.setAttribute("data-en", successMessages.en);
                    responseBox.innerText = successMessages[lang];
                    responseBox.style.display = "block";

                    document.getElementById("new-message-btn").style.display = "inline-block";
                    const redirectBox = document.getElementById("redirect-message");
                    redirectBox.style.display = "block";
                    countdown = 15;
                    activeRedirect = true;

                    redirectBox.textContent = redirectMessages[lang](countdown);
                    intervalId = setInterval(() => {
                        countdown--;
                        const lang = document.documentElement.lang || "gr";
                        redirectBox.textContent = redirectMessages[lang](countdown);
                        if (countdown <= 0) {
                            clearInterval(intervalId);
                            window.location.href = "http://localhost/hermesrollerskate/whoweare.html";
                        }
                    }, 1000);
                } else {
                    alert("Υπήρξε πρόβλημα στην αποστολή. Προσπαθήστε ξανά.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Σφάλμα κατά την αποστολή. Δοκιμάστε ξανά αργότερα.");
            });
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

// Κουμπί "Αποστολή νέου μηνύματος"
document.getElementById("new-message-btn").addEventListener("click", () => {
    clearInterval(intervalId);
    activeRedirect = false;

    document.getElementById("form").style.display = "block";
    document.getElementById("form-response").style.display = "none";
    document.getElementById("new-message-btn").style.display = "none";
    document.getElementById("redirect-message").style.display = "none";
    document.getElementById("form").reset();

    requiredFields.forEach(field => {
        const el = document.getElementById(field.id);
        el.classList.remove("error");
        const group = el.closest(".input-group");
        const oldLabel = group.querySelector(".error-label");
        if (oldLabel) oldLabel.remove();
    });

    document.getElementById("form").scrollIntoView({ behavior: "smooth" });
});

// Αρχική γλώσσα από localStorage
document.addEventListener("DOMContentLoaded", function () {
    const storedLang = localStorage.getItem("language") || "en";
    updateLanguage(storedLang);
});
