document.addEventListener("DOMContentLoaded", function () {
  // ======== Navbar & Burger Menu ========
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ======== Keranjang Belanja (Cart) ========
  const cartIcon = document.querySelector(".cart-icon");
  const cartSidebar = document.querySelector(".cart-sidebar");
  const closeCartBtn = document.querySelector(".close-cart-btn");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const cartCountElement = document.querySelector(".cart-count");
  const checkoutBtn = document.querySelector(".checkout-btn");

  let cart = [];

  if (cartIcon && cartSidebar && closeCartBtn) {
    cartIcon.addEventListener("click", () => {
      cartSidebar.classList.add("open");
    });

    closeCartBtn.addEventListener("click", () => {
      cartSidebar.classList.remove("open");
    });
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".menu-card");
      const name = card.querySelector("h3").innerText;
      const priceText = card.querySelector(".price").innerText;
      const price = parseFloat(
        priceText.replace("Rp", "").replace(".", "").replace(",", ".")
      );

      const existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCart();
      showToastNotification("Item berhasil ditambahkan ke keranjang!");
    });
  });

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name} (x${
        item.quantity
      })</span>
                    <span class="item-price">Rp${(
                      item.price * item.quantity
                    ).toLocaleString("id-ID")}</span>
                </div>
                <button class="remove-item-btn" data-index="${index}">✕</button>
            `;
      cartItemsContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    cartTotalElement.innerText = `Rp${total.toLocaleString("id-ID")}`;
    cartCountElement.innerText = cart.reduce(
      (count, item) => count + item.quantity,
      0
    );

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        updateCart();
      });
    });
  }

  function showToastNotification(message) {
    let toast = document.querySelector(".toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.classList.add("toast-notification");
      document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length > 0) {
        alert("Terima kasih! Pesanan Anda sedang diproses.");
        cart = [];
        updateCart();
        cartSidebar.classList.remove("open");
      } else {
        alert("Keranjang Anda kosong. Silakan tambahkan item.");
      }
    });
  }

  // ======== About Section (Reveal Text) ========
  const aboutSection = document.getElementById("about");
  const animatedLines = document.querySelectorAll("#about .animated-line");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animatedLines.forEach((line, index) => {
            line.style.transitionDelay = `${index * 0.2}s`;
            line.classList.add("revealed");
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );

  if (aboutSection) {
    observer.observe(aboutSection);
  }

  // ======== Back to Top Button ========
  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ======== Comments Slider Fungsionalitas ========
  const commentsSlider = document.querySelector(".comments-slider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (commentsSlider && prevBtn && nextBtn) {
    function scrollSlider(direction) {
      const cardWidth =
        commentsSlider.querySelector(".comment-card").offsetWidth + 25;
      if (direction === "prev") {
        commentsSlider.scrollBy({ left: -cardWidth, behavior: "smooth" });
      } else if (direction === "next") {
        commentsSlider.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }

    prevBtn.addEventListener("click", () => scrollSlider("prev"));
    nextBtn.addEventListener("click", () => scrollSlider("next"));
  }

  // ======== Typewriting Effect (Ganti Teks Berulang) PADA JUDUL HERO SECTION ========
  const textArray = [
    "Vanisha Bakery",
    "Dibuat Dengan Bahan Pilihan",
    "Dengan Varian Rasa Berbeda",
  ];
  const heroTitle = document.querySelector(".hero h1");
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    // Teks yang saat ini sedang diolah
    const currentText = textArray[textIndex];

    // Kecepatan mengetik dan menghapus
    let typingSpeed = isDeleting ? 50 : 100;

    // Tampilkan teks dengan kursor
    let displayedText = currentText.substring(0, charIndex);
    heroTitle.innerHTML = displayedText + '<span class="cursor"></span>';

    if (!isDeleting) {
      // Mode Mengetik
      if (charIndex < currentText.length) {
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        // Selesai mengetik, mulai proses menghapus setelah jeda
        typingSpeed = 3000; // Jeda 3 detik setelah selesai mengetik
        isDeleting = true;
        setTimeout(typeWriter, typingSpeed);
      }
    } else {
      // Mode Menghapus
      if (charIndex > 0) {
        charIndex--;
        setTimeout(typeWriter, typingSpeed);
      } else {
        // Selesai menghapus, ganti ke teks berikutnya
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length; // Pindah ke teks berikutnya
        typingSpeed = 500; // Jeda 0.5 detik sebelum mulai mengetik teks baru
        setTimeout(typeWriter, typingSpeed);
      }
    }
  }

  // Mulai fungsi saat halaman dimuat
  if (heroTitle) {
    heroTitle.innerHTML = "";
    typeWriter();
  }
});
