import axios from 'axios';

export async function GetMainFAQ() {
    const { data } = await axios.get('/api/faq/main');
    return data;
}

export async function GetOtherFAQ() {
    const { data } = await axios.get('/api/faq/other');
    return data;
}