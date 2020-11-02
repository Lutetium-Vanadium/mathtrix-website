let navUl = document.createElement('ul');
navUl.innerHTML =  `<li class="nav-link event-links" id="event-links">
  <a href="#segfault">Events</a>
  <ul class="event-links-dropdown" id="event-links-dropdown">
    <li><a href="#segfault">Segfault</a></li>
    <li><a href="#rhythm-x">Rhythm-X</a></li>
    <li><a href="#abstraction">Abstraction</a></li>
    <li><a href="#maximus">Maximus</a></li>
    <li><a href="#desolate-planet">Desolate Planet</a></li>
  </ul>
</li>
<li class="nav-link"><a href="#schedule">Schedule</a></li>
<li class="nav-link"><a href="#registration">Registration</a></li>
<li class="nav-link"><a href="#contact">Contact</a></li>`;
navUl.className = 'flex';

let events = navUl.querySelector('#event-links');
let dropdown = navUl.querySelector('#event-links-dropdown');

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

const onResize = () => {
    if (window.innerWidth < 650) {
      navUl.remove();
    } else {
      document.querySelector("nav").appendChild(navUl);
    }
}

window.addEventListener('resize', onResize);
onResize();
