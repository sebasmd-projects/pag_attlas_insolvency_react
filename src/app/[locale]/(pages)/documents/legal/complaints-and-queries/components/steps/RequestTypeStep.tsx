import { Card, Col, Form, Row } from 'react-bootstrap';

interface RequestTypeStepProps {
    formData: any;
    setFormData(data: any | ((prev: any) => any)): void;
}

const requestTypes = [
    'Acceso',
    'Actualización',
    'Rectificación',
    'Supresión',
    'Petición',
    'Reclamo',
    'Consulta'
];

function RequestTypeStep({ formData, setFormData }: RequestTypeStepProps) {
    return (
        <Card className="mb-4 p-3">
            <Card.Body>
                <Card.Title>1. Seleccione el tipo de solicitud</Card.Title>
                <Row>
                    {requestTypes.map(type => (
                        <Col key={type} md={6}>
                            <Form.Check
                                checked={formData.request_type === type}
                                id={type}
                                label={type}
                                name="request_type"
                                onChange={() =>
                                    setFormData((prev: any) => ({ ...prev, request_type: type }))
                                }
                                type="radio"
                            />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
}

export default RequestTypeStep;
