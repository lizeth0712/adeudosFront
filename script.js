const backendURL = "https://adeudosback-production.up.railway.app/api/personas";

// Llamar a la función al cargar la página
window.addEventListener("DOMContentLoaded", cargarPersonas);
document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("hola")
    const nombre = document.getElementById("nombre").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const fecha = document.getElementById("fecha").value;

    if (!nombre || isNaN(cantidad) || !fecha) {
        alert("Todos los campos son obligatorios");
        return;
    }

    console.log("📤 Enviando datos:", { nombre, cantidad, fecha }); // <-- Verifica que los datos son correctos

    try {
        const res = await fetch("https://adeudosback-production.up.railway.app/api/personas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, cantidad, fecha })
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        alert("Persona registrada exitosamente!");
        location.reload();
    } catch (error) {
        console.error("❌ Error al registrar:", error);
        alert("Error al registrar persona");
    }
});
// ✅ Obtener personas y llenar el select
async function cargarPersonas() {
    try {
        const res = await fetch(`${backendURL}`);
        if (!res.ok) throw new Error("Error al obtener personas");

        const personas = await res.json();
        console.log("📥 Personas obtenidas:", personas); // 🔥 Agregado para depuración

        const select = document.getElementById("personaSelect");
        select.innerHTML = ""; // Limpiar el select antes de agregar opciones

        personas.forEach(persona => {
            const option = document.createElement("option");
            option.value = persona.id;
            option.textContent = `${persona.nombre} - $${persona.cantidad}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error al cargar personas:", error);
    }
}


// ✅ Modificar cantidad y guardar historial
document.getElementById("modificarBtn").addEventListener("click", async () => {
    const id = document.getElementById("personaSelect").value;
    const cantidad = parseFloat(document.getElementById("modCantidad").value);
    const accion = document.getElementById("accion").value;
    const fecha = new Date().toISOString().split("T")[0];

    if (!id || isNaN(cantidad)) {
        alert("Selecciona una persona y escribe una cantidad válida");
        return;
    }

    await fetch(`${backendURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad, accion, fecha }),
    });

    alert("Modificación exitosa!");
    location.reload();
});

// ✅ Buscar historial por nombre
document.getElementById("buscarHistorialBtn").addEventListener("click", async () => {
    const nombre = document.getElementById("nombreHistorial").value.trim();
    const res = await fetch(`${backendURL}/historial/${nombre}`);
    const modificaciones = await res.json();

    const historialDiv = document.getElementById("historial");
    historialDiv.innerHTML = "<h3>Historial de Modificaciones</h3>";

    modificaciones.forEach(mod => {
        historialDiv.innerHTML += `<p>${mod.fecha} - ${mod.tipo} $${mod.cantidad}</p>`;
    });
});


