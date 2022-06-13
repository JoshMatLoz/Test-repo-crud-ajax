const d = document,
  $tabla = d.querySelector(".crud-tabla"),
  $formulario = d.querySelector(".crud-formulario"),
  $titulo = d.querySelector(".crud-titulo"),
  $plantilla = d.getElementById("crud-plantilla").content,
  $fragmento = d.createDocumentFragment();

const ajax = (opciones) => {
  let { url, method, succes, error, data } = opciones; //Destructuracion, sabiendo que el elemento que voy a recibir es un objeto
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText); //La respuesta JSON se convierte en objet JS
      succes(json); //Metodo Succes
    } else {
      let mensaje = xhr.statusText || "Ocurrió un Error";
      error(`Error ${xhr.status}: ${mensaje}`);
    }
  });

  xhr.open(method || "GET", url); //Se valida que si no se envia ningun method se ponga GET por default
  xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8"); //Esta cabecera siempre se tiene que agregar
  xhr.send(JSON.stringify(data)); //Se convierte objeto JS en formato JSON
};
const getAllSaints = () => {
  ajax({
    // method: "GET",
    url: "http://localhost:5555/santos",
    succes: (res) => {
      //La respuesta ya trae la informacion
      console.log(res);

      res.forEach((el) => {
        $plantilla.querySelector(".nombre").textContent = el.nombre;
        $plantilla.querySelector(".constelacion").textContent = el.constelacion;
        $plantilla.querySelector(".armadura").textContent = el.armadura;
        $plantilla.querySelector(".editar").dataset.id = el.id;
        $plantilla.querySelector(".editar").dataset.nombre = el.nombre;
        $plantilla.querySelector(".editar").dataset.constelacion =
          el.constelacion;
        $plantilla.querySelector(".editar").dataset.armadura = el.armadura;
        $plantilla.querySelector(".borrar").dataset.id = el.id;

        let $clon = d.importNode($plantilla, true);
        $fragmento.appendChild($clon);
      });

      $tabla.querySelector("tbody").appendChild($fragmento);
    },
    error: (err) => {
      // console.log(err);
      $tabla.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`); //Afuera de la table
    },
    // data: null,
  });
};

d.addEventListener("DOMContentLoaded", getAllSaints);
d.addEventListener("submit", (e) => {
  if (e.target === $formulario) {
    e.preventDefault();

    if (!e.target.id.value) {
      //POST - CREATE
      ajax({
        url: "http://localhost:5555/santos",
        method: "POST",
        succes: (res) => {
          location.reload();
        },
        error: () =>
          $formulario.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
          armadura: e.target.armadura.value,
        },
      });
      $formulario.reset();
    } else {
      //PUT - UPDATE
      ajax({
        url: `http://localhost:5555/santos/${e.target.id.value}`,
        method: "PUT",
        succes: (res) => {
          location.reload();
        },
        error: () =>
          $formulario.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value,
          armadura: e.target.armadura.value,
        },
      });
      $formulario.reset();
    }
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".editar")) {
    $titulo.textContent = "Editemos al Caballero";
    $formulario.nombre.value = e.target.dataset.nombre;
    $formulario.constelacion.value = e.target.dataset.constelacion;
    $formulario.armadura.value = e.target.dataset.armadura;
    $formulario.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".borrar")) {
    let isDelete = confirm(
      `Are you ¿seguro of eliminashion? el id: ${e.target.dataset.id}`
    );

    if (isDelete) {
      //Delete - DELETE
      ajax({
        url: `http://localhost:5555/santos/${e.target.dataset.id}`,
        method: "DELETE",
        succes: (res) => {
          location.reload();
        },
        error: () => alert(err),
      });
      $formulario.reset();
    }
  }
});
