import axios from 'axios';

export default async function GetFinancialEducation() {
    const { data } = await axios.get('/api/financial-education.json');
    return data;
}