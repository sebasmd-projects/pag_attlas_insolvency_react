export default function TitleComponent({title, aos = null, aosDelay = 0}) {
    return (
        <h1
            className="text-uppercase mb-3"
            style={{
                color: '#0e3692',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15rem',
                paddingBottom: '2rem'
            }}
            {...(aos && { 'data-aos': aos })}
            {...(aos && aosDelay > 0 && { 'data-aos-delay': aosDelay })}
        >
            {title}
        </h1>
    );
}
