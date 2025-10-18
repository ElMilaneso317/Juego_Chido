import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Game from './Game';
import Swal from 'sweetalert2';

let player1 = "";
let player2 = "";
let personaje1 = "";
let personaje2 = "";
let turno = 1; // 1 = jugador1, 2 = jugador2

// ======== HISTORIAL DE VICTORIAS ========
let victorias = { jugador1: 0, jugador2: 0 };

function actualizarHistorial() {
  const historial = document.getElementById("historial");
  if (!historial) return;
  historial.innerHTML = `
    <h5>Historial de victorias</h5>
    <p>${player1 ? player1.name : "Jugador 1"}: ${victorias.jugador1}</p>
    <p>${player2 ? player2.name : "Jugador 2"}: ${victorias.jugador2}</p>
  `;
}

const btn_py1 = document.getElementById("btn_py1");
const btn_py2 = document.getElementById("btn_py2");

// ======== CAMBIO DE FONDO ALEATORIO ========
function cambiarFondoAleatorio() {
  const fondos = [
    document.getElementById("bg1").src,
    document.getElementById("bg2").src,
    document.getElementById("bg3").src,
    document.getElementById("bg4").src,
    document.getElementById("bg5").src,
    document.getElementById("bg6").src,
  ];

  const fondoAleatorio = fondos[Math.floor(Math.random() * fondos.length)];
  document.body.style.background = `url('${fondoAleatorio}') no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";
}

// ======== FUNCIONES DE IMÁGENES ========
function findAvailableImage(paths, cb) {
  if (!paths || paths.length === 0) return cb(null);
  const img = new Image();
  img.onload = () => cb(paths[0]);
  img.onerror = () => {
    findAvailableImage(paths.slice(1), (found) => cb(found));
  };
  img.src = paths[0];
}

function posiblesNames(personaje, accion) {
  const folder = `./public/img/${personaje}`;
  const list = [];

  switch (accion) {
    case "seleccion":
      list.push(`./public/img/seleccion/${personajeMapSeleccion(personaje)}.png`);
      list.push(`${folder}/seleccion.gif`);
      list.push(`${folder}/seleccion.png`);
      break;

    case "idle":
      list.push(`${folder}/idle.gif`);
      list.push(`${folder}/base.png`);
      list.push(`${folder}/idle.png`);
      break;

    case "basico":
      list.push(`${folder}/ataque1.gif`);
      list.push(`${folder}/basico.gif`);
      list.push(`${folder}/ataque1.png`);
      list.push(`${folder}/basico.png`);
      break;

    case "especial":
      list.push(`${folder}/ataque2.gif`);
      list.push(`${folder}/especial.gif`);
      list.push(`${folder}/ataque2.png`);
      list.push(`${folder}/especial.png`);
      break;

    case "semilla":
      list.push(`${folder}/semilla.gif`);
      list.push(`${folder}/curar.gif`);
      list.push(`${folder}/semilla.png`);
      list.push(`${folder}/curar.png`);
      break;

    case "cargar":
      list.push(`${folder}/cargar.gif`);
      list.push(`${folder}/energia.gif`);
      list.push(`${folder}/cargar.png`);
      list.push(`${folder}/energia.png`);
      break;

    case "victoria":
      list.push(`${folder}/victoria.gif`);
      list.push(`${folder}/victory.gif`);
      list.push(`${folder}/victoria.png`);
      break;

    default:
      list.push(`${folder}/base.png`);
      break;
  }

  return list;
}

function personajeMapSeleccion(personaje) {
  const map = {
    "Veguito": "01",
    "Veguetta": "02",
    "Trunks": "03",
    "Pikoro": "04",
    "Goku": "05",
    "Gohan": "06",
    "Gogueta": "07",
    "Cell": "08",
    "Bocchi": "09",
    "Girl": "10"
  };
  return map[personaje] || "01";
}

function showImageSwal(title, personaje, accion, opts = {}) {
  const paths = posiblesNames(personaje, accion);
  findAvailableImage(paths, (found) => {
    const imageUrl = found || (`./public/img/${personaje}/base.png`);
    Swal.fire(Object.assign({
      title,
      imageUrl,
      imageHeight: opts.imageHeight || 300,
      background: opts.background || "black",
      showConfirmButton: opts.showConfirmButton !== undefined ? opts.showConfirmButton : false,
      timer: opts.timer || 1200
    }, opts.swalExtra || {}));
  });
}

function marcarSeleccion(containerSelector, selectedButton) {
  const botones = document.querySelectorAll(`${containerSelector} button`);
  botones.forEach(b => b.classList.remove('border', 'border-4', 'border-warning'));
  selectedButton.classList.add('border', 'border-4', 'border-warning');
}

// ======== SELECCIÓN DE PERSONAJES ========
document.querySelectorAll("#seleccion_personaje_py1 button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    personaje1 = img.title || img.alt;
    marcarSeleccion("#seleccion_personaje_py1", btn);
    showImageSwal(`Has elegido a ${personaje1}`, personaje1, "seleccion", { timer: 1000, showConfirmButton: true });
  });
});

document.querySelectorAll("#seleccion_personaje_py2 button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    personaje2 = img.title || img.alt;
    marcarSeleccion("#seleccion_personaje_py2", btn);
    showImageSwal(`Has elegido a ${personaje2}`, personaje2, "seleccion", { timer: 1000, showConfirmButton: true });
  });
});

// ======== ACEPTAR JUGADORES ========
btn_py1.addEventListener("click", () => {
  const name = document.getElementById("username_py1").value.trim();
  if (!name || !personaje1) return Swal.fire({ icon: "warning", title: "Falta nombre o personaje" });
  player1 = new Game(name);
  document.getElementById("username1").innerText = name;
  document.getElementById("nombre_personaje1").innerText = personaje1;

  const img1 = document.getElementById("img_personaje1");
  img1.onerror = () => { img1.src = `./public/img/${personaje1}/base.png`; };
  img1.src = `./public/img/${personaje1}/idle.gif`;
});

btn_py2.addEventListener("click", () => {
  const name = document.getElementById("username_py2").value.trim();
  if (!name || !personaje2) return Swal.fire({ icon: "warning", title: "Falta nombre o personaje" });
  player2 = new Game(name);
  document.getElementById("username2").innerText = name;
  document.getElementById("nombre_personaje2").innerText = personaje2;

  const img2 = document.getElementById("img_personaje2");
  img2.onerror = () => { img2.src = `./public/img/${personaje2}/base.png`; };
  img2.src = `./public/img/${personaje2}/idle.gif`;

  document.getElementById("seleccion_jugadores").classList.add("d-none");
  document.getElementById("batalla").classList.remove("d-none");

  cambiarFondoAleatorio();
  actualizarHistorial();

  turno = 1;
  Swal.fire({ title: `${player1.name} empieza el combate`, timer: 900, showConfirmButton: false });
  actualizarBarras();
});

// ======== ACTUALIZAR BARRAS ========
function actualizarBarras() {
  if (!player1 || !player2) return;

  document.getElementById("vida1").style.width = `${(player1.vida / 1000) * 100}%`;
  document.getElementById("energia1").style.width = `${(player1.energia / 1000) * 100}%`;
  document.getElementById("ki1").style.width = `${(player1.ki / 1000) * 100}%`;
  document.getElementById("vida1").innerText = `${Math.round(player1.vida)} Vida`;
  document.getElementById("energia1").innerText = `${Math.round(player1.energia)} Energía`;
  document.getElementById("ki1").innerText = `${Math.round(player1.ki)} Ki`;

  document.getElementById("vida2").style.width = `${(player2.vida / 1000) * 100}%`;
  document.getElementById("energia2").style.width = `${(player2.energia / 1000) * 100}%`;
  document.getElementById("ki2").style.width = `${(player2.ki / 1000) * 100}%`;
  document.getElementById("vida2").innerText = `${Math.round(player2.vida)} Vida`;
  document.getElementById("energia2").innerText = `${Math.round(player2.energia)} Energía`;
  document.getElementById("ki2").innerText = `${Math.round(player2.ki)} Ki`;
}

// ======== ACCIONES ========
function playAction(atacante, defensor, personajeAtacante, accionTipo) {
  if (!atacante || !defensor) return;

  if ((accionTipo === "cargar" && atacante.ki >= 1000 && atacante.energia >= 1000) ||
      (accionTipo === "semilla" && atacante.vida >= 1000 && atacante.energia >= 1000 && atacante.ki >= 1000)) {
    return Swal.fire({ icon: "info", title: "No puedes hacer eso, ya estás al máximo" });
  }

  showImageSwal(
    accionTipo === "basico" ? "Ataque básico" :
    accionTipo === "especial" ? "Ataque especial" :
    accionTipo === "cargar" ? "Cargando Ki" :
    accionTipo === "semilla" ? "Usando Semilla" : "Acción",
    personajeAtacante,
    accionTipo,
    { timer: 900, showConfirmButton: false }
  );

  setTimeout(() => {
    let ok = false;
    if (accionTipo === "basico") ok = atacante.atk_basic(defensor);
    else if (accionTipo === "especial") ok = atacante.atk_especial(defensor);
    else if (accionTipo === "semilla") ok = atacante.usar_semilla();
    else if (accionTipo === "cargar") { atacante.cargar_ki(); ok = true; }

    if (!ok) {
      Swal.fire({ icon: "error", title: "No puedes hacer eso", text: "Te falta energía, Ki o semillas" });
      return;
    }

    actualizarBarras();

    if (defensor.esta_muerto()) {
      showImageSwal("¡Victoria!", personajeAtacante, "victoria", { timer: 1200, showConfirmButton: false });

      // registrar victoria
      if (turno === 1) victorias.jugador1++;
      else victorias.jugador2++;
      actualizarHistorial();

      setTimeout(() => {
        Swal.fire({
          title: ` ${atacante.name} ganó la batalla`,
          text: "¿Quieres una revancha o salir del juego?",
          imageUrl: `./public/img/${personajeAtacante}/victoria.gif`,
          imageHeight: 220,
          background: "rgba(0, 0, 0, 0.9)",
          color: "#fff",
          showDenyButton: true,
          confirmButtonText: " Revancha",
          denyButtonText: " Salir",
          confirmButtonColor: "#28a745",
          denyButtonColor: "#d33",
          allowOutsideClick: false,
          backdrop: `
            rgba(0,0,0,0.7)
            url("./public/img/efectos/confetti.gif")
            center top
            no-repeat
          `,
        }).then((result) => {
          if (result.isConfirmed) {
            reiniciarJuego();
          } else if (result.isDenied) {
            Swal.fire({
              title: "¡Gracias por jugar!",
              text: "Esperamos verte en la próxima batalla ⚔️",
              icon: "info",
              confirmButtonText: "Salir",
              background: "black",
              color: "white",
            }).then(() => location.reload());
          }
        });
      }, 1300);
    } else {
      turno = turno === 1 ? 2 : 1;
    }
  }, 900);
}

// ======== BOTONES ========
document.getElementById("btn_atk_basico1").addEventListener("click", () => {
  if (turno !== 1) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player1, player2, personaje1, "basico");
});

document.getElementById("btn_atk_especial1").addEventListener("click", () => {
  if (turno !== 1) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player1, player2, personaje1, "especial");
});

document.getElementById("btn_semilla1").addEventListener("click", () => {
  if (turno !== 1) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player1, player2, personaje1, "semilla");
});

document.getElementById("btn_cargarki1").addEventListener("click", () => {
  if (turno !== 1) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player1, player2, personaje1, "cargar");
});

document.getElementById("btn_atk_basico2").addEventListener("click", () => {
  if (turno !== 2) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player2, player1, personaje2, "basico");
});

document.getElementById("btn_atk_especial2").addEventListener("click", () => {
  if (turno !== 2) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player2, player1, personaje2, "especial");
});

document.getElementById("btn_semilla2").addEventListener("click", () => {
  if (turno !== 2) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player2, player1, personaje2, "semilla");
});

document.getElementById("btn_cargarki2").addEventListener("click", () => {
  if (turno !== 2) return Swal.fire({ icon: "info", title: "Es turno del otro jugador" });
  playAction(player2, player1, personaje2, "cargar");
});

// ======== REINICIAR JUEGO ========
function reiniciarJuego() {
  player1 = "";
  player2 = "";
  personaje1 = "";
  personaje2 = "";
  turno = 1;

  document.getElementById("username_py1").value = "";
  document.getElementById("username_py2").value = "";

  document.getElementById("seleccion_jugadores").classList.remove("d-none");
  document.getElementById("batalla").classList.add("d-none");

  document.querySelectorAll("#seleccion_personaje_py1 button, #seleccion_personaje_py2 button").forEach(btn => {
    btn.classList.remove('border', 'border-4', 'border-warning');
  });

  document.getElementById("img_personaje1").src = "";
  document.getElementById("img_personaje2").src = "";
  actualizarBarras();

  cambiarFondoAleatorio();
  actualizarHistorial();
}
