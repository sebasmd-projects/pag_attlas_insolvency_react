import { Button, Card, Col, Ratio, Row, Stack } from 'react-bootstrap';

export default function ContentSection({ filteredSections, isEnglish, sanitizeHTML }) {
    return (
        <Row>
            {filteredSections.map((section, index) => {
                const localizedTitle = isEnglish ? section.title_en : section.title;
                const localizedDescription = isEnglish ? section.description_en : section.description;
                const rawCategory = isEnglish ? section.category_en : section.category;
                const categories = rawCategory ? (Array.isArray(rawCategory) ? rawCategory : [rawCategory]) : [];

                // Si el título localizado es null, no renderizar nada
                if (localizedTitle === null) {
                    return null;
                }

                return (
                    <div key={section.id} className="d-flex flex-column flex-md-row gap-4 mb-5">
                        <Col md={6} className={index % 2 !== 0 ? 'order-md-2' : ''}>
                            <Ratio aspectRatio="16x9" data-aos="zoom-in" data-aos-delay="100">
                                {
                                    section.video_url.includes("youtube.com") || section.video_url.includes("youtu.be") ? (
                                        <iframe
                                            src={section.video_url.replace("watch?v=", "embed/")}
                                            title={localizedTitle}
                                            allowFullScreen
                                            className="rounded-3 w-100"
                                            style={{ border: 'none' }}
                                        />
                                    ) : section.video_url.endsWith(".mp4") ? (
                                        <video controls className="rounded-3 w-100">
                                            <source src={section.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <div className="text-muted">No video available</div>
                                    )
                                }
                            </Ratio>
                        </Col>
                        <Col md={6} className={index % 2 !== 0 ? 'order-md-1' : ''} data-aos="zoom-in" data-aos-delay="100">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title as="h3" style={{ color: '#7fd2cb', fontSize: '1.25rem', lineHeight: '2.25rem' }}>{localizedTitle}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {
                                            localizedDescription && (
                                                <span
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
    );
}