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
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
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
navbarToggler.addEventListener("click", function() {
    // Thêm lớp "selected" cho các nav-link được chọn
    navLinks.forEach(function(navLink) {
        navLink.classList.toggle("selected");
    });
});

// ===================//
// -------MENU-------//
// ==================//
const menuBtns = document.querySelectorAll('.menu-btn button');
// Lấy tất cả các nội dung
const menuContents = document.querySelectorAll('.menushop__coffee--content > div');

// Ẩn tất cả nội dung trừ nút 2
menuContents.forEach((menuContent, index) => {
    if (index !== 1) {
        menuContent.style.display = 'none';
    }
});

// Thiết lập thao tác cho mỗi nút
menuBtns.forEach((menuBtn, index) => {
    menuBtn.addEventListener('click', () => {
        // Ẩn tất cả nội dung
        menuContents.forEach((menuContent) => {
            menuContent.style.display = 'none';
        });

        // Hiển thị nội dung tương ứng với nút được chọn
        menuContents[index].style.display = 'block';

        // Xóa active
        menuBtns.forEach((menuBtn) => {
            menuBtn.classList.remove('active');
        });

        // Thêm active
        menuBtn.classList.add('active');
    });
});