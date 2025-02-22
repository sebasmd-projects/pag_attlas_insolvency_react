import { Card, Col, Form, Row } from 'react-bootstrap';

interface ConfirmationStepProps {
    formData: any;
    setFormData(data: any | ((prev: any) => any)): void;
    errors?: any;
}

const labels: Record<string, string> = {
    request_type: 'Tipo de Solicitud',
    is_legal_entity: 'Es persona jurídica',
    company_name: 'Nombre de la compañía',
    nit: 'NIT',
    legal_representative: 'Representante legal',
    name: 'Nombre',
    surname: 'Apellido',
    id_type: 'Tipo de identificación',
    id_number: 'Número de identificación',
    country: 'País',
    city: 'Ciudad',
    address: 'Dirección',
    email: 'Correo electrónico',
    cell_prefix: 'Prefijo de celular',
    cellphone: 'Celular',
    documents: 'Documentos',
    description: 'Descripción',
    contact_methods: 'Métodos de contacto',
    useExistingContact: 'Usar contacto existente',
    contact_email: 'Correo de contacto',
    contact_cell_prefix: 'Prefijo de celular de contacto',
    contact_cell: 'Celular de contacto',
    contact_phone_prefix: 'Prefijo de teléfono de contacto',
    contact_phone: 'Teléfono de contacto',
    terms_accepted: 'Términos y condiciones aceptados'
};

function ConfirmationStep({ errors, formData, setFormData }: ConfirmationStepProps): JSX.Element {
    return (
        <Card className="mb-4 p-3">
            <Card.Body>
                <Card.Title>5. Confirmación de Datos</Card.Title>
                <Form>
                    {Object.entries(formData)
                        .filter(([key, value]) => {
                            // Excluir 'documents' y 'terms_accepted' siempre.
                            if (key === 'documents' || key === 'terms_accepted' || key === 'contact_methods') return false;
                            // Excluir valores nulos o undefined.
                            if (value === null || value === undefined) return false;
                            // Si es cadena, omitir si está vacía o solo contiene espacios.
                            if (typeof value === 'string' && value.trim() === '') return false;
                            return true;
                        })
                        .map(([key, value]) => {
                            const displayValue =
                                typeof value === 'object'
                                    ? JSON.stringify(value, null, 2)
                                    : typeof value === 'boolean'
                                        ? value ? 'Sí' : 'No'
                                        : String(value);

                            return (
                                <Form.Group key={key} as={Row}>
                                    <Form.Label column sm="4">
                                        {labels[key] || key}
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            defaultValue={displayValue}
                                            plaintext
                                            readOnly
                                        />
                                    </Col>
                                </Form.Group>
                            );
                        })}
                </Form>
            </Card.Body>
            <Card.Footer>
                <Form.Check
                    checked={formData.terms_accepted}
                    id="terms_accepted"
                    isInvalid={!!errors?.terms_accepted}
                    label="Acepto los términos y condiciones"
                    onChange={(e) =>
                        setFormData((prev: any) => ({
                            ...prev,
                            terms_accepted: e.target.checked
                        }))
                    }
                    required
                    type="checkbox"
                />
            </Card.Footer>
        </Card>
    );
}

export default ConfirmationStep;
