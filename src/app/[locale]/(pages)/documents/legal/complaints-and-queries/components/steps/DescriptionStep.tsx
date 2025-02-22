import { Card, Form } from 'react-bootstrap';

interface DescriptionStepProps {
    formData: any;
    setFormData(data: any | ((prev: any) => any)): void;
    errors?: any;
}

function DescriptionStep({ errors, formData, setFormData }: DescriptionStepProps) {
    return (
        <Card className="mb-4 p-3">
            <Card.Body>
                <Card.Title>3. Descripción de la Solicitud</Card.Title>
                <Form.Control
                    as="textarea"
                    isInvalid={!!errors?.description}
                    minLength={20}
                    onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, description: e.target.value }))
                    }
                    required
                    rows={4}
                    value={formData.description}
                />
            </Card.Body>
        </Card>
    )
};

export default DescriptionStep;
