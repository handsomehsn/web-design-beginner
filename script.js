const heroButton = document.querySelector(".hero .btn");
const saveAddressButton = document.getElementById("save-address-btn");
const contactForm = document.querySelector(".contact-form");
const formMessage = document.getElementById("form-message");
const navLinks = document.querySelectorAll(".nav-menu a");

const showMessage = (text, type = "success") => {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.className = `message ${type}`;
  setTimeout(() => {
    formMessage.textContent = "";
    formMessage.className = "message";
  }, 4000);
};

if (heroButton) {
  heroButton.addEventListener("click", () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// --- Calculator demo ---
const calcDisplay = document.getElementById("calc-display");
const calcKeys = document.querySelectorAll(".calc-keys button");
const calculatorElement = document.getElementById("calculator");
let calculatorActive = false;
let expression = "";

const updateCalculatorDisplay = (value) => {
  if (calcDisplay) calcDisplay.value = value;
};

const evaluateExpression = () => {
  if (!calcDisplay) return "";

  try {
    const safeExpr = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    // eslint-disable-next-line no-new-func
    const result = Function("return (" + safeExpr + ")")();
    updateCalculatorDisplay(result);
    expression = String(result);
  } catch (err) {
    updateCalculatorDisplay("Error");
    expression = "";
  }
  return expression;
};

if (calculatorElement) {
  calculatorElement.addEventListener("click", () => {
    calculatorActive = true;
    if (calcDisplay) calcDisplay.focus();
  });
}

if (calcDisplay) {
  calcDisplay.addEventListener("focus", () => {
    calculatorActive = true;
  });
  calcDisplay.addEventListener("blur", () => {
    calculatorActive = false;
  });
}

if (calcKeys && calcKeys.length) {
  const handleCalculatorKey = (key) => {
    if (key === "C") {
      expression = "";
      updateCalculatorDisplay("");
      return;
    }

    if (key === "back") {
      expression = expression.slice(0, -1);
      updateCalculatorDisplay(expression);
      return;
    }

    if (key === "=") {
      evaluateExpression();
      return;
    }

    expression += key;
    updateCalculatorDisplay(expression);
  };

  calcKeys.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      handleCalculatorKey(key);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (!calculatorActive) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const key = event.key;
    const validKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "+",
      "-",
      "*",
      "/",
    ];

    if (validKeys.includes(key)) {
      handleCalculatorKey(key);
      event.preventDefault();
      return;
    }

    if (key === "Backspace") {
      handleCalculatorKey("back");
      event.preventDefault();
      return;
    }

    if (key === "Delete") {
      handleCalculatorKey("C");
      event.preventDefault();
      return;
    }

    if (key === "Enter" || key === "=") {
      handleCalculatorKey("=");
      event.preventDefault();
      return;
    }
  });
}

// --- Theme toggle demo ---
const themeBtn = document.getElementById("toggle-theme-btn");
// load saved theme
if (localStorage.getItem("theme") === "dark")
  document.body.classList.add("dark");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark"))
      localStorage.setItem("theme", "dark");
    else localStorage.removeItem("theme");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

if (saveAddressButton) {
  saveAddressButton.addEventListener("click", () => {
    const addressInput = document.getElementById("address");
    const address = addressInput?.value.trim();

    if (!address) {
      showMessage("Lütfen adresinizi girin.", "error");
      return;
    }

    localStorage.setItem("contactAddress", address);
    showMessage("Adresiniz kaydedildi! 📌");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      showMessage("Ad, e-mail ve mesaj alanları zorunludur.", "error");
      return;
    }

    const savedMessages = JSON.parse(
      localStorage.getItem("contactSubmissions") || "[]",
    );
    savedMessages.push({
      name,
      email,
      address,
      message,
      sentAt: new Date().toISOString(),
    });

    localStorage.setItem("contactSubmissions", JSON.stringify(savedMessages));
    contactForm.reset();
    showMessage("Mesajınız kaydedildi ve gönderildi. Teşekkürler! ✅");
  });
}
