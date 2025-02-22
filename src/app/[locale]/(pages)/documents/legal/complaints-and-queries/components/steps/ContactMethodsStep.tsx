import React from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

interface ContactMethodsStepProps {
    formData: any;
    setFormData(data: any | ((prev: any) => any)): void;
    errors?: any;
}

function ContactMethodsStep({ errors, formData, setFormData }: ContactMethodsStepProps) {
    return (
        <Card className="mb-4 p-3">
            <Card.Body>
                <Card.Title>4. Medios de Contacto</Card.Title>
                <Form.Switch
                    checked={formData.useExistingContact}
                    className="mb-3"
                    id="useExistingContact"
                    label="Utilizar los datos de contacto del punto 2"
                    onChange={(e) =>
                        setFormData((prev: any) => ({
                            ...prev,
                            useExistingContact: e.target.checked,
                            contact_email: e.target.checked ? prev.email : '',
                            contact_cell: e.target.checked ? prev.cellphone : ''
                        }))
                    }
                />

                {!formData.useExistingContact && (
                    <>
                        {['email', 'cell', 'phone'].map(method => (
                            <Form.Check
                                key={method}
                                checked={formData.contact_methods.includes(method)}
                                id={`contact-method-${method}`}
                                label={
                                    method === 'email'
                                        ? 'Correo Electrónico'
                                        : method === 'cell'
                                            ? 'Celular'
                                            : 'Teléfono Fijo'
                                }
                                onChange={(e) => {
                                    const methods = e.target.checked
                                        ? [...formData.contact_methods, method]
                                        : formData.contact_methods.filter((m: string) => m !== method);
                                    setFormData((prev: any) => ({ ...prev, contact_methods: methods }));
                                }}
                                type="checkbox"
                            />
                        ))}

                        <div className="mt-3">
                            {formData.contact_methods.includes('email') && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors?.contact_email}
                                        onChange={(e) =>
                                            setFormData((prev: any) => ({ ...prev, contact_email: e.target.value }))
                                        }
                                        required
                                        type="email"
                                        value={formData.contact_email}
                                    />
                                </Form.Group>
                            )}

                            {formData.contact_methods.includes('cell') && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Celular</Form.Label>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Control
                                                isInvalid={!!errors?.contact_cell_prefix}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/[^0-9+]/g, '');
                                                    if (!value.startsWith('+')) {
                                                        value = `+${value.replace(/\+/g, '')}`;
                                                    }
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        contact_cell_prefix: value
                                                    }));
                                                }}
                                                placeholder="+57"
                                                type="text"
                                                value={formData.contact_cell_prefix}
                                            />
                                        </Col>
                                        <Col md={8}>
                                            <Form.Control
                                                isInvalid={!!errors?.contact_cell}
                                                onChange={(e) =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        contact_cell: e.target.value.replace(/[^0-9]/g, '')
                                                    }))
                                                }
                                                required
                                                type="tel"
                                                value={formData.contact_cell}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            )}

                            {formData.contact_methods.includes('phone') && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono Fijo</Form.Label>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Control
                                                isInvalid={!!errors?.contact_phone_prefix}
                                                onChange={(e) =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        contact_phone_prefix: e.target.value.replace(/[^0-9]/g, '')
                                                    }))
                                                }
                                                placeholder="604"
                                                type="text"
                                                value={formData.contact_phone_prefix}
                                            />
                                        </Col>
                                        <Col md={8}>
                                            <Form.Control
                                                isInvalid={!!errors?.contact_phone}
                                                onChange={(e) =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        contact_phone: e.target.value.replace(/[^0-9]/g, '')
                                                    }))
                                                }
                                                required
                                                type="tel"
                                                value={formData.contact_phone}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            )}
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    )
};

export default ContactMethodsStep;
