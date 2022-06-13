const d = document,
  $tabla = d.querySelector(".crud-tabla"),
  $formulario = d.querySelector(".crud-formulario"),
  $titulo = d.querySelector(".crud-titulo"),
  $plantilla = d.getElementById("crud-plantilla").content,
  $fragmento = d.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await fetch("http://localhost:5555/santos"); //Se envia la peticion
    json = await res.json(); //una vez recibida la respuesta lo transformaremos en json

    if (!res.ok) throw { status: res.status, statusText: res.statusText }; //Si la respuesta ok es falsa, arroja un objeto para que se pase al cathc como error

    console.log(json);
    json.forEach((el) => {
      $plantilla.querySelector(".nombre").textContent = el.nombre;
      $plantilla.querySelector(".constelacion").textContent = el.constelacion;
      $plantilla.querySelector(".armadura").textContent = el.armadura;
      $plantilla.querySelector(".editar").dataset.id = el.id;
      $plantilla.querySelector(".editar").dataset.nombre = el.nombre;
      $plantilla.querySelector(".editar").dataset.constelacion =
        el.constelacion;
      $plantilla.querySelector(".editar").dataset.armadura = el.armadura;
      $plantilla.querySelector(".borrar").dataset.id = el.id;

      let $clon = d.importNode($plantilla, true); //Se importa la plantilla
      $fragmento.appendChild($clon); //Se agrega la plantilla al fragmento
    });

    $tabla.querySelector("tbody").appendChild($fragmento); //se agrega el fragmento a la tabla
  } catch (err) {
    console.log(err);
    //manejo del error
    let mensaje = err.statusText || "Ocurrió un Errorsuco";
    $tabla.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${err.status}: ${mensaje}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll); //se ejecuta la carga del documento

d.addEventListener("submit", async (e) => {
  if (e.target === $formulario) e.preventDefault();

  if (!e.target.id.value) {
    //Create - POST
    try {
      let opciones = {
          //opciones de fetch
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value,
            armadura: e.target.armadura.value,
          }),
        },
        res = await fetch(`http://localhost:5555/santos`, opciones), //opciones son las opciones de la peticion
        json = await res.json();

      if (!res.ok) throw { status: res.status, statusText: res.statusText }; //Si la respuesta ok es falsa, arroja un objeto para que se pase al catch como error
      location.reload();
    } catch (err) {
      console.log(err);
      //manejo del error
      let mensaje = err.statusText || "Ocurrió un Errorsuco";
      $formulario.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${mensaje}</b></p>`
      );
    } finally {
      $formulario.reset();
    }
  } else {
    //Update - PUT
    try {
      let opciones = {
          //opciones de fetch
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value,
            armadura: e.target.armadura.value,
          }),
        },
        res = await fetch(
          `http://localhost:5555/santos/${e.target.id.value}`,
          opciones
        ), //opciones son las opciones de la peticion
        json = await res.json();

      if (!res.ok) throw { status: res.status, statusText: res.statusText }; //Si la respuesta ok es falsa, arroja un objeto para que se pase al catch como error
      location.reload();
    } catch (err) {
      console.log(err);
      //manejo del error
      let mensaje = err.statusText || "Ocurrió un Errorsuco";
      $formulario.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${mensaje}</b></p>`
      );
    } finally {
      $formulario.reset();
    }
  }
});

d.addEventListener("click", async (e) => {
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
      try {
        let opciones = {
            //opciones de fetch
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          res = await fetch(
            `http://localhost:5555/santos/${e.target.dataset.id}`,
            opciones
          ), //opciones son las opciones de la peticion
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText }; //Si la respuesta ok es falsa, arroja un objeto para que se pase al catch como error
        // location.reload();
      } catch (err) {
        console.log(err);
        //manejo del error
        let mensaje = err.statusText || "Ocurrió un Errorsuco";
        alert(`Erroreishon ${err.status}: ${mensaje}`);
      } finally {
        $formulario.reset();
      }
    }
  }
});
