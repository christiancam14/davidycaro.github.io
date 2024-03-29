// Fecha final de la cuenta regresiva (ejemplo: 31 de diciembre de 2022)
var countDownDate = new Date("Jun 10, 2023 16:00:00").getTime();

// Actualiza la cuenta regresiva cada segundo
var x = setInterval(function() {

  // Obtiene la fecha y hora actual
  var now = new Date().getTime();

  // Encuentra la distancia entre la fecha actual y la fecha final
  var distance = countDownDate - now;

  // Calcula los días, horas, minutos y segundos
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Muestra la cuenta regresiva en la página
  document.getElementById("countdown").innerHTML = `
    <tr>
        <td>${days}</td>
        <td>${hours}</td>
        <td>${minutes}</td>
        <td>${seconds}</td>
    </tr>
    <tr>
        <td>Días</td>
        <td>Horas</td>
        <td>Minutos</td>
        <td>Segundos</td>
    </tr>
  `;
  

  // Cuando la cuenta regresiva llegue a cero, muestra un mensaje
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "¡Nuestra boda comenzó!";
  }
}, 1000);
