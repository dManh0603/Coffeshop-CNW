// =====================//
// ---Navbar Active---//
// ====================//
// $('.navbar-nav .nav-link').click(function() {
//   $('.navbar-nav .nav-link').removeClass('xh-active');
//   $(this).addClass('xh-active');
// });

// Lấy đường dẫn của trang hiện thời
var path = window.location.pathname;

//Tìm các phần tử nav-link và thêm 'active' vào phần tử tương ứng với đường dẫn hiện tại
var navbarLinks = document.querySelectorAll(".nav-link");
for (var i = 0; i < navbarLinks.length; i++) {
    var href = navbarLinks[i].getAttribute("href");
    if (href === path) {
        navbarLinks[i].classList.add("active");
    } else {
        navbarLinks[i].classList.remove("active");
    }
}


// =====================//
// ---scrollToTopBtn---//
// ====================//

// Khi cuộn trang, kiểm tra vị trí và hiển thị nút khi cần thiết
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        document.getElementById("scrollToTopBtn").styles.display = "block";
    } else {
        document.getElementById("scrollToTopBtn").styles.display = "none";
    }
}

// Nhấp vào nút, cuộn trang về đầu trang
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// ===================//
// -------BgNav-------//
// ===================//

// Lấy phần tử nút navbar-toggler và danh sách các nav-link
const navbarToggler = document.querySelector(".navbar-toggler");
const navLinks = document.querySelectorAll(".nav-link");

// Thêm sự kiện click vào nút navbar-toggler
navbarToggler.addEventListener("click", function () {
    // Thêm lớp "selected" cho các nav-link được chọn
    navLinks.forEach(function (navLink) {
        navLink.classList.toggle("selected");
    });
});

// ===================//
// -------MENU-------//
// ==================//
const menuBtns = document.querySelectorAll(".menu-btn button");
// Lấy tất cả các nội dung
const menuContents = document.querySelectorAll(
    ".menushop__coffee--content > div"
);

// Ẩn tất cả nội dung trừ nút 2
menuContents.forEach((menuContent, index) => {
    if (index !== 1) {
        menuContent.style.display = "none";
    }
});

// Thiết lập thao tác cho mỗi nút
menuBtns.forEach((menuBtn, index) => {
    menuBtn.addEventListener("click", () => {
        // Ẩn tất cả nội dung
        menuContents.forEach((menuContent) => {
            menuContent.style.display = "none";
        });

        // Hiển thị nội dung tương ứng với nút được chọn
        menuContents[index].style.display = "block";

        // Xóa active
        menuBtns.forEach((menuBtn) => {
            menuBtn.classList.remove("active");
        });

        // Thêm active
        menuBtn.classList.add("active");
    });
});

// ======================//
// -------Dropdown-------//
// ======================//
// Lấy đối tượng dropdown menu
var dropdownMenu = document.getElementById('user-menu');

// Thiết lập chiều cao ban đầu
dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";

// Lắng nghe sự kiện khi click vào dropdown menu
document.getElementById("userDropdown").addEventListener("click", function () {
    if (dropdownMenu.classList.contains("show")) {
        dropdownMenu.style.maxHeight = null;
    } else {
        dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
    }
});

function signin() {
    let body = {};
    const formData = new FormData(document.getElementById("signin__form"));
    formData.forEach((value, key) => {
        body[`${key}`] = value;
    });
    $.ajax({
        url: "/auth/signin",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function (response) {
            localStorage.setItem("accessToken", response.result.accessToken);
            localStorage.setItem("refreshToken", response.result.refreshToken);
            console.log(response.result.message);

            sessionStorage.setItem('user', JSON.stringify({
                "accountId": response.result.accountId,
                "accessToken": response.result.accessToken
            }));

            alert(response.result.message)
            window.location.href = "/";

            // if (response.result.account.role === "user") {
            //     window.location.href = "/";
            // } else {
            //     console.log("redirect to admin page");
            //     // window.location.href = "/admin";
            // }
        },
        error: function (error) {
            console.log("error:", error.responseJSON.message);
            alert(error.responseJSON.message);
        },
    });
}

