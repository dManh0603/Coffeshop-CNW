// =====================//
// ---Navbar Active---//
// ====================//
// Lấy đường dẫn của trang hiện thời
var path = window.location.pathname;

// Tìm các phần tử nav-link và thêm 'active' vào phần tử tương ứng với đường dẫn hiện tại
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
            alert(response.result.message)
            if (response.result.role === "user") {
                window.location.href = "/";
            } else {
                console.log("redirect to admin page");
                // window.location.href = "/admin";
            }
        },
        error: function (error) {
            console.log("error:", error.responseJSON.message);
            alert(error.responseJSON.message);
        },
    });
}

let checkLogin = () => {
    if (localStorage.accessToken != null) {
        const ul = document.querySelector("#user-menu");
        const signinEl = document.querySelector("#signin-menu");
        const signupEl = document.querySelector("#signup-menu");
        ul.removeChild(signupEl);
        ul.removeChild(signinEl);

        const signoutString =
            '<li id="signout-menu" ><a class="dropdown-item" onclick="signout()" >Đăng xuất</a></li>';
        const signoutEl = document.createElement("li");
        signoutEl.innerHTML = signoutString;
        ul.appendChild(signoutEl);
    }
};

let signout = () => {
    $.ajax({
        url: "/auth/signout",
        method: "POST",
        contentType: "application/json",
        headers: {
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
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

    if(body.password != body.confirmPassword) {
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

checkLogin();
