import { Button, Card, Col, Ratio, Row, Stack } from 'react-bootstrap';


export default function ContentSection({ filteredSections, isEnglish, sanitizeHTML }) {
    return (
        <Row>
            {filteredSections.map((section, index) => {
                const localizedTitle = isEnglish ? section.title_en : section.title;
                const localizedDescription = isEnglish ?
                    (section.description_en ?? section.description) : section.description;
                const rawCategory = isEnglish ?
                    (section.category_en ?? section.category) :
                    (section.category ?? section.category_en);
                const categories = rawCategory ? (Array.isArray(rawCategory) ? rawCategory : [rawCategory]) : [];

                return (
                    <div key={section.id} className="d-flex flex-column flex-md-row gap-4 mb-5">
                        <Col md={6} className={index % 2 !== 0 ? 'order-md-2' : ''}>
                            <Ratio aspectRatio="16x9">
                                <iframe
                                    src={section.videoUrl}
                                    title={localizedTitle}
                                    allowFullScreen
                                    className="rounded-3"
                                    style={{ border: 'none' }}
                                />
                            </Ratio>
                        </Col>
                        <Col md={6} className={index % 2 !== 0 ? 'order-md-1' : ''}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title as="h3" style={{ color: '#7fd2cb', fontSize: '2rem', lineHeight: '2.25rem' }}>{localizedTitle}</Card.Title>
                                    <Card.Text className="text-muted"  >
                                        {
                                            localizedDescription && (
                                                <div
                                                    className="text-muted"
                                                    dangerouslySetInnerHTML={sanitizeHTML(localizedDescription)}
                                                />
                                            )
                                        }
                                    </Card.Text>
                                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                                        {categories.map((cat, i) => (
                                            <Button key={i} variant="outline-secondary" size="sm" disabled>
                                                {cat}
                                            </Button>
                                        ))}
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                );
            })}
        </Row>
    )
}



