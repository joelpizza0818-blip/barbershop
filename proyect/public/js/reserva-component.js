class ReservaComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                /* ===== HOST / OVERLAY ===== */
                :host {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    z-index: 1000;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    box-sizing: border-box;
                }

                :host(.active) {
                    display: flex;
                    animation: fadeInOverlay 0.25s ease;
                }

                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ===== MODAL BOX ===== */
                .modal-box {
                    position: relative;
                    background: #1a1f2b;
                    border: 1px solid #D4AF37;
                    border-radius: 16px;
                    padding: 40px 36px 36px;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    scrollbar-width: thin;
                    scrollbar-color: #D4AF37 transparent;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }

                /* ===== CLOSE BUTTON ===== */
                .modal-close {
                    position: absolute;
                    top: 14px;
                    right: 18px;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 1.8rem;
                    line-height: 1;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .modal-close:hover { color: #D4AF37; }

                /* ===== HEADER ===== */
                .modal-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 6px;
                }
                .modal-header svg { color: #D4AF37; flex-shrink: 0; }
                .modal-header h2 {
                    margin: 0;
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.6rem;
                    font-style: italic;
                    font-weight: 700;
                    color: #f6f6f8;
                    letter-spacing: -0.02em;
                }

                .modal-subtitle {
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.95rem;
                    color: #94a3b8;
                    margin: 0 0 28px;
                }

                /* ===== FORM ===== */
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 18px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                label {
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #D4AF37;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                input, select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 8px;
                    color: #f6f6f8;
                    font-family: 'Manrope', sans-serif;
                    font-size: 1rem;
                    padding: 11px 14px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                    appearance: none;
                    -webkit-appearance: none;
                }

                input::placeholder { color: rgba(255,255,255,0.3); }

                input:focus, select:focus {
                    border-color: #D4AF37;
                    background: rgba(212, 175, 55, 0.08);
                }

                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) opacity(0.6);
                    cursor: pointer;
                }

                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    background-size: 18px;
                    padding-right: 38px;
                }

                select option {
                    background: #1a1f2b;
                    color: #f6f6f8;
                }

                /* ===== SUBMIT BUTTON ===== */
                .btn-submit {
                    width: 100%;
                    padding: 14px;
                    background: #D4AF37;
                    color: #111621;
                    border: none;
                    border-radius: 10px;
                    font-family: 'Manrope', sans-serif;
                    font-size: 1rem;
                    font-weight: 700;
                    letter-spacing: 0.03em;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: background 0.2s, transform 0.15s;
                }
                .btn-submit:hover { background: #c49b2a; transform: translateY(-1px); }
                .btn-submit:active { transform: translateY(0); }

                /* ===== MENSAJE ===== */
                .mensaje-cita {
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.95rem;
                    margin-bottom: 12px;
                    line-height: 1.5;
                    display: none;
                }
                .mensaje-cita.exito {
                    display: block;
                    background: rgba(52, 211, 153, 0.12);
                    border: 1px solid rgba(52, 211, 153, 0.4);
                    color: #6ee7b7;
                }
                .mensaje-cita.error {
                    display: block;
                    background: rgba(239, 68, 68, 0.12);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    color: #fca5a5;
                }

                /* ===== PASO INDICADOR ===== */
                .steps-bar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 22px;
                }
                .step-dot {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: 2px solid rgba(212,175,55,0.35);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    transition: all 0.3s;
                }
                .step-dot.active {
                    background: #D4AF37;
                    border-color: #D4AF37;
                    color: #111621;
                }
                .step-dot.done {
                    background: rgba(212,175,55,0.15);
                    border-color: #D4AF37;
                    color: #D4AF37;
                }
                .step-line {
                    flex: 1;
                    height: 2px;
                    background: rgba(212,175,55,0.2);
                    border-radius: 2px;
                    transition: background 0.3s;
                }
                .step-line.done { background: rgba(212,175,55,0.5); }

                /* ===== PANEL COBRO ===== */
                .panel-cobro { display: none; }
                .panel-cobro.visible {
                    display: block;
                    animation: fadeSlide 0.3s ease;
                }
                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateX(18px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .resumen-card {
                    background: rgba(212,175,55,0.06);
                    border: 1px solid rgba(212,175,55,0.25);
                    border-radius: 12px;
                    padding: 16px 18px;
                    margin-bottom: 20px;
                }
                .resumen-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.9rem;
                    color: #94a3b8;
                    padding: 5px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .resumen-row:last-child { border-bottom: none; }
                .resumen-row span:last-child { color: #f6f6f8; font-weight: 600; }
                .resumen-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 14px;
                    padding-top: 12px;
                    border-top: 1px solid rgba(212,175,55,0.25);
                    font-family: 'Manrope', sans-serif;
                }
                .resumen-total .label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #D4AF37;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }
                .resumen-total .precio {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 1.7rem;
                    font-weight: 700;
                    color: #D4AF37;
                }

                .metodo-label {
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #D4AF37;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }
                .metodos-grid {
                    display: grid;
                    grid-template-columns: repeat(3,1fr);
                    gap: 10px;
                    margin-bottom: 22px;
                }
                .metodo-opcion input { display: none; }
                .metodo-opcion label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 8px;
                    background: rgba(255,255,255,0.04);
                    border: 2px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.78rem;
                    color: #94a3b8;
                    font-weight: 600;
                    text-transform: none;
                    letter-spacing: 0;
                }
                .metodo-opcion label:hover { border-color: rgba(212,175,55,0.4); color: #f6f6f8; }
                .metodo-opcion input:checked + label {
                    border-color: #D4AF37;
                    background: rgba(212,175,55,0.1);
                    color: #D4AF37;
                }
                .metodo-icon { font-size: 1.3rem; }

                .btn-volver {
                    background: none;
                    border: none;
                    color: #64748b;
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.85rem;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-bottom: 16px;
                    transition: color 0.2s;
                }
                .btn-volver:hover { color: #D4AF37; }

                .msg-cobro {
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-family: 'Manrope', sans-serif;
                    font-size: 0.95rem;
                    margin-bottom: 12px;
                    line-height: 1.5;
                    display: none;
                }
                .msg-cobro.exito {
                    display: block;
                    background: rgba(52, 211, 153, 0.12);
                    border: 1px solid rgba(52, 211, 153, 0.4);
                    color: #6ee7b7;
                }
                .msg-cobro.error {
                    display: block;
                    background: rgba(239, 68, 68, 0.12);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    color: #fca5a5;
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 500px) {
                    .modal-box { padding: 30px 20px 24px; }
                    .form-row { grid-template-columns: 1fr; }
                    .metodos-grid { grid-template-columns: repeat(3,1fr); }
                }
            </style>

            <div class="modal-box" part="box">
                <button class="modal-close" id="btnCerrar" aria-label="Cerrar">&times;</button>

                <!-- Indicador de pasos -->
                <div class="steps-bar">
                    <div class="step-dot active" id="stepDot1">1</div>
                    <div class="step-line" id="stepLine"></div>
                    <div class="step-dot" id="stepDot2">2</div>
                </div>

                <div class="modal-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        <path d="M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                        <path d="M8.6 8.6l10.4 10.4"/>
                        <path d="M8.6 15.4l10.4 -10.4"/>
                    </svg>
                    <h2>Reservar Cita</h2>
                </div>
                <p class="modal-subtitle">Completa los campos para agendar tu visita</p>

                <form id="formCita">
                    <div class="form-group">
                        <label for="nombreCliente">Nombre completo</label>
                        <input type="text" id="nombreCliente" name="nombre"
                               placeholder="Tu nombre" required />
                    </div>

                    <div class="form-group">
                        <label for="servicio">Servicio</label>
                        <select id="servicio" name="servicio" required>
                            <option  value="" disabled selected>Servicios </option>
                            <option value="corte">✂️ Corte Signature — $45</option>
                            <option value="barba">🪒 Esculpido de Barba — $40</option>
                            <option value="afeitado">💈 Afeitado Clásico — $35</option>
                            <option value="tratamiento">⭐Tratamiento Capilar — $30</option>
                            <option style="color: #D4AF37;" value="" disabled>Servicios VIP </option>
                            <option value="Full">👑 Full Experience — $105</option>
                            <option value="Executive">👨‍💼 The Executive — $75</option>
                            
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="hora">Hora</label>
                            <select id="hora" name="hora" required>
                                <option value="" disabled selected>Selecciona hora</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="09:30">9:30 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="10:30">10:30 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="11:30">11:30 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="12:30">12:30 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="13:30">1:30 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="14:30">2:30 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="15:30">3:30 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="16:30">4:30 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="17:30">5:30 PM</option>
                                <option value="18:00">6:00 PM</option>
                                <option value="18:30">6:30 PM</option>
                                <option value="19:00">7:00 PM</option>
                                <option value="19:30">7:30 PM</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="fechaCita">Día</label>
                            <input type="date" id="fechaCita" name="fecha" required />
                        </div>
                    </div>

                    <div class="mensaje-cita" id="mensajeCita"></div>

                    <button type="submit" class="btn-submit">Siguiente &rarr;</button>
                </form>

                <!-- ===== PANEL DE COBRO ===== -->
                <div class="panel-cobro" id="panelCobro">
                    <button class="btn-volver" id="btnVolver">&#8592; Volver</button>

                    <div class="resumen-card">
                        <div class="resumen-row"><span>Cliente</span><span id="rNombre">—</span></div>
                        <div class="resumen-row"><span>Servicio</span><span id="rServicio">—</span></div>
                        <div class="resumen-row"><span>Fecha</span><span id="rFecha">—</span></div>
                        <div class="resumen-row"><span>Hora</span><span id="rHora">—</span></div>
                    </div>

                    <div class="resumen-total">
                        <span class="label">Total a pagar</span>
                        <span class="precio" id="rPrecio">$0</span>
                    </div>

                    <p class="metodo-label" style="margin-top:20px;">Método de pago</p>
                    <div class="metodos-grid">
                        <div class="metodo-opcion">
                            <input type="radio" name="metodoPago" id="pagoEfectivo" value="efectivo" checked>
                            <label for="pagoEfectivo"><span class="metodo-icon">💵</span>Efectivo</label>
                        </div>
                        <div class="metodo-opcion">
                            <input type="radio" name="metodoPago" id="pagoTarjeta" value="tarjeta">
                            <label for="pagoTarjeta"><span class="metodo-icon">💳</span>Tarjeta</label>
                        </div>
                        <div class="metodo-opcion">
                            <input type="radio" name="metodoPago" id="pagoTransferencia" value="transferencia">
                            <label for="pagoTransferencia"><span class="metodo-icon">🏦</span>Transferencia</label>
                        </div>
                    </div>

                    <div class="msg-cobro" id="msgCobro"></div>

                    <button class="btn-submit" id="btnConfirmarPago">💳 Confirmar Pago</button>
                </div>

            </div>
        `;

        this._bindEvents();
    }

    /** Abre el modal (llamable desde cualquier parte: modal.open()) */
    open() {
        const hoy = new Date().toISOString().split('T')[0];
        this.shadowRoot.getElementById('fechaCita').min = hoy;
        this.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /** Cierra y resetea el modal */
    close() {
        this.classList.remove('active');
        document.body.style.overflow = '';
        this._irAPaso1();
    }

    /** Vuelve al paso 1 (formulario) y resetea todo */
    _irAPaso1() {
        const sr = this.shadowRoot;
        sr.getElementById('formCita').style.display = '';
        sr.getElementById('panelCobro').classList.remove('visible');
        sr.getElementById('formCita').reset();
        sr.getElementById('mensajeCita').className = 'mensaje-cita';
        sr.getElementById('mensajeCita').textContent = '';
        sr.getElementById('msgCobro').className = 'msg-cobro';
        sr.getElementById('msgCobro').textContent = '';
        // Resetear steps
        sr.getElementById('stepDot1').className = 'step-dot active';
        sr.getElementById('stepDot2').className = 'step-dot';
        sr.getElementById('stepLine').className = 'step-line';
    }

    /** Muestra el panel de cobro con los datos del formulario */
    _irAPaso2(datos) {
        const sr = this.shadowRoot;
        const precios = {
            corte: 45, barba: 40, afeitado: 35, tratamiento: 30,
            Full: 105, Executive: 75
        };
        const precio = precios[datos.servicioVal] ?? '?';

        sr.getElementById('rNombre').textContent = datos.nombre;
        sr.getElementById('rServicio').textContent = datos.servicio;
        sr.getElementById('rFecha').textContent = datos.fecha;
        sr.getElementById('rHora').textContent = datos.hora;
        sr.getElementById('rPrecio').textContent = `$${precio}`;

        sr.getElementById('formCita').style.display = 'none';
        sr.getElementById('panelCobro').classList.add('visible');

        // Actualizar steps
        sr.getElementById('stepDot1').className = 'step-dot done';
        sr.getElementById('stepDot1').textContent = '✓';
        sr.getElementById('stepDot2').className = 'step-dot active';
        sr.getElementById('stepLine').className = 'step-line done';
    }

    _bindEvents() {
        // Botón X
        this.shadowRoot.getElementById('btnCerrar').addEventListener('click', () => this.close());

        // Clic fuera del modal-box
        this.addEventListener('click', (e) => {
            if (e.composedPath()[0] === this) this.close();
        });

        // Tecla Escape
        this._onKeydown = (e) => { if (e.key === 'Escape') this.close(); };
        document.addEventListener('keydown', this._onKeydown);

        // PASO 1 → PASO 2: validar formulario y mostrar cobro
        this.shadowRoot.getElementById('formCita').addEventListener('submit', (e) => {
            e.preventDefault();
            const sr = this.shadowRoot;
            const msg = sr.getElementById('mensajeCita');
            const nombre = sr.getElementById('nombreCliente').value.trim();
            const servSel = sr.getElementById('servicio');
            const servicioVal = servSel.value;
            const servicio = servicioVal ? servSel.options[servSel.selectedIndex].text : '';
            const hora = sr.getElementById('hora').value;
            const fecha = sr.getElementById('fechaCita').value;

            if (!nombre || !servicioVal || !hora || !fecha) {
                msg.className = 'mensaje-cita error';
                msg.textContent = '⚠️ Todos los campos son obligatorios.';
                return;
            }

            // Guardar datos para usarlos en el cobro
            this._datosCita = { nombre, servicio, servicioVal, hora, fecha };
            this._irAPaso2(this._datosCita);
        });

        // Botón Volver al paso 1
        this.shadowRoot.getElementById('btnVolver').addEventListener('click', () => {
            this._irAPaso1();
        });

        // PASO 2: Confirmar pago → enviar al servidor
        this.shadowRoot.getElementById('btnConfirmarPago').addEventListener('click', async () => {
            const sr = this.shadowRoot;
            const msg = sr.getElementById('msgCobro');
            const metodoPago = sr.querySelector('input[name="metodoPago"]:checked')?.value ?? 'efectivo';
            const { nombre, servicio, hora, fecha } = this._datosCita;
            const btnPagar = sr.getElementById('btnConfirmarPago');

            btnPagar.disabled = true;
            btnPagar.textContent = 'Procesando...';

            try {
                const respuesta = await fetch('http://localhost:3000/agendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, servicio, hora, fecha, metodoPago })
                });

                await respuesta.json();

                msg.className = 'msg-cobro exito';
                msg.innerHTML = `✅ <strong>¡Pago confirmado!</strong> Tu cita está reservada.`;

                this.dispatchEvent(new CustomEvent('cita-confirmada', {
                    bubbles: true, composed: true,
                    detail: { nombre, servicio, hora, fecha, metodoPago }
                }));

                setTimeout(() => {
                    btnPagar.disabled = false;
                    btnPagar.textContent = '💳 Confirmar Pago';
                    this.close();
                }, 2500);

            } catch (error) {
                msg.className = 'msg-cobro error';
                msg.textContent = '❌ Error al conectar con el servidor. Intenta de nuevo.';
                btnPagar.disabled = false;
                btnPagar.textContent = '💳 Confirmar Pago';
            }
        });
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this._onKeydown);
    }
}

customElements.define('reserva-component', ReservaComponent);