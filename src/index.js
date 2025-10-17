import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Game from './Game';
import Swal from 'sweetalert2';

let player1 = "", player2 = "", personaje1 = "", personaje2 = "", turno = 1;
let victorias = { jugador1: 0, jugador2: 0 };

const btn_py1 = document.getElementById("btn_py1");
const btn_py2 = document.getElementById("btn_py2");

const fondos = ["bg1","bg2","bg3","bg4","bg5","bg6"].map(id => document.getElementById(id).src);
const cambiarFondoAleatorio = () => {
  const fondo = fondos[Math.floor(Math.random()*fondos.length)];
  document.body.style.background = `url('${fondo}') no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";
};

const actualizarHistorial = () => {
  const h = document.getElementById("historial");
  if(!h) return;
  h.innerHTML = `<h5>Historial de victorias</h5>
    <p>${player1?player1.name:"Jugador 1"}: ${victorias.jugador1}</p>
    <p>${player2?player2.name:"Jugador 2"}: ${victorias.jugador2}</p>`;
};

const actualizarBarras = () => {
  if(!player1||!player2) return;
  const stats = [["vida1","energia1","ki1",player1],["vida2","energia2","ki2",player2]];
  stats.forEach(([v,e,k,p])=>{
    document.getElementById(v).style.width = `${(p.vida/1000)*100}%`; document.getElementById(v).innerText = `${Math.round(p.vida)} Vida`;
    document.getElementById(e).style.width = `${(p.energia/1000)*100}%`; document.getElementById(e).innerText = `${Math.round(p.energia)} Energía`;
    document.getElementById(k).style.width = `${(p.ki/1000)*100}%`; document.getElementById(k).innerText = `${Math.round(p.ki)} Ki`;
  });
};

const posiblesNames = (personaje,accion) => {
  const f = `./public/img/${personaje}`;
  const mapSel = {Veguito:"01",Veguetta:"02",Trunks:"03",Pikoro:"04",Goku:"05",Gohan:"06",Gogueta:"07",Cell:"08",Bocchi:"09",Girl:"10"};
  switch(accion){
    case"seleccion": return [`./public/img/seleccion/${mapSel[personaje]||"01"}.png`,`${f}/seleccion.gif`,`${f}/seleccion.png`];
    case"idle": return [`${f}/idle.gif`,`${f}/base.png`,`${f}/idle.png`];
    case"basico": return [`${f}/ataque1.gif`,`${f}/basico.gif`,`${f}/ataque1.png`,`${f}/basico.png`];
    case"especial": return [`${f}/ataque2.gif`,`${f}/especial.gif`,`${f}/ataque2.png`,`${f}/especial.png`];
    case"semilla": return [`${f}/semilla.gif`,`${f}/curar.gif`,`${f}/semilla.png`,`${f}/curar.png`];
    case"cargar": return [`${f}/cargar.gif`,`${f}/energia.gif`,`${f}/cargar.png`,`${f}/energia.png`];
    case"victoria": return [`${f}/victoria.gif`,`${f}/victory.gif`,`${f}/victoria.png`];
    default: return [`${f}/base.png`];
  }
};

const findAvailableImage = (paths,cb)=>{
  if(!paths||paths.length===0) return cb(null);
  const img = new Image();
  img.onload = ()=>cb(paths[0]);
  img.onerror = ()=>findAvailableImage(paths.slice(1),cb);
  img.src = paths[0];
};

const showImageSwal = (title, personaje, accion, opts={})=>{
  findAvailableImage(posiblesNames(personaje,accion),found=>{
    Swal.fire(Object.assign({
      title, imageUrl:found||`./public/img/${personaje}/base.png`, imageHeight:opts.imageHeight||300,
      background:opts.background||"black", showConfirmButton:opts.showConfirmButton||false, timer:opts.timer||1200
    },opts.swalExtra||{}));
  });
};

const marcarSeleccion = (container,btn)=>{
  document.querySelectorAll(`${container} button`).forEach(b=>b.classList.remove('border','border-4','border-warning'));
  btn.classList.add('border','border-4','border-warning');
};

["#seleccion_personaje_py1","#seleccion_personaje_py2"].forEach((sel,i)=>{
  document.querySelectorAll(sel+" button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const img=btn.querySelector("img"),p=img.title||img.alt;
      if(i===0) personaje1=p; else personaje2=p;
      marcarSeleccion(sel,btn);
      showImageSwal(`Has elegido a ${p}`,p,"seleccion",{timer:1000,showConfirmButton:true});
    });
  });
});

btn_py1.addEventListener("click",()=>{
  const name=document.getElementById("username_py1").value.trim();
  if(!name||!personaje1) return Swal.fire({icon:"warning",title:"Falta nombre o personaje"});
  player1=new Game(name);
  document.getElementById("username1").innerText=name;
  document.getElementById("nombre_personaje1").innerText=personaje1;
  const img1=document.getElementById("img_personaje1");
  img1.onerror=()=>{img1.src=`./public/img/${personaje1}/base.png`;};
  img1.src=`./public/img/${personaje1}/idle.gif`;
});

btn_py2.addEventListener("click",()=>{
  const name=document.getElementById("username_py2").value.trim();
  if(!name||!personaje2) return Swal.fire({icon:"warning",title:"Falta nombre o personaje"});
  player2=new Game(name);
  document.getElementById("username2").innerText=name;
  document.getElementById("nombre_personaje2").innerText=personaje2;
  const img2=document.getElementById("img_personaje2");
  img2.onerror=()=>{img2.src=`./public/img/${personaje2}/base.png`;};
  img2.src=`./public/img/${personaje2}/idle.gif`;
  document.getElementById("seleccion_jugadores").classList.add("d-none");
  document.getElementById("batalla").classList.remove("d-none");
  cambiarFondoAleatorio();
  actualizarHistorial();
  turno=1;
  Swal.fire({title:`${player1.name} empieza el combate`,timer:900,showConfirmButton:false});
  actualizarBarras();
});

const playAction = (atq,def,pers,accion)=>{
  if(!atq||!def) return;
  if((accion==="cargar"&&atq.ki>=1000&&atq.energia>=1000)||(accion==="semilla"&&atq.vida>=1000&&atq.energia>=1000&&atq.ki>=1000))
    return Swal.fire({icon:"info",title:"No puedes hacer eso, ya estás al máximo"});
  showImageSwal(
    accion==="basico"?"Ataque básico":
    accion==="especial"?"Ataque especial":
    accion==="cargar"?"Cargando Ki":
    accion==="semilla"?"Usando Semilla":"Acción",
    pers,accion,{timer:900,showConfirmButton:false}
  );
  setTimeout(()=>{
    let ok=false;
    if(accion==="basico") ok=atq.atk_basic(def);
    else if(accion==="especial") ok=atq.atk_especial(def);
    else if(accion==="semilla") ok=atq.usar_semilla();
    else if(accion==="cargar") {atq.cargar_ki(); ok=true;}
    if(!ok) return Swal.fire({icon:"error",title:"No puedes hacer eso",text:"Te falta energía, Ki o semillas"});
    actualizarBarras();
    if(def.esta_muerto()){
      showImageSwal("¡Victoria!",pers,"victoria",{timer:1200,showConfirmButton:false});
      turno===1?victorias.jugador1++:victorias.jugador2++;
      actualizarHistorial();
      setTimeout(()=>Swal.fire({
        title:`${atq.name} ganó la batalla`,
        text:"¿Quieres una revancha o salir del juego?",
        imageUrl:`./public/img/${pers}/victoria.gif`,
        imageHeight:220,background:"rgba(0,0,0,0.9)",color:"#fff",
        showDenyButton:true,confirmButtonText:" Revancha",denyButtonText:" Salir",
        confirmButtonColor:"#28a745",denyButtonColor:"#d33",allowOutsideClick:false,
        backdrop:`rgba(0,0,0,0.7) url("./public/img/efectos/confetti.gif") center top no-repeat`
      }).then(r=>r.isConfirmed?reiniciarJuego():Swal.fire({title:"¡Gracias por jugar!",text:"Esperamos verte en la próxima batalla ",icon:"info",confirmButtonText:"Salir",background:"black",color:"white"}).then(()=>location.reload())),1300);
    } else turno=turno===1?2:1;
  },900);
};

["atk_basico1","atk_especial1","semilla1","cargarki1","atk_basico2","atk_especial2","semilla2","cargarki2"].forEach(id=>{
  document.getElementById("btn_"+id).addEventListener("click",()=>{
    if((id.endsWith("1")&&turno!==1)||(id.endsWith("2")&&turno!==2))
      return Swal.fire({icon:"info",title:"Es turno del otro jugador"});
    const [p,op,per]=id.endsWith("1")?[player1,player2,personaje1]:[player2,player1,personaje2];
    const act=id.includes("basico")?"basico":id.includes("especial")?"especial":id.includes("semilla")?"semilla":"cargar";
    playAction(p,op,per,act);
  });
});

const reiniciarJuego=()=>{
  player1=player2=personaje1=personaje2="";
  turno=1;
  ["username_py1","username_py2"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("seleccion_jugadores").classList.remove("d-none");
  document.getElementById("batalla").classList.add("d-none");
  document.querySelectorAll("#seleccion_personaje_py1 button,#seleccion_personaje_py2 button").forEach(b=>b.classList.remove('border','border-4','border-warning'));
  document.getElementById("img_personaje1").src="";
  document.getElementById("img_personaje2").src="";
  actualizarBarras();
  cambiarFondoAleatorio();
  actualizarHistorial();
};
