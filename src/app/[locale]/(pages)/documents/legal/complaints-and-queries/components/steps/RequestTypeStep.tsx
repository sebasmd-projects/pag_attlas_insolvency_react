import { Card, Col, Form, Row } from 'react-bootstrap';

interface RequestTypeStepProps {
    formData: any;
    setFormData(data: any | ((prev: any) => any)): void;
}

const requestTypes = [
    { value: 'ACCESS', label: 'Acceso' },
    { value: 'UPDATE', label: 'Actualización' },
    { value: 'RECTIFICATION', label: 'Rectificación' },
    { value: 'DELETE', label: 'Supresión' },
    { value: 'REQUEST', label: 'Petición' },
    { value: 'CLAIM', label: 'Reclamo' },
    { value: 'INQUIRY', label: 'Consulta' },
];

function RequestTypeStep({ formData, setFormData }: RequestTypeStepProps) {
    return (
        <Card className="mb-4 p-3">
            <Card.Body>
                <Card.Title>1. Seleccione el tipo de solicitud</Card.Title>
                <Row>
                    {requestTypes.map(({ value, label }) => (
                        <Col key={value} md={6}>
                            <Form.Check
                                checked={formData.request_type === value}
                                id={value}
                                label={label}
                                name="request_type"
                                onChange={() =>
                                    setFormData((prev: any) => ({ ...prev, request_type: value }))
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
