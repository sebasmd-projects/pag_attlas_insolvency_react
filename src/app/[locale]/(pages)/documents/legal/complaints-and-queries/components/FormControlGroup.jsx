const FormField = ({ label, name, type = 'text', required, ...props }) => (
    <Form.Group>
        <Form.Label>{label}{required && '*'}</Form.Label>
        <Form.Control
            type={type}
            name={name}
            required={required}
            {...props}
        />
        {errors[name] && <Form.Text className="text-danger">{errors[name]}</Form.Text>}
    </Form.Group>
);