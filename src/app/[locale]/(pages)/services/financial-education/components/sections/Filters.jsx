import { useTranslations } from 'next-intl';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap';

export default function FilterSection({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categoriesForButtons }) {

    const t = useTranslations('Pages.servicesPage.financialEducation');

    return (
        <Row className="mb-4 g-3">
            <Col md={8}>
                <Form.Control
                    type="search"
                    placeholder={t('search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Col>
            <Col md={4}>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {categoriesForButtons.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                            onClick={() => setSelectedCategory(category)}
                            size="sm"
                        >
                            {category}
                        </Button>
                    ))}
                </Stack>
            </Col>
        </Row>
    );
}