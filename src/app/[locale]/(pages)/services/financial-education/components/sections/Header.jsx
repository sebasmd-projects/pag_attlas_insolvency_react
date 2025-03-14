import SubTitleComponent from '@/components/micro-components/sub_title';
import TitleComponent from '@/components/micro-components/title';
import { useTranslations } from 'next-intl';

export default function HeaderSection() {

    const t = useTranslations('Pages.servicesPage.financialEducation');

    return (
        <div className="row mb-5 text-center">
            <div className='col'>
                <TitleComponent title={t('title_h1')} />
                <SubTitleComponent t={t} sub_title={'title_h2'} />
            </div>
        </div>
    );
}