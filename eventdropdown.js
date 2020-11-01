let events = document.getElementById('event-links');
let dropdown = document.getElementById('event-links-dropdown');

events.addEventListener('mouseenter', () => {
  dropdown.style.height = '7rem';
  dropdown.style.boxShadow = '0px 0px 20px 1px #0000001a';
  dropdown.style.opacity = 1;
});

events.addEventListener('mouseleave', () => {
  dropdown.style.height = '0';
  dropdown.style.boxShadow = 'none';
  dropdown.style.opacity = 0;
});
