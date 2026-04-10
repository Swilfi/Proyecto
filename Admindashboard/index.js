
var lista = document.querySelectorAll('.nav li');
function activarlink() {
    lista.forEach((item) =>
        item.classList.remove('active'));
    this.classList.add('active');
}

lista.forEach((item) =>
    item.addEventListener('mouseover', activarlink));

/* submenu - click para abrir/cerrar */
var submenuLinks = document.querySelectorAll('.nav li.has-submenu > a');
submenuLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        var parent = this.parentElement;
        parent.classList.toggle('open');
    });
});

/* funcion para mostrar/ocultar el menu */
var toggle = document.querySelector('.toggle');
var nav = document.querySelector('.nav');
var container = document.querySelector('.container');

toggle.onclick = function() {
    nav.classList.toggle('active');
    container.classList.toggle('active');
};