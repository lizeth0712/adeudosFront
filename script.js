const backendURL = "https://adeudosback-production.up.railway.app/api/personas"; // Asegúrate de que sea la URL correcta

// Función para registrar una nueva persona
document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    const nombre = document.getElementById("nombre").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const fecha = document.getElementById("fecha").value;

    if (!nombre || isNaN(cantidad) || !fecha) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const res = await fetch(backendURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, cantidad, fecha }),
        });

        if (res.ok) {
            alert("Persona registrada exitosamente!");
            location.reload(); // Recargar la página para actualizar la lista
        } else {
            const errorData = await res.json();
            alert("Error al registrar: " + (errorData.error || "Intenta de nuevo"));
        }
    } catch (error) {
        alert("Error en la conexión con el servidor");
        console.error("Error:", error);
    }
});

// Función para cargar la lista de personas en el select
async function cargarPersonas() {
    try {
        const res = await fetch(backendURL);
        const personas = await res.json();

        const select = document.getElementById("personaSelect");
        select.innerHTML = ""; // Limpiar antes de agregar nuevos datos

        personas.forEach((p) => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = `${p.nombre} - $${p.cantidad}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar personas:", error);
    }
}

// Función para modificar el adeudo de una persona
document.getElementById("modificarBtn").addEventListener("click", async () => {
    const id = document.getElementById("personaSelect").value;
    const cantidad = parseFloat(document.getElementById("modCantidad").value);
    const accion = document.getElementById("accion").value;

    if (!id || isNaN(cantidad)) {
        alert("Selecciona una persona y escribe una cantidad válida");
        return;
    }

    try {
        const res = await fetch(`${backendURL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cantidad, accion }),
        });

        if (res.ok) {
            alert("Modificación exitosa!");
            location.reload();
        } else {
            const errorData = await res.json();
            alert("Error al modificar: " + (errorData.error || "Intenta de nuevo"));
        }
    } catch (error) {
        alert("Error en la conexión con el servidor");
        console.error("Error:", error);
    }
});

// Cargar la lista de personas al cargar la página
window.onload = cargarPersonas;
