// Khi người dùng cuộn trang, kiểm tra vị trí và hiển thị nút khi cần thiết
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
}

// Cuộn trang về đầu trang
function topFunction() {
  console.log('clicked')
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
}

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


