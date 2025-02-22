import { Card, Col, Form, Row } from 'react-bootstrap';

interface PrivateDataStepProps {
  formData: any;
  setFormData(data: any | ((prev: any) => any)): void;
  errors?: any;
  handleFileChange(name: string, file: File): void;
}

function PrivateDataStep({ errors, formData, handleFileChange, setFormData }: PrivateDataStepProps) {
  return (
    <Card className="mb-4 p-3">
      <Card.Body>
        <Card.Title>2. Datos del Titular</Card.Title>
        <Row className="mb-3">
          <Col>

            <Form.Check
              checked={!formData.is_legal_entity}
              id="natural"
              label="Persona Natural"
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  is_legal_entity: false,
                  company_name: '',
                  nit: '',
                  legal_representative: ''
                }))
              }
              type="radio"
            />

            <Form.Check
              checked={formData.is_legal_entity}
              id="persona-juridica"
              label="Persona Jurídica"
              onChange={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  is_legal_entity: true,
                  name: '',
                  surname: ''
                }))
              }
              type="radio"
            />
          </Col>
        </Row>

        <Row className="g-3">
          {
            formData.is_legal_entity ? (
              <>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Razón Social</Form.Label>
                    <Form.Control
                      isInvalid={!!errors?.company_name}
                      onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, company_name: e.target.value }))
                      }
                      required
                      value={formData.company_name}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>NIT</Form.Label>
                    <Form.Control
                      isInvalid={!!errors?.nit}
                      onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, nit: e.target.value }))
                      }
                      required
                      value={formData.nit}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Representante Legal</Form.Label>
                    <Form.Control
                      isInvalid={!!errors?.legal_representative}
                      onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, legal_representative: e.target.value }))
                      }
                      required
                      value={formData.legal_representative}
                    />
                  </Form.Group>
                </Col>
              </>
            ) : (
              <>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nombres</Form.Label>
                    <Form.Control
                      isInvalid={!!errors?.name}
                      onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      value={formData.name}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      isInvalid={!!errors?.surname}
                      onChange={(e) =>
                        setFormData((prev: any) => ({ ...prev, surname: e.target.value }))
                      }
                      required
                      value={formData.surname}
                    />
                  </Form.Group>
                </Col>
              </>
            )
          }

          <Col md={6}>
            <Form.Group>
              <Form.Label>Tipo de Identificación</Form.Label>
              <Form.Select
                isInvalid={!!errors?.id_type}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, id_type: e.target.value }))
                }
                value={formData.id_type}
              >
                <option value="">--Selecciona uno--</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Número de Identificación</Form.Label>
              <Form.Control
                isInvalid={!!errors?.id_number}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, id_number: e.target.value }))
                }
                required
                value={formData.id_number}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>País</Form.Label>
              <Form.Control
                isInvalid={!!errors?.country}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, country: e.target.value }))
                }
                required
                value={formData.country}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                isInvalid={!!errors?.city}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, city: e.target.value }))
                }
                required
                value={formData.city}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                isInvalid={!!errors?.address}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, address: e.target.value }))
                }
                required
                value={formData.address}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                isInvalid={!!errors?.email}
                onChange={(e) =>
                  setFormData((prev: any) => ({ ...prev, email: e.target.value }))
                }
                required
                type="email"
                value={formData.email}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Label>Celular</Form.Label>
            <Row>

              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    isInvalid={!!errors?.cell_prefix}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9+]/g, '');
                      if (!value.startsWith('+')) {
                        value = `+${value.replace(/\+/g, '')}`;
                      }
                      setFormData((prev: any) => ({
                        ...prev,
                        cell_prefix: value
                      }));
                    }}
                    placeholder="+57"
                    type="text"
                    value={formData.cell_prefix}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Control
                    isInvalid={!!errors?.cellphone}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        cellphone: e.target.value.replace(/[^0-9]/g, '')
                      }))
                    }
                    required
                    type="tel"
                    value={formData.cellphone}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>
                {formData.is_legal_entity
                  ? 'Certificado de Existencia y Representación Legal'
                  : 'Documento de identidad'}
              </Form.Label>
              <Form.Control
                accept=".pdf,.jpg,.jpeg,.png"
                isInvalid={!!errors[formData.is_legal_entity ? 'legal_certificate' : 'id_document']}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) {
                    handleFileChange(
                      formData.is_legal_entity ? 'legal_certificate' : 'id_document',
                      e.target.files[0]
                    );
                  }
                }}
                required
                type="file"
              />
            </Form.Group>
          </Col>

        </Row>
      </Card.Body>
    </Card>
  )
}

export default PrivateDataStep;