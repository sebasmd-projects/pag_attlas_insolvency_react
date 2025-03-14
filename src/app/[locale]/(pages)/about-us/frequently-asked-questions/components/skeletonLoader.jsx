import CardComponent from '@/components/micro-components/card';
import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import Image from "next/image";
import { Form, ListGroup } from "react-bootstrap";
import { MdQuestionAnswer } from "react-icons/md";

export default function SkeletonLoaderComponent({ t }) {
    return (
        <section className="container-lg py-5">
            <div className="row g-4 align-items-center">
                <div className="col-md-7">
                    <div className="mb-4">
                        <TitleComponent title={t('heroSection.title_h1')} />
                        <SubTitleComponent t={t} sub_title={'heroSection.title_h2'} />
                    </div>
                    <div className="row g-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="col-12 col-md-6">
                                <CardComponent icon={<MdQuestionAnswer />} title='...' description='...' />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-4">
                    <Image
                        src="/assets/imgs/page/solutions-img.png"
                        alt="Financial solutions"
                        className="img-fluid rounded-5"
                        loading="lazy"
                        width={600}
                        height={600}
                    />
                </div>
            </div>

            <div className="row g-4 pt-5">
                <div className="col-12">
                    <Form.Control
                        type="text"
                        placeholder={t('search_placeholder')}
                        className="mb-4 disabled"
                        disabled
                    />

                    <ListGroup className="w-100">
                        {
                            [...Array(4)].map((_, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    className="list-group-item-action disabled"
                                    disabled
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">¿.....?</h5>
                                    </div>
                                    <p className="mb-1">... ... ...</p>
                                    <small className="text-muted">
                                        <u>{t('show_more')}</u>
                                    </small>
                                </ListGroup.Item>
                            ))
                        }
                    </ListGroup>
                </div>
            </div>
        </section>
    );
}