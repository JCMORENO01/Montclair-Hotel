// Variable global para almacenar la habitación seleccionada al abrir el modal
let habitacionSeleccionada = null;

// Cargar reservaciones previas almacenadas en LocalStorage
let reservacionesHotel = JSON.parse(localStorage.getItem("montclair_reservas")) || [];

// Guardar array de reservaciones en LocalStorage
function guardarEnStorage() {
    localStorage.setItem("montclair_reservas", JSON.stringify(reservacionesHotel));
}

// Abrir la ventana modal flotante con los datos de la suite elegida
function abrirModalReserva(nombre, precio) {
    habitacionSeleccionada = { nombre, precio };

    document.getElementById("modal-titulo-habitacion").textContent = nombre;
    document.getElementById("modal-precio-noche").textContent = `Tarifa: $${precio.toFixed(2)} € / noche`;

    // Asignar fechas iniciales de ejemplo
    document.getElementById("modal-check-in").value = "2027-05-24";
    document.getElementById("modal-check-out").value = "2027-05-28";

    // Mostrar modal
    const modal = document.getElementById("modal-reserva");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

// Cerrar la ventana modal flotante
function cerrarModalReserva() {
    const modal = document.getElementById("modal-reserva");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// Inicialización de eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Envío de la barra de disponibilidad superior
    const formDisponibilidad = document.getElementById("form-disponibilidad");
    if (formDisponibilidad) {
        formDisponibilidad.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("⚜ Fechas y disponibilidad confirmadas. Desplázate hacia abajo para elegir tu suite.");
            document.getElementById("habitaciones")?.scrollIntoView({ behavior: "smooth" });
        });
    }

    // 2. Cerrar el modal con el botón de la 'X'
    const btnCerrar = document.getElementById("btn-cerrar-modal");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", cerrarModalReserva);
    }

    // 3. Cerrar el modal al hacer clic en el fondo oscuro
    const modal = document.getElementById("modal-reserva");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target.id === "modal-reserva") {
                cerrarModalReserva();
            }
        });
    }

    // 4. Envío del formulario de la ventana modal
    const formModal = document.getElementById("form-completar-reserva");
    if (formModal) {
        formModal.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre-huesped").value;
            const correo = document.getElementById("correo-huesped").value;
            const checkIn = document.getElementById("modal-check-in").value;
            const checkOut = document.getElementById("modal-check-out").value;

            // Validación de fechas
            if (new Date(checkOut) <= new Date(checkIn)) {
                alert("La fecha de Check-Out debe ser posterior a la fecha de Check-In.");
                return;
            }

            // Calcular noches y total
            const diffDias = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
            const costoTotal = (diffDias * habitacionSeleccionada.precio).toFixed(2);

            const nuevaReserva = {
                id: Date.now(),
                habitacion: habitacionSeleccionada.nombre,
                tarifaNoche: habitacionSeleccionada.precio,
                nombreHuesped: nombre,
                correoHuesped: correo,
                checkIn: checkIn,
                checkOut: checkOut,
                noches: diffDias,
                total: costoTotal
            };

            // Guardar en el array y persistir en LocalStorage
            reservacionesHotel.push(nuevaReserva);
            guardarEnStorage();

            alert(
                `⚜ RESERVA CONFIRMADA - MONTCLAIR GRAND HOTEL ⚜\n\n` +
                `Huésped: ${nombre}\n` +
                `Suite: ${habitacionSeleccionada.nombre}\n` +
                `Estancia: ${diffDias} noche(s)\n` +
                `Total: $${costoTotal} €\n\n` +
                `¡Tu reserva ha sido guardada con éxito en el sistema!`
            );

            formModal.reset();
            cerrarModalReserva();
        });
    }
});