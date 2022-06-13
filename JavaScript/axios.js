const d = document,
  $tabla = d.querySelector(".crud-tabla"),
  $formulario = d.querySelector(".crud-formulario"),
  $titulo = d.querySelector(".crud-titulo"),
  $plantilla = d.getElementById("crud-plantilla").content,
  $fragmento = d.createDocumentFragment();

async function getAll() {
  try {
    let res = await axios.get("http://localhost:5555/santos"),
      json = await res.data;
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

      $tabla.querySelector("tbody").appendChild($fragmento);
    });
  } catch (err) {
    console.log(err.message);
    // let mensaje = err.response.statusText || "Ocurrio un Errorsuco";
    $tabla.insertAdjacentHTML("afterend", `<p><b>${err.message}</b></p>`);
    // $tabla.insertAdjacentHTML(
    // "afterend",
    // `<p><b>Error: ${err.status}: ${mensaje}</b></p>`
    // );
  }
}

d.addEventListener("DOMContentLoaded", getAll);
d.addEventListener("submit", async (e) => {
  if (e.target === $formulario) {
    e.preventDefault();

    if (!e.target.id.value) {
      //Create - POST
      try {
        let opciones = {
            //opciones de axios
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              nombre: e.target.nombre.value,
              constelacion: e.target.constelacion.value,
              armadura: e.target.armadura.value,
            }),
          },
          res = await axios(`http://localhost:5555/santos`, opciones), //opciones son las opciones de la peticion
          json = await res.data;
        // location.reload();
      } catch (err) {
        let mensaje = err.statusText || "Ocurrio un desvergue";
        $formulario.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${mensaje}</b></p>`
        );
        $formulario.insertAdjacentHTML("afterend", err.message);
      } finally {
        $formulario.reset();
      }
    } else {
      //Update - PUT
      try {
        let opciones = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              nombre: e.target.nombre.value,
              constelacion: e.target.constelacion.value,
              armadura: e.target.armadura.value,
            }),
          },
          res = await axios(
            `http://localhost:5555/santos/${e.target.id.value}`,
            opciones
          ), //opciones son las opciones de la peticion
          json = await res.data;
      } catch (err) {
        $formulario.insertAdjacentHTML("afterend", err.message);
      } finally {
        $formulario.reset();
      }
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
  }
  let isDelete = confirm(
    "Seguro que desea borrar el id: " + e.target.dataset.id + "?"
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
        res = await axios(
          `http://localhost:5555/santos/${e.target.dataset.id}`,
          opciones
        ), //opciones son las opciones de la peticion
        json = await res.data;
    } catch (error) {
      $formulario.insertAdjacentHTML("afterend", err.message);
    } finally {
      $formulario.reset();
    }
  }
});
