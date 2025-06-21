document.addEventListener("DOMContentLoaded", () => {
    const appContent = document.getElementById("app-content");
    const mainNavTabs = document.getElementById("mainNavTabs");

    // --- Constantes de Comisiones y Tasas ---
    // Comisión para MAKERS (quienes publican anuncios) tanto para COMPRA como VENTA
    const BINANCE_MAKER_FEE_PERCENTAGE = 0.0020; // 0.20%
    const BINANCE_MIN_FEE_USD = 0.05;
    const USD_TO_GS_CONVERSION_RATE = 7500; // Tasa de conversión de USD a Gs para el cálculo de comisión mínima de Binance. Ajustar según la realidad.

    // --- Contenido HTML de las Calculadoras ---
    const calculatorsContentHTML = `
        <div class="calculator-grid fade-in">
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">$</div>
                    <h2 class="card-title">Calculadora de Margen P2P</h2>
                </div>

                <div class="form-group">
                    <label class="form-label" for="capitalDisponible">Capital disponible (Gs)</label>
                    <input type="text" class="form-input" id="capitalDisponible" placeholder="Ej: 1,000,000">
                </div>

                <div class="form-group">
                    <label class="form-label" for="precioCompraUSDT">Precio de Compra de USDT (Gs)</label>
                    <input type="text" class="form-input" id="precioCompraUSDT" placeholder="Ej: 7,300">
                </div>

                <div class="form-group">
                    <label class="form-label" for="precioVentaUSDT">Precio de Venta de USDT (Gs)</label>
                    <input type="text" class="form-input" id="precioVentaUSDT" placeholder="Ej: 7,400">
                </div>

                <button class="btn" id="calcularMargenBtn">Calcular Margen</button>

                <div id="resultadoMargen" class="result-section" style="display: none;">
                    <h3 class="result-title">Resultados de tu Margen:</h3>
                    <div class="result-item">
                        <span class="result-label">Cantidad de USDT comprados:</span>
                        <span class="result-value" id="usdtComprados"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Comisión Binance por Compra:</span>
                        <span class="result-value negative" id="comisionBinanceCompra"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Capital real invertido (Gs):</span>
                        <span class="result-value" id="capitalRealInvertido"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Ingreso bruto por venta (Gs):</span>
                        <span class="result-value" id="ingresoBruto"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Comisión Binance por Venta:</span>
                        <span class="result-value negative" id="comisionBinanceVenta"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Ganancia limpia (Gs):</span>
                        <span class="result-value" id="gananciaNeta"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Porcentaje de ganancia real:</span>
                        <span class="result-value" id="porcentajeGanancia"></span>
                    </div>
                    <div id="mensajeMargen" class="info-box"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon">🎯</div>
                    <h2 class="card-title">Calculadora de Objetivo de Ganancia</h2>
                </div>

                <div class="form-group">
                    <label class="form-label" for="gananciaNetaDeseada">¿Cuánto querés ganar neto? (Gs)</label>
                    <input type="text" class="form-input" id="gananciaNetaDeseada" placeholder="Ej: 100,000">
                </div>

                <div class="form-group">
                    <label class="form-label" for="capitalDisponibleObj">Capital disponible por ciclo (Gs)</label>
                    <input type="text" class="form-input" id="capitalDisponibleObj" placeholder="Ej: 1,000,000">
                </div>

                <div class="form-group">
                    <label class="form-label" for="precioCompraObj">Precio de Compra de USDT (Gs)</label>
                    <input type="text" class="form-input" id="precioCompraObj" placeholder="Ej: 7,300">
                </div>

                <div class="form-group">
                    <label class="form-label" for="margenDeseadoTipo">Margen de ganancia deseado por ciclo (%):</label>
                    <select class="form-select" id="margenDeseadoTipo">
                        <option value="0.005">0.5%</option>
                        <option value="0.01">1.0%</option>
                        <option value="0.015">1.5%</option>
                        <option value="custom">Personalizado</option>
                    </select>
                    <input type="text" class="form-input mt-2" id="margenDeseadoCustom" placeholder="Ej: 0.75 (para 0.75%)" style="display: none;" data-numeric-type="decimal">
                </div>

                <div class="form-group">
                    <label class="form-label" for="diasObjetivo">¿En cuántos días querés alcanzar tu objetivo?</label>
                    <input type="text" class="form-input" id="diasObjetivo" placeholder="Ej: 30">
                </div>

                <button class="btn" id="calcularObjetivoBtn">Calcular Objetivo</button>

                <div id="resultadoObjetivo" class="result-section" style="display: none;">
                    <h3 class="result-title">Plan para tu Objetivo:</h3>
                    <div class="result-item">
                        <span class="result-label">Precio de Venta Sugerido:</span>
                        <span class="result-value" id="precioVentaSugerido"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Volumen total de USDT a mover:</span>
                        <span class="result-value" id="volumenTotalUSDT"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Volumen diario de USDT a vender:</span>
                        <span class="result-value" id="volumenDiarioUSDT"></span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Ganancia limpia estimada por ciclo:</span>
                        <span class="result-value" id="gananciaPorOperacion"></span>
                    </div>
                    <div id="mensajeObjetivo" class="info-box"></div>
                </div>
            </div>
        </div>
    `;

    // --- Contenido de la Guía P2Pedia ---
    const p2pediaContentHTML = `
        <div class="p2pedia-content-wrapper fade-in">
            <div class="p2pedia-sidebar">
                <h3 class="p2pedia-sidebar-title">Artículos</h3>
                <ul class="p2pedia-sidebar-nav" id="p2pediaNav">
                    <li class="p2pedia-nav-item active-p2pedia-nav" data-content="guia-completa">Guía Completa P2P</li>
                    <li class="p2pedia-nav-item" data-content="que-es-usdt">¿Qué es USDT?</li>
                    <li class="p2pedia-nav-item" data-content="comisiones-binance">Comisiones de Binance P2P</li>
                    <li class="p2pedia-nav-item" data-content="seguridad-consejos">Seguridad y Consejos</li>
                    <li class="p2pedia-nav-item" data-content="terminos-comunes">Términos Comunes</li>
                </ul>
            </div>
            <div class="p2pedia-main-content">
                <div class="p2pedia-article-content" id="p2pediaArticleContent">
                    </div>
            </div>
        </div>
    `;

    // --- Contenido de Contacto y FAQ (con estructura de acordeón) ---
    const contactContentHTML = `
        <div class="faq-section fade-in">
            <h2 class="faq-title">Preguntas Frecuentes sobre Binance P2P</h2>

            <div id="faqContainer">
                <div class="faq-item">
                    <div class="faq-question">¿Qué es Binance P2P y cómo funciona?</div>
                    <div class="faq-answer">
                        <p>Binance P2P (peer-to-peer o de persona a persona) es una plataforma de Binance que permite a los usuarios comprar y vender criptomonedas directamente entre sí, sin la necesidad de un intermediario centralizado. A diferencia de los exchanges tradicionales, el comercio P2P facilita el intercambio directo de activos digitales entre individuos. Los usuarios pueden establecer sus propios precios, seleccionar sus contrapartes y elegir entre una amplia variedad de métodos de pago (más de 700) y monedas fiduciarias (más de 100). Para garantizar la seguridad, Binance P2P utiliza un servicio de depósito en custodia, donde las criptomonedas se retienen hasta que ambas partes confirman que la transacción se ha completado satisfactoriamente. Esto reduce el riesgo de fraude y proporciona una capa de protección tanto para compradores como para vendedores.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Cuáles son los principales beneficios de usar Binance P2P?</div>
                    <div class="faq-answer">
                        <p>Binance P2P ofrece varias ventajas significativas para los usuarios que desean comerciar con criptomonedas:</p>
                        <ul>
                            <li><strong>Cero comisiones para takers:</strong> A diferencia de muchos exchanges centralizados, Binance P2P no cobra comisiones a los "takers" (quienes aceptan un anuncio existente), lo que puede resultar en ahorros considerables para los usuarios frecuentes. Los "makers" (quienes publican anuncios) sí pagan una pequeña comisión.</li>
                            <li><strong>Diversidad de métodos de pago:</strong> La plataforma soporta una gran cantidad de opciones de pago, incluyendo transferencias bancarias, billeteras digitales como Mercado Pago, Lemon Cash, Brubank, Ualá, Naranja X, y muchas otras, lo que brinda flexibilidad y comodidad.</li>
                            <li><strong>Transacciones seguras:</strong> El sistema de depósito en custodia de Binance P2P protege a ambas partes al asegurar que los fondos no se liberen hasta que se confirme la recepción del pago, minimizando el riesgo de estafas.</li>
                            <li><strong>Accesibilidad y facilidad de uso:</strong> La plataforma es accesible tanto desde la aplicación móvil como desde el sitio web, y está diseñada para ser intuitiva, facilitando su uso tanto para principiantes como para traders experimentados.</li>
                            <li><strong>Oportunidades de ganancias:</strong> Los usuarios tienen la posibilidad de fijar sus propios precios (como maker), lo que abre la puerta a estrategias como el arbitraje P2P, donde se compran criptomonedas a un precio más bajo y se venden a uno ligeramente más alto para obtener un beneficio.</li>
                            <li><strong>Soporte al cliente 24/7:</strong> Binance ofrece atención al cliente para resolver cualquier problema que pueda surgir durante una transacción P2P, actuando como mediador en caso de disputas.</li>
                        </ul>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Cómo puedo comprar o vender criptomonedas en Binance P2P?</div>
                    <div class="faq-answer">
                        <p>El proceso de compra y venta en Binance P2P es bastante similar, solo que invierte los roles de pago y liberación de criptomonedas:</p>
                        <h3>Para comprar criptomonedas:</h3>
                        <ol>
                            <li>Iniciá sesión en la aplicación o el sitio web de Binance y andá a la sección "Trading P2P".</li>
                            <li>Seleccioná la pestaña "Comprar" y elegí la criptomoneda y moneda fiduciaria que querés usar.</li>
                            <li>Revisá la lista de ofertas, prestando atención al precio, la cantidad disponible y los métodos de pago aceptados por el vendedor. Es recomendable elegir vendedores con alta reputación y tasas de finalización elevadas.</li>
                            <li>Ingresá la cantidad que querés comprar y confirmá la orden.</li>
                            <li>Transferí el pago al vendedor utilizando los datos proporcionados dentro del plazo establecido. Es crucial que el nombre de la cuenta bancaria o del método de pago coincida con tu nombre verificado en Binance.</li>
                            <li>Una vez realizado el pago, hacé clic en "Transferido, Notificar al Vendedor".</li>
                            <li>Esperá a que el vendedor confirme la recepción del pago y libere las criptomonedas a tu billetera de Fondos de Binance.</li>
                        </ol>
                        <h3>Para vender criptomonedas:</h3>
                        <ol>
                            <li>Asegurate de tener las criptomonedas que querés vender en tu billetera de Fondos (si están en Spot, transferilas a Fondos).</li>
                            <li>Andá a la sección "Trading P2P", seleccioná la pestaña "Vender" y elegí la criptomoneda y moneda fiduciaria.</li>
                            <li>Elegí un comprador de la lista, considerando su límite de operación, métodos de pago y reputación.</li>
                            <li>Ingresá la cantidad que querés vender.</li>
                            <li>Agregá o seleccioná el método de pago donde querés recibir los fondos. Es fundamental que la cuenta receptora esté a tu nombre y coincida con tu cuenta verificada de Binance.</li>
                            <li>Esperá a que el comprador te transfiera el dinero a tu cuenta. Siempre verificá que el pago haya llegado a tu cuenta bancaria o billetera y que el nombre del pagador coincida con el nombre del comprador en la orden P2P antes de liberar. Tené cuidado con los comprobantes de pago falsos.</li>
                            <li>Una vez confirmado el pago, hacé clic en "Confirmar liberación" y verificá con tu autenticación de dos factores (2FA) para liberar las criptomonedas al comprador.</li>
                        </ol>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Qué riesgos existen al realizar transacciones P2P y cómo puedo protegerme?</div>
                    <div class="faq-answer">
                        <p>Aunque Binance P2P ha mejorado la seguridad del comercio P2P, persisten ciertos riesgos inherentes a este tipo de transacciones. Es crucial estar informado para protegerse:</p>
                        <ul>
                            <li><strong>Comprobantes de pago o SMS falsos:</strong> Estafadores pueden manipular digitalmente recibos o enviar SMS falsos para simular un pago.
                                <br>Protección: Siempre verificá el pago directamente en tu billetera o cuenta bancaria antes de liberar las criptomonedas. No te fíes solo de capturas de pantalla o notificaciones.</li>
                            <li><strong>Fraude de reverso de cargo:</strong> Un comprador puede revertir el pago después de que le hayas liberado las criptomonedas, especialmente si utiliza cuentas de terceros o métodos de pago que lo permiten fácilmente.
                                <br>Protección: Evitá aceptar pagos de cuentas de terceros. Si sucede, iniciá una apelación inmediatamente en la plataforma.</li>
                            <li><strong>Transferencia equivocada:</strong> Similar al reverso de cargo, un estafador puede alegar que la transacción fue un error para que la reviertas.
                                <br>Protección: Reuní toda la evidencia (capturas de pantalla de la comunicación y la transacción) y no cedas a tácticas de intimidación. Contactá al soporte de Binance.</li>
                            <li><strong>Ataques de intermediario (Man-in-the-Middle):</strong> Un estafador se hace pasar por otra persona (ej. representante de soporte, un inversionista, etc.) para obtener tus activos o información sensible.
                                <br>Protección: Limitate a la comunicación dentro de la plataforma oficial de Binance P2P. Desconfiá de solicitudes comerciales fuera de la plataforma (redes sociales, WhatsApp, Telegram).</li>
                            <li><strong>Estafas de triangulación:</strong> Dos estafadores intentan confundir al vendedor para que libere más criptomonedas de las pagadas.
                                <br>Protección: Siempre verificá que hayas recibido el pago exacto para CADA transacción pendiente en tu cuenta.</li>
                            <li><strong>Phishing:</strong> Intentos de engañarte para que envíes activos o información a través de perfiles o enlaces falsos.
                                <br>Protección: No hagas clic en enlaces desconocidos en correos electrónicos o mensajes. Verificá siempre la fuente y buscá asistencia solo a través de los canales oficiales de Binance.</li>
                        </ul>
                        <h3>Consejos generales de seguridad:</h3>
                        <ul>
                            <li>Comerciá solo en plataformas de buena reputación como Binance, que ofrezcan funciones de seguridad robustas (KYC, depósito en custodia, soporte al cliente).</li>
                            <li>Mantené toda la comunicación y evidencia de la transacción dentro de la plataforma de Binance.</li>
                            <li>Verificá el perfil de los anuncios P2P: cantidad de transacciones, tasa de finalización (idealmente >80%) y comentarios de otros usuarios.</li>
                            <li>Tomá capturas de pantalla de todas las comunicaciones y transacciones como prueba.</li>
                            <li>Bloqueá a usuarios sospechosos para evitar futuras interacciones.</li>
                        </ul>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Qué es la billetera de Fondos en Binance y cuál es su relación con el comercio P2P?</div>
                    <div class="faq-answer">
                        <p>La billetera de Fondos en Binance es un tipo específico de billetera dentro de la plataforma que se utiliza para gestionar los activos relacionados con diversas funciones, incluyendo el comercio P2P, Binance Pay, Binance Gift Card y Binance Pool.</p>
                        <p>Originalmente, Binance tenía una "billetera P2P" separada, pero ahora esta funcionalidad se ha integrado en la billetera de Fondos. Esto significa que cuando comprás criptomonedas a través de Binance P2P, los activos se transfieren directamente a tu billetera de Fondos. De manera similar, si deseás vender criptomonedas en la plataforma P2P, primero debés asegurarte de que los fondos estén en tu billetera de Fondos antes de poder crear una orden de venta o aceptar una oferta.</p>
                        <p>Esta consolidación en la billetera de Fondos simplifica la gestión de activos para las transacciones P2P y otras funcionalidades relacionadas con pagos y ganancias pasivas en Binance.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Cómo puedo agregar nuevos métodos de pago a mi cuenta de Binance P2P?</div>
                    <div class="faq-answer">
                        <p>Binance P2P es compatible con más de 700 métodos de pago y 99 monedas fiduciarias. Podés agregar hasta 20 métodos de pago para el comercio P2P. El proceso es sencillo, tanto en la aplicación móvil como en el sitio web:</p>
                        <h3>En la aplicación de Binance:</h3>
                        <ol>
                            <li>Iniciá sesión en la aplicación de Binance y tocá [Trade] - [P2P].</li>
                            <li>Tocá [Perfil] - [Método de pago].</li>
                            <li>Tocá [Agregar nuevo método de pago] y seleccioná [Todos los métodos de pago].</li>
                            <li>Elegí tu método de pago preferido de las opciones disponibles, confirmá los detalles y tocá [Confirmar].</li>
                            <li>Verificá la solicitud con tu dispositivo 2FA (autenticación de dos factores), y el nuevo método de pago estará disponible de inmediato.</li>
                        </ol>
                        <h3>En el sitio web de Binance:</h3>
                        <ol>
                            <li>Iniciá sesión en tu cuenta de Binance y hacé clic en [Perfil] - [Panel de usuario] - [Pago].</li>
                            <li>Hacé clic en [+ Agregar un método de pago] - [Más]. (También podés ir a [Trade] - [Cuenta P2P] y hacer clic en [Más] - [Método de pago], luego desplazate hasta [Métodos de pago en P2P] y hacé clic en [+ Agregar un método de pago] - [Más]).</li>
                            <li>Seleccioná tu método de pago y confirmá la información, luego hacé clic en [Confirmar].</li>
                            <li>Verificá la solicitud con tu dispositivo 2FA, y el nuevo método de pago estará disponible de inmediato.</li>
                        </ol>
                        <p>Es crucial que la cuenta del método de pago agregado esté a tu nombre, ya que debe coincidir con el nombre de tu cuenta verificada de Binance para cumplir con las políticas de "Conocé a tu Cliente" (KYC).</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Qué sucede si cometo un error durante una transacción P2P, como olvidar marcar una orden como pagada o pagar un monto incorrecto?</div>
                    <div class="faq-answer">
                        <p>Los errores pueden ocurrir, incluso para traders experimentados. Binance P2P tiene mecanismos para abordar algunos de estos problemas:</p>
                        <ul>
                            <li><strong>Olvidar marcar la orden como pagada (comprador):</strong> Si olvidás marcar tu transacción como pagada y superás el límite de tiempo de pago, el sistema de Binance cancelará automáticamente tu orden, y los fondos (criptomonedas) volverán al vendedor.
                                <br>Solución: Debés contactar inmediatamente a tu contraparte a través del chat de la orden cancelada para explicar la situación y solicitar que te devuelvan los fondos. Si no responden, contactá al equipo de atención al cliente de Binance a través del chat en vivo, quienes se comunicarán con el vendedor. Tené en cuenta que una vez que la orden es cancelada y los fondos regresan al vendedor, la devolución depende de la buena voluntad de este.</li>
                            <li><strong>Pagar un importe incorrecto (comprador):</strong> Si enviás un monto incorrecto de moneda fiduciaria al vendedor y marcás la transacción como completada, el vendedor podría no darse cuenta del error.
                                <br>Solución: Contactá a tu contraparte a través del chat de la orden (en la sección "Completadas") para informarle del error y solicitar la devolución del excedente. Incluí la siguiente información en tu mensaje: número de cuenta, importe del reembolso y comprobante de pago. Si no obtenés respuesta, contactá al soporte de Binance para que te asistan.</li>
                        </ul>
                        <p>En ambos casos, es vital mantener la calma, documentar todo con capturas de pantalla y contactar tanto a la contraparte como al soporte de Binance lo antes posible. La plataforma de Binance solo se encarga de las transacciones con criptomonedas y no tiene la obligación de resolver disputas que surjan de pagos completados fuera de su control, aunque sí facilita la comunicación y mediación.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Puedo obtener beneficios con Binance P2P?</div>
                    <div class="faq-answer">
                        <p>Sí, es posible obtener beneficios con Binance P2P, principalmente a través de una estrategia conocida como "arbitraje P2P" o convirtiéndose en un "comerciante P2P".</p>
                        <h3>Arbitraje P2P:</h3>
                        <p>Este modelo de ganancia consiste en:</p>
                        <ul>
                            <li>Comprar criptomonedas (como USDT, que es estable y líquido) de un vendedor a una tasa ligeramente más baja.</li>
                            <li>Vender esas mismas criptomonedas a otro comprador a una tasa ligeramente más alta. La diferencia entre el precio de venta y el precio de compra, multiplicada por la cantidad, constituye tu beneficio. Esta operación se puede repetir varias veces al día. Para encontrar oportunidades, se recomienda buscar comerciantes verificados con precios más bajos para la compra y usuarios que ofrezcan precios más altos para la venta. Los precios pueden fluctuar más durante las caídas o subidas del mercado, lo que genera más oportunidades.</li>
                        </ul>
                        <h3>Comerciante P2P:</h3>
                        <p>Después de realizar un número significativo de operaciones exitosas (por ejemplo, más de 20), podés solicitar convertirte en un "comerciante P2P" oficial de Binance. Como comerciante, tenés la capacidad de establecer tus propias tasas de compra/venta publicando anuncios. Esto te brinda mayor control sobre los precios y, al ganar la confianza de la comunidad (a través de buenas calificaciones y un historial de operaciones sólido), podés atraer más operaciones y, en consecuencia, mayores ganancias. Los comerciantes P2P juegan un papel clave en proporcionar liquidez al mercado.</p>
                        <p class="info-box highlight">Para maximizar los beneficios y operar de forma segura, es crucial seguir las mejores prácticas de seguridad, como solo liberar fondos una vez que el pago esté confirmado en tu cuenta, usar el chat en la aplicación para comunicarte y evitar solicitudes de pago o comunicación fuera de la plataforma.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">¿Qué es un "maker" y un "taker" en el contexto de Binance P2P?</div>
                    <div class="faq-answer">
                        <p>En el contexto del comercio P2P de Binance, los términos "maker" y "taker" se refieren a los roles que los usuarios asumen en las transacciones:</p>
                        <ul>
                            <li><strong>Maker (Creador de anuncios):</strong> Un maker es un usuario que crea y publica un anuncio de compra o venta en la plataforma de Binance P2P. Son quienes "hacen" el mercado al establecer sus propios precios, cantidades, límites de orden y métodos de pago preferidos. Los makers deben tener un apodo en Binance para poder operar. Son esenciales para proporcionar liquidez al mercado P2P. Los makers son quienes pagan una comisión a Binance por la publicación de sus anuncios, tanto si es una orden de compra como de venta.</li>
                            <li><strong>Taker (Tomador de anuncios):</strong> Un taker es un usuario que "toma" o acepta un anuncio existente publicado por un maker. Es decir, son quienes compran o venden activos utilizando las ofertas ya disponibles en la plataforma. Los takers generalmente no pagan comisiones a Binance por las transacciones en la plataforma P2P.</li>
                        </ul>
                        <p>Entender la diferencia entre makers y takers es importante para comprender cómo funciona el mercado P2P y para identificar las oportunidades de comercio, especialmente si se busca convertirse en un comerciante P2P para establecer los propios precios (maker).</p>
                    </div>
                </div>
            </div>

            <div class="contact-info">
                <p>¿Tenés más preguntas o querés contactarnos?</p>
                <p>Envíanos un correo a: <a href="mailto:juama_93@outlook.com">juama_93@outlook.com</a></p>
                <p>Contacta por Telegram: <a href="https://t.me/Datpyg" target="_blank">@Datpyg</a></p>
                <p>Mi ID de Binance para soporte o donaciones (USDT): <strong>22522027</strong></p>
                <p class="info-box highlight">Si esta herramienta te ha sido útil, cualquier pequeña donación es bienvenida y nos motiva a seguir mejorando. ¡Gracias por tu apoyo!</p>
            </div>
        </div>
    `;

    // --- Datos de la P2Pedia ---
    const p2pediaArticles = {
        'guia-completa': {
            title: 'Guía Completa para Operar en Binance P2P en Paraguay',
            content: `
                <p>El comercio P2P (Peer-to-Peer) en Binance te permite comprar y vender criptomonedas directamente con otros usuarios, utilizando métodos de pago locales como transferencias bancarias o pagos móviles. Es una forma popular y flexible de operar para usuarios en Paraguay.</p>
                <h3>¿Cómo funciona?</h3>
                <ol>
                    <li><strong>Publicar un Anuncio:</strong> Como comerciante (maker), publicas un anuncio indicando el precio al que quieres comprar o vender, la cantidad de USDT, el método de pago y tus límites (mínimo y máximo por operación).</li>
                    <li><strong>Esperar una Orden:</strong> Un comprador o vendedor que vea tu anuncio y esté de acuerdo con tus términos, abrirá una orden.</li>
                    <li><strong>Procesar el Pago:</strong> Si vendes, el comprador te envía los Guaraníes a tu cuenta bancaria. Si compras, tú envías los Guaraníes al vendedor.</li>
                    <li><strong>Liberar las Criptos:</strong> Una vez confirmado el pago, liberas las criptomonedas al comprador (si vendes) o el vendedor te libera las criptomonedas (si compras). ¡Binance actúa como un custodio para asegurar la transacción!</li>
                </ol>
                <h3>Ventajas del P2P para Paraguayos</h3>
                <ul>
                    <li><strong>Uso de Gs:</strong> Permite operar directamente con la moneda local (Guaraníes).</li>
                    <li><strong>Flexibilidad de Pagos:</strong> Acepta diversos métodos de pago locales como transferencias bancarias (Vision, Itaú, Continental, etc.), Tigo Money, etc.</li>
                    <li><strong>Control de Precios:</strong> Puedes fijar tus propios precios, lo que es clave para tu margen de ganancia.</li>
                    <li><strong>Comisiones Transparentes:</strong> Binance cobra una pequeña comisión a quienes publican anuncios (makers), tanto al comprar como al vender, lo cual ya está integrado en nuestra calculadora.</li>
                </ul>
                <h3>Consejos Clave</h3>
                <ul>
                    <li><strong>Precios Competitivos:</strong> Usa nuestra calculadora para asegurarte de que tus precios sean atractivos pero rentables.</li>
                    <li><strong>Atención al Cliente:</strong> Ofrece un servicio rápido y amigable.</li>
                    <li><strong>Seguridad:</strong> Verifica siempre los datos del pago antes de liberar criptomonedas.</li>
                </ul>
            `
        },
        'que-es-usdt': {
            title: '¿Qué es USDT y por qué es importante en P2P?',
            content: `
                <p>USDT (Tether) es la stablecoin más popular del mundo. Una stablecoin es una criptomoneda diseñada para mantener un valor estable, generalmente anclada a una moneda fiduciaria como el dólar estadounidense. En el caso de USDT, 1 USDT debería valer siempre aproximadamente 1 USD.</p>
                <h3>¿Por qué se usa tanto en P2P?</h3>
                <ul>
                    <li><strong>Estabilidad:</strong> Al mantener su valor estable, USDT reduce la volatilidad asociada con otras criptomonedas como Bitcoin o Ethereum. Esto la hace ideal para el comercio, ya que no tienes que preocuparte por grandes fluctuaciones de precio mientras tu operación está en curso.</li>
                    <li><strong>Facilidad de Intercambio:</strong> Es la puerta de entrada principal para comprar y vender otras criptomonedas. Puedes comprar USDT con Guaraníes y luego usar ese USDT para comprar cualquier otra criptomoneda en Binance.</li>
                    <li><strong>Liquidez:</strong> USDT tiene una enorme liquidez, lo que significa que siempre hay compradores y vendedores disponibles, facilitando las transacciones P2P.</li>
                    <li><strong>Referencia de Precios:</strong> Los comerciantes P2P en Paraguay suelen usar el precio del dólar (USD) como referencia para fijar sus precios de compra y venta de USDT en Guaraníes.</li>
                </ul>
                <h3>Puntos a Considerar</h3>
                <ul>
                    <li>Aunque se considera 1:1 con el USD, puede haber ligeras variaciones de precio en el mercado, especialmente en plataformas P2P debido a la oferta y demanda local.</li>
                    <li>Es fundamental asegurarse de comprar USDT de fuentes confiables y en plataformas seguras como Binance para evitar estafas.</li>
                </ul>
            `
        },
        'comisiones-binance': {
            title: 'Comisiones de Binance P2P: Lo que debes saber',
            content: `
                <p>Es crucial entender las comisiones de Binance P2P para calcular correctamente tu ganancia neta. Binance cobra una pequeña comisión a los usuarios que actúan como "makers", es decir, aquellos que publican anuncios de compra o venta.</p>
                <h3>Comisión para "Makers" (quienes publican anuncios)</h3>
                <p>Si eres tú quien publica un anuncio (ya sea para comprar o vender criptomonedas), Binance te cobrará una comisión.</p>
                <ul>
                    <li><strong>Comisión Estándar:</strong> La comisión es del <strong>0.20%</strong> del valor de la transacción. Esto aplica tanto para la compra como para la venta.</li>
                    <li><strong>Comisión Mínima:</strong> Si el 0.20% del valor de la transacción es muy bajo, Binance aplica una comisión mínima de <strong>0.05 USD</strong>. Esta cantidad se convierte a Guaraníes al tipo de cambio actual de Binance para la liquidación. Nuestra calculadora ya considera esta regla.</li>
                </ul>
                <h3>Ejemplo Práctico de Comisión de Compra (si eres maker):</h3>
                <p>Si usas Gs 1,000,000 para comprar USDT (publicando un anuncio), la comisión se calcula sobre ese monto.</p>
                <ul>
                    <li><strong>Cálculo 0.20%:</strong> 0.20% de Gs 1,000,000 = Gs 2,000.</li>
                    <li><strong>Cálculo Mínimo (ej. 0.05 USD a 7,500 Gs/USD):</strong> 0.05 USD * 7,500 Gs/USD = Gs 375.</li>
                </ul>
                <p>En este caso, Binance te cobrará Gs 2,000 por tu operación de compra porque es mayor que la comisión mínima.</p>

                <h3>Ejemplo Práctico de Comisión de Venta (si eres maker):</h3>
                <p>Si vendes 100 USDT a un precio de Gs 7,500 por USDT, tu ingreso bruto es Gs 750,000.</p>
                <ul>
                    <li><strong>Cálculo 0.20%:</strong> 0.20% de Gs 750,000 = Gs 1,500.</li>
                    <li><strong>Cálculo Mínimo (ej. 0.05 USD a 7,500 Gs/USD):</strong> 0.05 USD * 7,500 Gs/USD = Gs 375.</li>
                </ul>
                <p>En este caso, Binance te cobrará Gs 1,500 por tu operación de venta porque es mayor que la comisión mínima.</p>

                <h3>Para "Takers" (quienes toman anuncios existentes)</h3>
                <p>Si tú no publicas un anuncio, sino que respondes a un anuncio ya existente de otro usuario (actúas como "taker"), Binance generalmente no te cobra comisiones.</p>

                <p class="info-box highlight"><strong>Importante:</strong> Las comisiones de Binance son solo una parte de tus costos. ¡Recuerda considerar también los costos bancarios o de tu método de pago y el tiempo invertido!</p>
            `
        },
        'seguridad-consejos': {
            title: 'Seguridad y Consejos Clave para Operar en P2P',
            content: `
                <p>La seguridad es primordial en el comercio P2P. Sigue estos consejos para protegerte y asegurar transacciones exitosas:</p>
                <h3>Para Vendedores (cuando vendes USDT y recibes Gs):</h3>
                <ul>
                    <li><strong>¡Verifica SIEMPRE el Pago!</strong> Antes de liberar los USDT, confirma que el dinero ha llegado a tu cuenta bancaria o método de pago. NO confíes solo en capturas de pantalla o notificaciones del comprador. Accede a tu banca en línea o app.</li>
                    <li><strong>Nombres Coincidentes:</strong> Asegúrate de que el nombre del remitente del pago coincida exactamente con el nombre de la cuenta verificada de Binance del comprador. Si no coincide, NO liberes y contacta al soporte de Binance.</li>
                    <li><strong>Montos Exactos:</strong> Confirma que el monto recibido sea exactamente el mismo que el de la orden de Binance.</li>
                    <li><strong>No Libres Antes de Tiempo:</strong> Nunca liberes las criptomonedas hasta que el dinero esté efectivamente en tu cuenta y sea visible.</li>
                    <li><strong>Comunicación Clara:</strong> Mantén una comunicación profesional y clara con el comprador a través del chat de la orden de Binance.</li>
                </ul>
                <h3>Para Compradores (cuando compras USDT y envías Gs):</h3>
                <ul>
                    <li><strong>Envía el Monto Exacto:</strong> Transfiere el monto exacto indicado en la orden de Binance al vendedor.</li>
                    <li><strong>Usa el Método de Pago Acordado:</strong> Utiliza únicamente el método de pago que el vendedor ha especificado en el anuncio.</li>
                    <li><strong>Captura de Pantalla:</strong> Toma una captura de pantalla del comprobante de pago una vez realizado y súbela al chat de la orden.</li>
                    <li><strong>Marca como Pagado:</strong> Una vez que hayas enviado el dinero, marca la orden como "Transferido, notificar al vendedor" en Binance.</li>
                    <li><strong>Sé Paciente:</strong> Dale tiempo al vendedor para verificar el pago antes de liberar las criptomonedas.</li>
                </ul>
                <h3>Consejos Generales:</h3>
                <ul>
                    <li><strong>No Operes Fuera de Binance:</strong> Nunca realices transacciones o comunicaciones fuera de la plataforma de Binance. Esto te deja sin protección si hay un problema.</li>
                    <li><strong>Soporte de Binance:</strong> Si surge algún problema o disputa, utiliza el botón "Apelar" en la orden para que el soporte de Binance intervenga.</li>
                    <li><strong>Reputación:</strong> Presta atención a la reputación de los comerciantes (número de órdenes completadas y porcentaje de éxito) antes de abrir una orden con ellos.</li>
                    <li><strong>Fraudes Comunes:</strong> Ten cuidado con pagos de terceros (cuando el nombre del remitente no coincide), pagos falsos o solicitudes de envío de cripto a direcciones externas.</li>
                </ul>
            `
        },
        'terminos-comunes': {
            title: 'Términos Comunes en el Mundo P2P',
            content: `
                <p>Familiarízate con estos términos para operar como un experto en Binance P2P:</p>
                <ul>
                    <li><strong>P2P (Peer-to-Peer):</strong> Comercio directo entre usuarios sin intermediarios centrales.</li>
                    <li><strong>Maker (Hacedor):</strong> Un usuario que publica un anuncio de compra o venta en la plataforma P2P. Eres un "Maker" cuando creas tu propio anuncio y, por lo tanto, quien paga comisión a Binance.</li>
                    <li><strong>Taker (Tomador):</strong> Un usuario que "toma" o acepta un anuncio existente en la plataforma P2P. Eres un "Taker" cuando respondes a un anuncio, y generalmente no pagas comisión a Binance.</li>
                    <li><strong>USDT (Tether):</strong> Una stablecoin cuyo valor está ligado al dólar estadounidense (1 USDT ≈ 1 USD).</li>
                    <li><strong>Fiat:</strong> Moneda fiduciaria, como el Guaraní (Gs) en Paraguay o el Dólar (USD).</li>
                    <li><strong>Cripto:</strong> Abreviatura de criptomoneda.</li>
                    <li><strong>Orden:</strong> Una solicitud de compra o venta de criptomonedas en la plataforma.</li>
                    <li><strong>Liberar (Release):</strong> Acción de enviar las criptomonedas al comprador una vez que has confirmado la recepción del pago.</li>
                    <li><strong>Arbitraje:</strong> Estrategia de comprar un activo en un mercado y venderlo inmediatamente en otro a un precio más alto para obtener una ganancia. En P2P, podría ser comprar USDT en un banco y venderlo en otro.</li>
                    <li><strong>KYC (Know Your Customer):</strong> Proceso de verificación de identidad que las plataformas como Binance requieren para cumplir con regulaciones.</li>
                    <li><strong>AML (Anti-Money Laundering):</strong> Medidas para prevenir el lavado de dinero.</li>
                    <li><strong>Custodia (Escrow):</strong> Binance retiene las criptomonedas en una cuenta segura hasta que ambas partes confirman la transacción, garantizando la seguridad.</li>
                    <li><strong>Monto Mínimo/Máximo:</strong> Los límites de Gs o USDT que un anunciante P2P establece para cada operación.</li>
                    <li><strong>Método de Pago:</strong> La forma en que se enviará o recibirá el dinero (ej., transferencia bancaria, Tigo Money).</li>
                </ul>
            `
        }
    };


    // --- Funciones de Lógica y UI ---

    // Función para formatear números a Gs (Guaraníes)
    function formatGs(number) {
        if (isNaN(number) || number === null) return 'N/A';
        return `Gs ${new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(number))}`;
    }

    // Función para formatear porcentajes
    function formatPercentage(number) {
        if (isNaN(number) || number === null) return 'N/A';
        return `${(number * 100).toFixed(2)}%`;
    }

    // Función para calcular la comisión de Binance para MAKERS (compra o venta)
    function calculateBinanceMakerFee(amountInGs) {
        if (amountInGs <= 0) return 0;
        const feePercentageInGs = amountInGs * BINANCE_MAKER_FEE_PERCENTAGE;
        const minFeeInGs = BINANCE_MIN_FEE_USD * USD_TO_GS_CONVERSION_RATE;
        return Math.max(feePercentageInGs, minFeeInGs);
    }

    // --- Funciones para la Calculadora de Margen ---
    function calculateMargin() {
        // Parse values by removing formatting
        const capitalDisponible = parseFloat(document.getElementById('capitalDisponible').value.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const precioCompraUSDT = parseFloat(document.getElementById('precioCompraUSDT').value.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const precioVentaUSDT = parseFloat(document.getElementById('precioVentaUSDT').value.replace(/\./g, '').replace(/,/g, '.')) || 0;

        if (capitalDisponible <= 0 || precioCompraUSDT <= 0 || precioVentaUSDT <= 0) {
            alert('Por favor, ingresa valores positivos para todos los campos de la Calculadora de Margen.');
            document.getElementById('resultadoMargen').style.display = 'none';
            return;
        }

        if (precioVentaUSDT <= precioCompraUSDT) {
            alert('El precio de venta debe ser mayor que el precio de compra para obtener una ganancia.');
            document.getElementById('resultadoMargen').style.display = 'none';
            return;
        }

        const usdtComprados = capitalDisponible / precioCompraUSDT;

        // Comisión por la compra (si publicas un anuncio de compra)
        const comisionBinanceCompra = calculateBinanceMakerFee(capitalDisponible);
        const capitalRealInvertido = capitalDisponible + comisionBinanceCompra; // Tu costo total por la compra

        const ingresoBruto = usdtComprados * precioVentaUSDT;
        // Comisión por la venta (si publicas un anuncio de venta)
        const comisionBinanceVenta = calculateBinanceMakerFee(ingresoBruto);

        const gananciaNeta = ingresoBruto - capitalDisponible - comisionBinanceCompra - comisionBinanceVenta;
        const porcentajeGanancia = (gananciaNeta / capitalRealInvertido); // Se calcula sobre el capital real invertido (incluyendo comisiones de compra)

        document.getElementById('usdtComprados').textContent = `${usdtComprados.toFixed(2)} USDT`;
        document.getElementById('comisionBinanceCompra').textContent = `- ${formatGs(comisionBinanceCompra)}`;
        document.getElementById('capitalRealInvertido').textContent = formatGs(capitalRealInvertido);
        document.getElementById('ingresoBruto').textContent = formatGs(ingresoBruto);
        document.getElementById('comisionBinanceVenta').textContent = `- ${formatGs(comisionBinanceVenta)}`;
        document.getElementById('gananciaNeta').textContent = formatGs(gananciaNeta);
        document.getElementById('porcentajeGanancia').textContent = formatPercentage(porcentajeGanancia);

        // Mensajes de feedback
        const mensajeMargenDiv = document.getElementById('mensajeMargen');
        if (porcentajeGanancia * 100 < 0.5) {
            mensajeMargenDiv.className = 'info-box warning';
            // Calcular cuánto debe subir el precio de venta por USDT para llegar al 0.5%
            // Target: Ganancia Neta deseada = 0.005 * CapitalRealInvertido
            // Para simplificar, asumiremos que la comisión de venta no cambia drásticamente.
            // (IngresoBrutoNuevo - CapitalRealInvertido - ComisionVentaActual) / CapitalRealInvertido = 0.005
            // IngresoBrutoNuevo = (0.005 * CapitalRealInvertido) + CapitalRealInvertido + ComisionVentaActual
            // PrecioVentaSugerido = IngresoBrutoNuevo / USDTComprados
            const targetGananciaNeta = 0.005 * capitalRealInvertido;
            const ingresoBrutoNecesario = targetGananciaNeta + capitalRealInvertido + comisionBinanceVenta; // Usamos la comisión de venta actual como estimación
            const precioVentaNecesario = ingresoBrutoNecesario / usdtComprados;
            const sugerenciaSubirPrecioUSDT = precioVentaNecesario - precioVentaUSDT;


            mensajeMargenDiv.innerHTML = `
                <p><strong>¡Atención! Tu margen de ganancia es bajo (${formatPercentage(porcentajeGanancia)}).</strong></p>
                <p>Para alcanzar al menos un 0.5% de ganancia neta, te sugerimos subir tu precio de venta por USDT en aproximadamente <strong>${(sugerenciaSubirPrecioUSDT).toFixed(2)} Gs</strong> (por ejemplo, si vendías a ${formatGs(precioVentaUSDT)}, ahora vende a ${formatGs(precioVentaUSDT + sugerenciaSubirPrecioUSDT)}).</p>
                <p>Considera ajustar tu precio para una mayor rentabilidad.</p>
            `;
        } else if (porcentajeGanancia * 100 >= 0.5 && porcentajeGanancia * 100 < 1.0) {
            mensajeMargenDiv.className = 'info-box highlight';
            mensajeMargenDiv.innerHTML = `
                <p>Tu margen de ganancia (${formatPercentage(porcentajeGanancia)}) es aceptable, pero podrías buscar un poco más si el mercado lo permite.</p>
            `;
        } else {
            mensajeMargenDiv.className = 'info-box success';
            mensajeMargenDiv.innerHTML = `
                <p>¡Excelente! Tu margen de ganancia (${formatPercentage(porcentajeGanancia)}) es bueno. ¡Sigue así!</p>
            `;
        }

        document.getElementById('resultadoMargen').style.display = 'block';
    }

    // --- Funciones para la Calculadora de Objetivo de Ganancia ---
    function calculateGoal() {
        const gananciaNetaDeseada = parseFloat(document.getElementById('gananciaNetaDeseada').value.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const capitalDisponibleObj = parseFloat(document.getElementById('capitalDisponibleObj').value.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const precioCompraObj = parseFloat(document.getElementById('precioCompraObj').value.replace(/\./g, '').replace(/,/g, '.')) || 0;
        const margenDeseadoTipo = document.getElementById('margenDeseadoTipo').value;
        let margenDeseado = 0;
        if (margenDeseadoTipo === 'custom') {
            margenDeseado = parseFloat(document.getElementById('margenDeseadoCustom').value.replace(',', '.')) / 100 || 0; // Convertir a decimal (ej. 0.75% -> 0.0075)
        } else {
            margenDeseado = parseFloat(margenDeseadoTipo) || 0;
        }
        const diasObjetivo = parseInt(document.getElementById('diasObjetivo').value.replace(/\./g, '')) || 0;

        if (gananciaNetaDeseada <= 0 || capitalDisponibleObj <= 0 || precioCompraObj <= 0 || margenDeseado <= 0 || diasObjetivo <= 0) {
            alert('Por favor, ingresa valores positivos y válidos para todos los campos de la Calculadora de Objetivo.');
            document.getElementById('resultadoObjetivo').style.display = 'none';
            return;
        }

        const usdtPorOperacion = capitalDisponibleObj / precioCompraObj;

        let precioVentaSugerido = precioCompraObj * (1 + margenDeseado); // Punto de partida
        let comisionCompraSimulada;
        let comisionVentaSimulada;
        let gananciaNetaSimulada;

        // Calcular la comisión de compra una vez, ya que depende del capital inicial
        comisionCompraSimulada = calculateBinanceMakerFee(capitalDisponibleObj);

        const maxIterations = 100; // Aumentar las iteraciones para mayor precisión
        for (let i = 0; i < maxIterations; i++) {
            let ingresoBrutoTentativo = usdtPorOperacion * precioVentaSugerido;
            comisionVentaSimulada = calculateBinanceMakerFee(ingresoBrutoTentativo);

            // Calculamos la ganancia neta con el precio de venta actual
            gananciaNetaSimulada = ingresoBrutoTentativo - capitalDisponibleObj - comisionCompraSimulada - comisionVentaSimulada;

            // Diferencia entre la ganancia obtenida y la ganancia deseada (capital * margen)
            const targetGainPerOperation = capitalDisponibleObj * margenDeseado;
            const gananciaDiferencia = targetGainPerOperation - gananciaNetaSimulada;

            // Ajustamos el precio de venta. Sumamos la diferencia de ganancia dividida por los USDT
            // para saber cuánto más (o menos) debe ser el precio por USDT.
            if (usdtPorOperacion > 0) {
                 precioVentaSugerido += gananciaDiferencia / usdtPorOperacion;
            } else {
                break;
            }

            // Si el cambio es muy pequeño, ya estamos lo suficientemente cerca
            if (Math.abs(gananciaDiferencia) < 0.01) { // Tolerancia de 0.01 Gs en la ganancia
                break;
            }
        }

        // Recalcular con el precio final para mostrar resultados precisos
        const finalIngresoBruto = usdtPorOperacion * precioVentaSugerido;
        const finalComisionCompra = calculateBinanceMakerFee(capitalDisponibleObj);
        const finalComisionVenta = calculateBinanceMakerFee(finalIngresoBruto);
        const gananciaPorOperacion = finalIngresoBruto - capitalDisponibleObj - finalComisionCompra - finalComisionVenta;

        if (gananciaPorOperacion <= 0) {
             alert('El margen deseado o los datos ingresados no permiten obtener una ganancia positiva con este capital y comisiones. Intenta aumentar el margen o el capital, o revisar el precio de compra/venta.');
             document.getElementById('resultadoObjetivo').style.display = 'none';
             return;
        }

        const totalOperacionesNecesarias = gananciaNetaDeseada / gananciaPorOperacion;
        const volumenTotalUSDT = totalOperacionesNecesarias * usdtPorOperacion;
        const volumenTotalGS = volumenTotalUSDT * precioVentaSugerido; // Volumen en Gs basado en el precio de venta sugerido

        const volumenDiarioUSDT = volumenTotalUSDT / diasObjetivo;

        document.getElementById('precioVentaSugerido').textContent = formatGs(precioVentaSugerido);
        document.getElementById('volumenTotalUSDT').textContent = `${volumenTotalUSDT.toFixed(2)} USDT (${formatGs(volumenTotalGS)})`;
        document.getElementById('volumenDiarioUSDT').textContent = `${volumenDiarioUSDT.toFixed(2)} USDT`;
        document.getElementById('gananciaPorOperacion').textContent = formatGs(gananciaPorOperacion);

        const mensajeObjetivoDiv = document.getElementById('mensajeObjetivo');
        mensajeObjetivoDiv.className = 'info-box success';
        mensajeObjetivoDiv.innerHTML = `
            <p>Para alcanzar tu objetivo de <strong>${formatGs(gananciaNetaDeseada)}</strong> en <strong>${diasObjetivo} días</strong>, este es tu plan:</p>
            <ul>
                <li><strong>Precio de Venta Sugerido:</strong> Deberías fijar tu precio de venta en Binance P2P a <strong>${formatGs(precioVentaSugerido)} por USDT</strong>. Este precio te permitirá obtener la ganancia deseada por cada "ciclo" de operación.</li>
                <li><strong>Ganancia Limpia por Ciclo:</strong> Cada vez que completes un ciclo (usas tu capital disponible para comprar USDT y luego vendes esos USDT), tu ganancia neta estimada será de <strong>${formatGs(gananciaPorOperacion)}</strong>, después de ambas comisiones de Binance (compra y venta).</li>
                <li><strong>Volumen Total de USDT a Mover:</strong> Para lograr tu objetivo total, necesitarás mover un volumen acumulado de aproximadamente <strong>${volumenTotalUSDT.toFixed(2)} USDT</strong> (lo que equivale a <strong>${formatGs(volumenTotalGS)}</strong> en Guaraníes) durante los ${diasObjetivo} días.</li>
                <li><strong>Volumen Diario de USDT a Vender:</strong> Esto significa que, en promedio, deberías vender alrededor de <strong>${volumenDiarioUSDT.toFixed(2)} USDT por día</strong>.</li>
            </ul>
            <p><strong>Recuerda:</strong> Este plan es una estimación. La consistencia en el cumplimiento de tu volumen diario y el mantenimiento del precio de venta son claves para alcanzar tu objetivo.</p>
        `;

        document.getElementById('resultadoObjetivo').style.display = 'block';
    }


    // --- Manejo de la Interfaz de Usuario ---

    // Cargar contenido en la aplicación
    function loadContent(tabName) {
        appContent.classList.remove('fade-in'); // Reset animation
        void appContent.offsetWidth; // Trigger reflow
        let contentHTML = '';
        if (tabName === 'calculators') {
            contentHTML = calculatorsContentHTML;
        } else if (tabName === 'p2pedia') {
            contentHTML = p2pediaContentHTML;
        } else if (tabName === 'contact') {
            contentHTML = contactContentHTML;
        }
        appContent.innerHTML = contentHTML;
        appContent.classList.add('fade-in');

        // Inicializar funciones específicas de cada sección
        if (tabName === 'calculators') {
            initializeCalculators();
        } else if (tabName === 'p2pedia') {
            initializeP2Pedia();
        } else if (tabName === 'contact') {
            initializeContactAndFAQ();
        }
    }

    // Initializer for input formatting
    const setupInputFormatting = () => {
        document.querySelectorAll('.form-input').forEach(input => {
            if (input.dataset.numericType !== 'decimal') {
                input.removeEventListener('input', handleThousandInput);
                input.removeEventListener('focusout', handleThousandFocusOut);
                input.addEventListener('input', handleThousandInput);
                input.addEventListener('focusout', handleThousandFocusOut); // Use focusout for formatting on blur
            } else { // For decimal type (custom margin)
                input.removeEventListener('input', handleDecimalInput);
                input.addEventListener('input', handleDecimalInput);
            }
        });
    };

    function handleThousandInput(e) {
        let value = e.target.value.replace(/\./g, ''); // Remove existing thousands separators
        const selectionStart = e.target.selectionStart;
        const selectionEnd = e.target.selectionEnd;

        // Save original length for cursor position adjustment
        const originalLength = value.length;

        // Remove all non-digit characters
        value = value.replace(/[^0-9]/g, '');

        // Format with thousands separator
        if (value) {
            e.target.value = new Intl.NumberFormat('es-PY').format(parseInt(value));
        } else {
            e.target.value = '';
        }

        // Adjust cursor position
        const newLength = e.target.value.length;
        const diff = newLength - originalLength;
        e.target.setSelectionRange(selectionStart + diff, selectionEnd + diff);
    }

    function handleThousandFocusOut(e) {
        // When focus leaves, ensure the value is correctly formatted for display
        let value = e.target.value.replace(/\./g, ''); // Remove current thousands separators for parsing
        if (value) {
            e.target.value = new Intl.NumberFormat('es-PY').format(parseInt(value));
        }
    }

    function handleDecimalInput(e) {
        let value = e.target.value;
        // Replace commas with dots for consistent decimal handling
        value = value.replace(/,/g, '.');
        // Clean non-numeric characters except for one decimal point
        value = value.replace(/[^0-9.]/g, '');

        // Allow only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        e.target.value = value;
    }


    // Inicializar las calculadoras
    function initializeCalculators() {
        document.getElementById('calcularMargenBtn').addEventListener('click', calculateMargin);
        document.getElementById('calcularObjetivoBtn').addEventListener('click', calculateGoal);

        // Mostrar/ocultar campo de margen personalizado
        const margenDeseadoTipo = document.getElementById('margenDeseadoTipo');
        const margenDeseadoCustom = document.getElementById('margenDeseadoCustom');
        if (margenDeseadoTipo) {
            margenDeseadoTipo.addEventListener('change', function() {
                if (this.value === 'custom') {
                    margenDeseadoCustom.style.display = 'block';
                } else {
                    margenDeseadoCustom.style.display = 'none';
                }
            });
            // Asegurarse de que esté oculto al inicio si no es custom
            if (margenDeseadoTipo.value !== 'custom') {
                margenDeseadoCustom.style.display = 'none';
            }
        }
        setupInputFormatting(); // Apply formatting to newly loaded inputs
    }

    // Funciones para P2Pedia
    function showP2PediaSection(contentId) {
        const articleData = p2pediaArticles[contentId];
        const p2pediaArticleContent = document.getElementById('p2pediaArticleContent');

        if (articleData && p2pediaArticleContent) {
            p2pediaArticleContent.innerHTML = `
                <h2 class="p2pedia-article-title">${articleData.title}</h2>
                <div class="p2pedia-article-body">
                    ${articleData.content}
                </div>
            `;
            p2pediaArticleContent.classList.remove('fade-in');
            void p2pediaArticleContent.offsetWidth; // Trigger reflow
            p2pediaArticleContent.classList.add('fade-in');
        }
    }

    function initializeP2Pedia() {
        const p2pediaNavItems = document.querySelectorAll('#p2pediaNav .p2pedia-nav-item');

        p2pediaNavItems.forEach(item => {
            item.addEventListener('click', function() {
                p2pediaNavItems.forEach(navItem => navItem.classList.remove('active-p2pedia-nav'));
                this.classList.add('active-p2pedia-nav');
                const contentId = this.getAttribute('data-content');
                showP2PediaSection(contentId);
            });
        });

        // Cargar la primera sección por defecto al inicializar P2Pedia
        showP2PediaSection('guia-completa');
    }

    // --- Funciones para Contacto y FAQ ---
    function initializeContactAndFAQ() {
        const faqContainer = document.getElementById('faqContainer');
        if (faqContainer) {
            faqContainer.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', () => {
                    const faqItem = question.closest('.faq-item');
                    faqItem.classList.toggle('active');
                });
            });
        }
    }

    // Manejar clics en las pestañas de navegación principal
    mainNavTabs.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('nav-tab')) {
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            target.classList.add('active');
            const tabName = target.getAttribute('data-tab');
            loadContent(tabName);
        }
    });

    // Cargar el contenido inicial al cargar la página (calculadoras por defecto)
    loadContent('calculators');
});
