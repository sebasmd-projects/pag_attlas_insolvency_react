
export default function CertificatePage() {
    return (
        <div className="container flex flex-col items-center justify-center w-full h-full p-4">
            <h1 className="mt-3">ACTAS DE NOMBRAMIENTO INSTITUCIONAL</h1>

            <h2 className="mt-3">Fundación Attlas ORG</h2>

            <div className="card mt-3">
                <div className="card-body row">
                    <div className="col-md-6">
                        <h3 className="text-uppercase">
                            Jorge Uriel Vega Londoño
                        </h3>

                        <ul>
                            <li>Presidente Ejecutivo</li>
                            <li>9.730.921</li>
                            <li>Alto Comisionado de Justicia Económica</li>
                        </ul>
                    </div>

                    <div className="col-md-6">
                        <h3>
                            DIANA MARÍA TRUJILLO OROZCO
                        </h3>

                        <ul>
                            <li>Vicepresidenta Ejecutiva y Suplente de Representante Legal</li>
                            <li>25.026.224</li>
                            <li>Embajadora de Justicia Económica</li>
                        </ul>
                    </div>

                    <div className="col-md-6">
                        <h3 className="text-uppercase">
                            CARLOS ANDRES MORALES VALENCIA
                        </h3>

                        <ul>
                            <li>Director Ejecutivo</li>
                            <li>71.444.172</li>
                            <li>Embajador de Justicia Económica</li>
                        </ul>
                    </div>

                    <div className="col-md-6">
                        <h3 className="text-uppercase">
                            HUMBERTO TURRIAGO LÓPEZ
                        </h3>

                        <ul>
                            <li>Director Jurídico Internacional</li>
                            <li>1.272.893</li>
                            <li>Consultor de Justicia Económica</li>
                        </ul>
                    </div>

                    <div className="col-md-6">
                        <h3 className="text-uppercase">
                            JAMES SABOGAL PEÑAS
                        </h3>

                        <ul>
                            <li>Auditor de Impacto Socioeconómico</li>
                            <li>93.381.110</li>
                            <li>Auditor de Inclusión Económica</li>
                        </ul>
                    </div>

                    <div className="col-md-6">
                        <h3 className="text-uppercase">
                            JUAN SEBASTIÁN MORALES DELGADO
                        </h3>

                        <ul>
                            <li>Director de Seguridad Informática</li>
                            <li>1.152.225.004</li>
                            <li>Custodio Digital del Patrimonio Económico</li>
                        </ul>
                    </div>
                </div>
            </div>






            <h2 className="mt-3 text-center">ACTA DE NOMBRAMIENTO INSTITUCIONAL No. 001 DE 2025</h2>
            <div className="mt-3" style={{ height: '80vh' }}>
                <embed src="/assets/documents/undesa/Jorge UNDESA nombramiento.pdf" type="application/pdf" width="100%" height="100%" />
            </div>

            <h2 className="mt-3 text-center">ACTA DE NOMBRAMIENTO INSTITUCIONAL No. 002 DE 2025</h2>
            <div className="mt-3" style={{ height: '80vh' }}>
                <embed src="/assets/documents/undesa/Todos UNDESA nombramiento.pdf" type="application/pdf" width="100%" height="100%" />
            </div>
        </div>
    );
}