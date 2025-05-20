// Inicializar el almacenamiento de contactos
const contactos = JSON.parse(localStorage.getItem("contactos")) || []

// Elementos DOM
const contactForm = document.getElementById("contactForm")
const errorAlert = document.getElementById("errorAlert")
const errorMessage = document.getElementById("errorMessage")
const successAlert = document.getElementById("successAlert")
const listaContactos = document.getElementById("listaContactos")
const noContactos = document.getElementById("noContactos")

// Función para agregar un campo de teléfono
function agregarTelefono() {
  const telefonosContainer = document.getElementById("telefonos-container")
  const nuevoTelefono = document.createElement("div")
  nuevoTelefono.className = "flex items-center mt-2"
  nuevoTelefono.innerHTML = `
    <input type="tel" name="telefono[]" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Número de teléfono">
    <button type="button" class="ml-2 text-red-600 hover:text-red-800" onclick="eliminarTelefono(this)">
      <i class="fas fa-minus-circle text-xl"></i>
    </button>
  `
  telefonosContainer.appendChild(nuevoTelefono)
}

////// FUNCIONES //////

// Eliminar un campo de teléfono
function eliminarTelefono(boton) {
  boton.parentElement.remove()
}

// Mostrar un mensaje de error
function mostrarError(mensaje) {
  errorMessage.textContent = mensaje
  errorAlert.classList.remove("hidden")

  // Ocultar después de 5 segundos
  setTimeout(() => {
    errorAlert.classList.add("hidden")
  }, 5000)
}

// Mostrar un mensaje de éxito
function mostrarExito() {
  successAlert.classList.remove("hidden")

  // Ocultar después de 3 segundos
  setTimeout(() => {
    successAlert.classList.add("hidden")
  }, 3000)
}

// Guardar contacto
function guardarContacto(contacto) {
  contactos.push(contacto)
  localStorage.setItem("contactos", JSON.stringify(contactos))
  actualizarListaContactos()
  mostrarExito()
  contactForm.reset()

  // Reiniciar los campos de teléfono
  const telefonosContainer = document.getElementById("telefonos-container")
  telefonosContainer.innerHTML = `
    <div class="flex items-center">
      <input type="tel" name="telefono[]" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Número de teléfono">
      <button type="button" class="ml-2 text-emerald-600 hover:text-emerald-800" onclick="agregarTelefono()">
        <i class="fas fa-plus-circle text-xl"></i>
      </button>
    </div>
  `
}

// Actualizar la lista de contactos
function actualizarListaContactos() {
  if (contactos.length === 0) {
    noContactos.classList.remove("hidden")
    listaContactos.innerHTML = ""
    listaContactos.appendChild(noContactos)
    return
  }

  noContactos.classList.add("hidden")
  listaContactos.innerHTML = ""

  contactos.forEach((contacto, index) => {
    const contactoElement = document.createElement("div")
    contactoElement.className = "bg-gray-50 p-4 rounded-lg border border-gray-200"

    // Nombre completo o solo nombre
    let nombreCompleto = contacto.nombre
    if (contacto.apellido) {
      nombreCompleto += ` ${contacto.apellido}`
    }

    // Apodo si existe
    let apodoText = ""
    if (contacto.apodo) {
      apodoText = ` <span class="text-gray-500">(${contacto.apodo})</span>`
    }

    // Categoría si existe
    let categoriaText = ""
    if (contacto.categoria) {
      categoriaText = `<span class="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2">${contacto.categoria}</span>`
    }

    // Teléfonos
    const telefonosText = contacto.telefonos
      .map(
        (tel) =>
          `<div class="flex items-center mt-1">
        <i class="fas fa-phone text-emerald-600 mr-2"></i>
        <span>${tel}</span>
      </div>`,
      )
      .join("")

    // Email si existe
    let emailText = ""
    if (contacto.email) {
      emailText = `
        <div class="flex items-center mt-1">
          <i class="fas fa-envelope text-emerald-600 mr-2"></i>
          <span>${contacto.email}</span>
        </div>
      `
    }

    contactoElement.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold text-lg">${nombreCompleto}${apodoText}</h3>
          <div class="mt-1">${categoriaText}</div>
        </div>
        <button onclick="eliminarContacto(${index})" class="text-red-600 hover:text-red-800">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="mt-3">
        ${telefonosText}
        ${emailText}
      </div>
    `

    listaContactos.appendChild(contactoElement)
  })
}

// Eliminar un contacto
function eliminarContacto(index) {
  if (confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
    contactos.splice(index, 1)
    localStorage.setItem("contactos", JSON.stringify(contactos))
    actualizarListaContactos()
  }
}

// Manejar el envío del formulario/contacto
contactForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Obtener valores del formulario/contacto
  const nombre = document.getElementById("nombre").value.trim()
  const apellido = document.getElementById("apellido").value.trim()
  const apodo = document.getElementById("apodo").value.trim()
  const categoria = document.getElementById("categoria").value
  const email = document.getElementById("email").value.trim()

  // Obtener todos los teléfonos
  const telefonosInputs = document.querySelectorAll('input[name="telefono[]"]')
  const telefonos = Array.from(telefonosInputs)
    .map((input) => input.value.trim())
    .filter((tel) => tel !== "")

  // Validar campos obligatorios
  if (nombre === "") {
    mostrarError("El nombre es obligatorio.")
    return
  }

  if (telefonos.length === 0) {
    mostrarError("Debe ingresar al menos un número de teléfono.")
    return
  }

  // Crear objeto de contacto
  const contacto = {
    nombre,
    apellido,
    apodo,
    categoria,
    telefonos,
    email,
  }

  // Guardar contacto
  guardarContacto(contacto)
})

// Cargar la lista de contactos al iniciar
actualizarListaContactos()