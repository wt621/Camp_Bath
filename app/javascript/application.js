// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "map"

document.addEventListener('turbo:load', function() {
  const button = document.getElementById('hamburger-button');
  const menu = document.getElementById('hamburger-menu');
  
  if (button && menu) {
    button.addEventListener('click', function() {
      if (menu.style.display === 'none') {
        menu.style.display = 'block';
      } else {
        menu.style.display = 'none';
      }
    });
  }
});