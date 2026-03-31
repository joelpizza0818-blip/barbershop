async function agendarCita(ruta, tipo) {

    const name = document.getElementById('name')?.value;
    const service = document.getElementById('service')?.value;
    const date = document.getElementById('date')?.value;
    const time = document.getElementById('time')?.value;
    const divMensaje = document.getElementById('msg-log');

    if ((tipo === 'Cita' && !name) || !service || !date || !time) {
        divMensaje.style.display = 'block';
        divMensaje.innerText = "⚠️ Por favor, rellena todos los campos.";
        divMensaje.style.backgroundColor = '#fff3cd'; // Color amarillo de advertencia
        divMensaje.style.color = '#856404';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/${ruta}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                service,
                date,
                time,
            }),
        });

        const resultado = await response.json();
        // Mostrar respuesta visual
        divMensaje.style.display = 'block';
        divMensaje.innerText = resultado.mensaje || resultado.error;
        divMensaje.style.backgroundColor = response.ok ? '#d4edda' : '#f8d7da';
        divMensaje.style.color = response.ok ? '#155724' : '#721c24';

    } catch (error) {
        console.log('Error:', error);
        divMensaje.style.display = 'block';
        divMensaje.innerText = "❌ Error de conexión con el servidor.";
        divMensaje.style.backgroundColor = '#f8d7da';
        divMensaje.style.color = '#721c24';
        return;
    }



}