
export default function TitleComponent({title}) {
    return (
        <h1 className="text-uppercase mb-3" style={{
            color: '#0e3692',
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.15rem',
            paddingBottom: '2rem'
        }}>
            {title}
        </h1>
    );
}