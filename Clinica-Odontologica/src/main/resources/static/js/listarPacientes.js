
const tableBody = document.querySelector("#pacienteTable tbody");
const editModal = new bootstrap.Modal(document.getElementById("editModal"));
const editForm = document.getElementById("editForm");
let currentPacienteId;
let currentDomicilioId;

function fetchPacientes() {
  fetch(`paciente/buscartodos`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      tableBody.innerHTML = "";

      data.forEach((paciente, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
              <td>${paciente.id}</td>
              <td>${paciente.apellido}</td>
              <td>${paciente.nombre}</td>
              <td>${paciente.dni}</td>
              <td>${paciente.fechaIngreso}</td>
              <td>${paciente.domicilio.calle}</td>
              <td>${paciente.domicilio.numero}</td>
              <td>${paciente.domicilio.localidad}</td>
              <td>${paciente.domicilio.provincia}</td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="editPaciente(${paciente.id}, '${paciente.apellido}','${paciente.nombre}', '${paciente.dni}', 
                '${paciente.fechaIngreso}', '${paciente.domicilio.id}', '${paciente.domicilio.calle}', '${paciente.domicilio.numero}', '${paciente.domicilio.localidad}', '${paciente.domicilio.provincia}')">Modificar</button>
                <button class="btn btn-danger btn-sm" onclick="deletePaciente(${paciente.id})">Eliminar</button>
              </td>
            `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

editPaciente = function (
  id,
  apellido,
  nombre,
  dni,
  fechaIngreso,
  idDomicilio,
  calle,
  numero,
  localidad,
  provincia
) {
  currentPacienteId = id;
  currentDomicilioId = idDomicilio;
  document.getElementById("editApellido").value = apellido;
  document.getElementById("editNombre").value = nombre;
  document.getElementById("editDni").value = dni;
  document.getElementById("editFecha").value = fechaIngreso;
  document.getElementById("editCalle").value = calle;
  document.getElementById("editNumero").value = numero;
  document.getElementById("editLocalidad").value = localidad;
  document.getElementById("editProvincia").value = provincia;
  editModal.show();
};

editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const apellido = document.getElementById("editApellido").value;
  const nombre = document.getElementById("editNombre").value;
  const dni = document.getElementById("editDni").value;
  const fecha = document.getElementById("editFecha").value;
  const calle = document.getElementById("editCalle").value;
  const numero = document.getElementById("editNumero").value;
  const localidad = document.getElementById("editLocalidad").value;
  const provincia = document.getElementById("editProvincia").value;

  fetch(`paciente/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: currentPacienteId,
      nombre,
      apellido,
      dni,
      fechaIngreso: fecha,
      domicilio: {
        id: currentDomicilioId,
        calle,
        numero,
        localidad,
        provincia,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      alert("Paciente modificado con éxito");
      fetchPacientes();
      editModal.hide();
    })
    .catch((error) => {
      console.error("Error editando paciente:", error);
    });
});

deletePaciente = function (id) {
  if (confirm("¿Está seguro de que desea eliminar este paciente?")) {
    fetch(`paciente/eliminar/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Paciente eliminado con éxito");
        fetchPacientes();
      })
      .catch((error) => {
        console.error("Error borrando paciente:", error);
      });
  }
};

fetchPacientes();
