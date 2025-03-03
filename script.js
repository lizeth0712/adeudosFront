const backendURL = "https://adeudosback-production.up.railway.app/api/personas";

// Función para registrar una nueva persona
document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const fecha = document.getElementById("fecha").value;

    const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cantidad, fecha }),
    });

    if (res.ok) {
        alert("Persona registrada!");
        location.reload();
    } else {
        alert("Error al registrar persona.");
    }
});

// Función para cargar la lista de personas en el select
async function cargarPersonas() {
    const res = await fetch(backendURL);
    const personas = await res.json();
    const select = document.getElementById("personaSelect");

    select.innerHTML = "";
    personas.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.nombre} - $${p.cantidad}`;
        select.appendChild(option);
    });
}

// Función para modificar el adeudo de una persona
document.getElementById("modificarBtn").addEventListener("click", async () => {
    const id = document.getElementById("personaSelect").value;
    const cantidad = parseFloat(document.getElementById("modCantidad").value);
    const accion = document.getElementById("accion").value;

    const res = await fetch(`${backendURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad, accion }),
    });

    if (res.ok) {
        alert("Modificación exitosa!");
        location.reload();
    } else {
        alert("Error al modificar la persona.");
    }
});

// Cargar la lista de personas al cargar la página
window.onload = cargarPersonas;
