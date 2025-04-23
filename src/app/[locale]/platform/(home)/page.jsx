'use client';

import WizardNav from './components/WizardNav';
import { WizardProvider, useWizard } from './hooks/useWizardForm';

export default function WizardPage() {
    return (
        <WizardProvider>
            <WizardShell />
        </WizardProvider>
    );
}

function WizardShell() {
    const { StepComponent, stepIndex, steps, data, updateData, isSubmitting, handleNext, handleBack } = useWizard();

    return (
        <main className="container my-5" style={{ minHeight: '60vh' }} aria-live="polite">
            <StepComponent
                data={data}
                updateData={updateData}
                onNext={handleNext}
                onBack={handleBack}
                isSubmitting={isSubmitting}
            />

            <WizardNav
                current={stepIndex}
                total={steps.length}
                onBack={handleBack}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
