console.log("✅ Script cargado correctamente!");

// ✅ Registrar persona
document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📥 Intentando registrar persona...");

    const nombre = document.getElementById("nombre").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const fecha = document.getElementById("fecha").value;

    if (!nombre || isNaN(cantidad) || !fecha) {
        alert("Todos los campos son obligatorios");
        return;
    }

    console.log("📤 Enviando datos:", { nombre, cantidad, fecha });

    try {
        const res = await fetch("https://adeudosback-production.up.railway.app/api/personas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, cantidad, fecha })
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        alert("✅ Persona registrada exitosamente!");
        location.reload();
    } catch (error) {
        console.error("❌ Error al registrar:", error);
        alert("Error al registrar persona");
    }
});

// ✅ Obtener personas y llenar el select
async function cargarPersonas() {
    try {
        console.log("🔄 Cargando personas...");
        const res = await fetch("https://adeudosback-production.up.railway.app/api/personas");
        if (!res.ok) throw new Error("Error al obtener personas");

        const personas = await res.json();
        console.log("📥 Personas obtenidas:", personas);

        const select = document.getElementById("personaSelect");
        select.innerHTML = "";

        personas.forEach(persona => {
            const option = document.createElement("option");
            option.value = persona.id;
            option.textContent = `${persona.nombre} - $${persona.cantidad}`;
            select.appendChild(option);
        });

        console.log("✅ Personas cargadas en el select.");
    } catch (error) {
        console.error("❌ Error al cargar personas:", error);
    }
}

// Llamar a la función al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Página cargada, ejecutando `cargarPersonas()`...");
    cargarPersonas();
});

// ✅ Modificar cantidad y guardar historial
document.getElementById("modificarBtn").addEventListener("click", async () => {
    console.log("📥 Intentando modificar persona...");

    const id = document.getElementById("personaSelect").value;
    const cantidad = parseFloat(document.getElementById("modCantidad").value);
    const accion = document.getElementById("accion").value;
    const fecha = new Date().toISOString().split("T")[0];

    if (!id || isNaN(cantidad)) {
        alert("Selecciona una persona y escribe una cantidad válida");
        return;
    }

    console.log("📤 Enviando modificación:", { id, cantidad, accion, fecha });

    try {
        const res = await fetch(`https://adeudosback-production.up.railway.app/api/personas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cantidad, accion, fecha }),
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        alert("✅ Modificación exitosa!");
        location.reload();
    } catch (error) {
        console.error("❌ Error al modificar:", error);
        alert("Error al modificar persona");
    }
});

// ✅ Buscar historial por nombre
document.getElementById("buscarHistorialBtn").addEventListener("click", async () => {
    console.log("🔎 Buscando historial...");

    const nombre = document.getElementById("nombreHistorial").value.trim();
    if (!nombre) {
        alert("Escribe un nombre para buscar el historial");
        return;
    }

    console.log("📤 Consultando historial de:", nombre);

    try {
        const res = await fetch(`https://adeudosback-production.up.railway.app/api/personas/historial/${nombre}`);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const modificaciones = await res.json();
        console.log("📜 Historial obtenido:", modificaciones);

        const historialDiv = document.getElementById("historial");
        historialDiv.innerHTML = "<h3>Historial de Modificaciones</h3>";

        if (modificaciones.length === 0) {
            historialDiv.innerHTML += "<p>No hay modificaciones registradas para esta persona.</p>";
        } else {
            modificaciones.forEach(mod => {
                historialDiv.innerHTML += `<p>${mod.fecha} - ${mod.tipo} $${mod.cantidad}</p>`;
            });
        }

        console.log("✅ Historial cargado correctamente.");
    } catch (error) {
        console.error("❌ Error al obtener historial:", error);
        alert("Error al obtener historial");
    }
});
