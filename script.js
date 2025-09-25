document.addEventListener("DOMContentLoaded", () => {
    
    // ======================================
    // GLOBAL ELEMENTS
    // ======================================
    // Keranjang
    let cart = JSON.parse(localStorage.getItem('vanisha_bakery_cart')) || [];
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total-price");
    const cartCountElement = document.getElementById("cart-count");
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    
    // Notifikasi
    const toastNotification = document.getElementById("toastNotification");
    
    // Komentar
    const commentsSlider = document.getElementById("commentsSlider") || document.getElementById("slider"); 
    const prevBtn = document.getElementById("prevCommentBtn"); 
    const nextBtn = document.getElementById("nextCommentBtn"); 
    
    // ======================================
    // 1. NAVBAR TOGGLE (Perbaikan Responsivitas)
    // ======================================
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // ======================================
    // 2. COMMENTS SLIDER SCROLL
    // ======================================
    const scrollAmount = 350; 
    
    if (commentsSlider && prevBtn && nextBtn) {
        nextBtn.addEventListener("click", () => {
            commentsSlider.scrollLeft += scrollAmount;
        });

        prevBtn.addEventListener("click", () => {
            commentsSlider.scrollLeft -= scrollAmount;
        });
    }

    // ======================================
    // 3. TOAST NOTIFICATION FUNCTION (BARU)
    // ======================================
    function showToast(message) {
        if (toastNotification) {
            toastNotification.textContent = message;
            toastNotification.classList.add("show");
            
            // Hapus notifikasi setelah 3 detik
            setTimeout(() => {
                toastNotification.classList.remove("show");
            }, 3000);
        }
    }


    // ======================================
    // 4. LOGIKA KERANJANG & ADD TO CART
    // ======================================

    // Fungsi untuk membuka/menutup keranjang (Global)
    window.toggleCart = function (open) {
        if (!cartSidebar) return;
        if (open === true) {
            cartSidebar.classList.add("open");
        } else if (open === false) {
            cartSidebar.classList.remove("open");
        } else {
            cartSidebar.classList.toggle("open");
        }
    };

    // Event listener untuk tombol 'Tambah ke Keranjang'
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const name = e.target.dataset.name;
            const price = parseInt(e.target.dataset.price);

            addItemToCart(name, price);
        });
    });

    // Fungsi menambahkan item ke keranjang
    function addItemToCart(name, price) {
        const existingItemIndex = cart.findIndex((item) => item.name === name);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCartAndRender();
        
        // Panggil Notifikasi saat berhasil ditambahkan
        showToast(`${name} berhasil ditambahkan!`); 
    }

    // Fungsi menghapus item dari keranjang
    function removeItemFromCart(name) {
        const existingItemIndex = cart.findIndex((item) => item.name === name);

        if (existingItemIndex > -1) {
            cart.splice(existingItemIndex, 1);
        }

        saveCartAndRender();
    }

    // Fungsi mengupdate tampilan keranjang
    function renderCart() {
        if (!cartItemsContainer || !cartTotalElement || !cartCountElement) return;
        
        cartItemsContainer.innerHTML = "";
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Keranjang kosong.</p>";
        } else {
            cart.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                const itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");
                itemElement.innerHTML = `
                    <div class="item-info">
                        <div class="item-name">${item.name} (${item.quantity}x)</div>
                        <div class="item-price">Rp ${itemTotal.toLocaleString("id-ID")}</div>
                    </div>
                    <button class="remove-item-btn" data-name="${item.name}">🗑️</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        cartTotalElement.textContent = `Rp ${total.toLocaleString("id-ID")}`;
        cartCountElement.textContent = totalItems;

        // Tambahkan event listener untuk tombol hapus setelah di-render
        document.querySelectorAll(".remove-item-btn").forEach((button) => {
            button.addEventListener("click", (e) => {
                const nameToRemove = e.target.dataset.name;
                removeItemFromCart(nameToRemove);
            });
        });
    }

    // Fungsi menyimpan cart ke Local Storage dan merender
    function saveCartAndRender() {
        localStorage.setItem("vanisha_bakery_cart", JSON.stringify(cart));
        renderCart();
    }
    
    // Inisialisasi keranjang
    renderCart();


    // ======================================
    // 5. BACK TO TOP BUTTON LOGIC
    // ======================================
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        // Fungsi untuk menampilkan/menyembunyikan tombol
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        // Fungsi untuk menggulir halus ke atas saat tombol diklik
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.scrollTo({
                top: 0,
                behavior: 'smooth' 
            });
        });
    }

    // ======================================
    // 6. SCROLL REVEAL LOGIC (Tentang Kami)
    // ======================================
    const revealTargets = document.querySelectorAll('.animated-paragraph');

    if (revealTargets.length > 0) {
        
        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.4 
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        revealTargets.forEach(element => {
            revealObserver.observe(element);
        });
    }
    
});