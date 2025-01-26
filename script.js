const sidebar = document.querySelector('.sidebar');
const blurInput = document.getElementById('blurInput');

blurInput.addEventListener('input', () => {
  sidebar.style.setProperty('--blur-radius', `${blurInput.value}px`);
});