let checkLogin = () => {
    console.log("Check login()");
    let accessToken = localStorage.accessToken;
    if (accessToken != null) {
        const ul = document.querySelector("#user-menu");
        const signinEl = document.querySelector("#signin-menu");
        const signupEl = document.querySelector("#signup-menu");
        ul.removeChild(signupEl);
        ul.removeChild(signinEl);

        try {
            let accountCookie = document.cookie.split('; ')
                .find(row => row.startsWith('currentUser='))
                .split('=')[1].replace(/25/g, "");

            const account = JSON.parse(decodeURIComponent(accountCookie))
            console.log(account);
            if ("admin" === account.role) {
                const adminWebsiteString = `<li id="user-detail-menu" ><a class="dropdown-item" href="/admin">Admin website</a></li>`;
                const productString = `<li id="dang-san-pham-menu" ><a class="dropdown-item" href="/products/create">Đăng sản phẩm</a></li>`
                const cartString = `<li id="san-pham-cua-toi-menu" ><a class="dropdown-item" href="/admin/stored/products">Sản phẩm của tôi </a></li>`

                const adminWebsiteEl = document.createElement("li");
                const productlEl = document.createElement("li");
                const cartEl = document.createElement("li");

                adminWebsiteEl.innerHTML = adminWebsiteString;
                productlEl.innerHTML = productString;
                cartEl.innerHTML = cartString;

                ul.appendChild(adminWebsiteEl);
                ul.appendChild(productlEl);
                ul.appendChild(cartEl);
            } else {
                const signoutString =
                    `<li id="signout-menu" ><a class="dropdown-item" onclick="signout()" >Đăng xuất</a></li>`;
                const userDetailString =
                    `<li id="user-detail-menu" ><a class="dropdown-item" href="/me/account" >Thông tin cá nhân</a></li>`;
                const passwordString =
                    `<li id="user-detail-menu" ><a class="dropdown-item" href="/forgetpassword" >Thay đổi mật khẩu</a></li>`;
                const userOrderString =
                    `<li id="user-detail-menu" ><a class="dropdown-item" href="/me/orders" >Đơn hàng của tôi</a></li>`;

                const userDetailEl = document.createElement("li");
                const passwordEl = document.createElement("li");
                const signoutEl = document.createElement("li");
                const userOrderEl = document.createElement("li");

                userDetailEl.innerHTML = userDetailString;
                userOrderEl.innerHTML = userOrderString;
                passwordEl.innerHTML = passwordString;
                signoutEl.innerHTML = signoutString;

                ul.appendChild(userOrderEl);
                ul.appendChild(userDetailEl);
                ul.appendChild(passwordEl);
                ul.appendChild(signoutEl);
            }
        } catch (error) {
            console.log(error);
        }


    }
};

let signout = () => {
    let token = localStorage.getItem('accessToken');
    $.ajax({
        url: "/auth/signout",
        method: "POST",
        contentType: "application/json",
        headers: {
            "authorization": `Bearer ${token}`
        },
        success: function (response) {
            console.log(response.result.message);
            // alert("Đăng xuất thành công!")
            alert(response.result.message)
        },
        error: function (error) {
            alert(error.responseJSON.message);
        },
    });
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear();
    window.location.href = "/";
};

function signup() {
    let body = {};
    const formData = new FormData(document.getElementById("signup__form"));
    formData.forEach((value, key) => {
        console.log(key);
        body[`${key}`] = value;
    });

    if (body.password != body.confirmPassword) {
        alert("Mật khẩu không khớp nhau");
        return;
    }

    $.ajax({
        url: "/auth/signup",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function (response) {
            console.log(response);
            // alert(response.message);
            alert(response.result.message)

            window.location.href = "/signin";
        },
        error: function (error) {
            console.log(error);
            alert(error.responseJSON.message);
        },
    });
}


function forgetPassword() {
    let body = {};
    const formData = new FormData(document.getElementById("forgetpassword__form"));
    formData.forEach((value, key) => {
        body[`${key}`] = value;
    });
    console.log(body);
    $.ajax({
        url: "/auth/forgetpassword",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function (response) {
            alert(response.result.message)
            // alert("Quên mật khẩu thành công");
            window.location.href = "/signin";
        },
        error: function (error) {
            console.log(error);
            alert(error.responseJSON.message);
        },
    });
}

function changeUserInfo() {
    let accountCookie = document.cookie.split('; ')
        .find(row => row.startsWith('currentUser='))
        .split('=')[1].replace(/25/g, "");

    const account = JSON.parse(decodeURIComponent(accountCookie))
    console.log(account);
}

function updateAccount() {
    let body = {};
    document.getElementById("user_name").disabled = false
    const formData = new FormData(document.getElementById("user_detail__form"));
    formData.forEach((value, key) => {
        console.log(key);
        body[`${key}`] = value;
    });
    console.log(body);
    $.ajax({
        url: "/auth/update",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function (response) {
            console.log(response);
            alert(response.result.message)
            window.location.href = "/user_detail";
        },
        error: function (error) {
            console.log(error);
            alert(error.responseJSON.message);
        },
    });
}


checkLogin();
