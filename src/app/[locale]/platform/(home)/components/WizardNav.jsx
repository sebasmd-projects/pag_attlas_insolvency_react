// src/app/[locale]/platform/(home)/components/WizardNav.jsx

import { useTranslations } from 'next-intl';
import PropTypes from 'prop-types';
import { FaArrowCircleLeft, FaArrowCircleRight, FaStopCircle } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';

export default function WizardNav({ current, total, onBack, isSubmitting }) {

    const wizardButton = useTranslations('Platform.pages.home.wizard.buttons');

    return (
        <div className="container-fluid px-0">
            <div className="row justify-content-between align-items-center gx-3 mt-5">
                {/* Botón izquierdo - Start en primer paso, Back en otros */}
                <div className="col-auto">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onBack}
                        disabled={current === 0 || isSubmitting}
                    >
                        {current === 0 ? (
                            <>
                                <FaStopCircle /> <span className='ms-2'>{wizardButton('back')}</span>
                            </>
                        ) : (
                            <>
                                <FaArrowCircleLeft /> <span className='ms-2'>{wizardButton('back')}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Indicador de paso (se mantiene igual) */}
                <div className='col-auto'>
                    <div className="text-muted">
                        {wizardButton('step')} {current + 1} / {total}
                    </div>
                </div>

                {/* Botón derecho - End en último paso, Next en otros */}
                <div className="col-auto">
                    <button
                        type="submit"
                        form="wizard-step-form"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                {wizardButton('processing')}
                            </>
                        ) : current === total - 1 ? (
                            <>
                                {wizardButton('send')} <LuSend className="ms-2" />
                            </>
                        ) : (
                            <>
                                {wizardButton('next')} <FaArrowCircleRight className="ms-2" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

WizardNav.propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
};