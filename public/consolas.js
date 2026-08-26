// Mostrar una plataforma y ocultar las demás
function mostrarConsolas(tipo) {

    // Ocultar PlayStation
    document.getElementById("playstation").style.display = "none";

    // Ocultar Xbox
    document.getElementById("xbox").style.display = "none";

    // Ocultar Nintendo
    document.getElementById("nintendo").style.display = "none";


    // Mostrar la plataforma seleccionada
    document.getElementById(tipo).style.display = "block";
}