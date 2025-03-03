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

document.getElementById("modificarBtn").addEventListener("click", async () => {
    const id = document.getElementById("personaSelect").value;
    const selectedOption = document.getElementById("personaSelect").selectedOptions[0].textContent;
    const nombre = selectedOption.split(" - ")[0];
    const cantidad = parseFloat(document.getElementById("modCantidad").value);
    const accion = document.getElementById("accion").value;
    const fecha = new Date().toISOString().split("T")[0];

    if (!id || isNaN(cantidad) || !nombre) {
        alert("Selecciona una persona y escribe una cantidad válida");
        return;
    }

    console.log("📤 Modificando persona:", { id, cantidad, accion });

    // ✅ 1️⃣ Modificar la persona en la tabla `personas`
    const res = await fetch(`https://adeudosback-production.up.railway.app/api/personas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad, accion })
    });

    if (!res.ok) {
        alert("❌ Error al modificar la persona");
        return;
    }

    console.log("✅ Persona modificada con éxito.");

    // ✅ 2️⃣ Guardar en historial
    console.log("📤 Guardando en historial:", { nombre, tipo: accion, cantidad, fecha });

    await fetch(`https://adeudosback-production.up.railway.app/api/personas/historial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, tipo: accion, cantidad, fecha })
    });

    alert("Modificación guardada en historial!");
    location.reload();
});
