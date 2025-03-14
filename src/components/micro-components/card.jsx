import Image from "next/image";

export default function CardComponent({ icon, title, description }) {
    return (
        <div className="card">
            <div className="card-body">
                <div className="text-center">
                    {typeof icon === "string" ? (
                        <Image src={icon} alt={title} width={32} height={32} />
                    ) : (
                        icon
                    )}
                </div>
                <h3 className="text-uppercase mb-3" style={{
                    color: '#0e3692',
                    fontSize: '1rem',
                    fontWeight: 800,
                }}>
                    {title}
                </h3>
                <p>{description}</p>
            </div>
        </div>
    );
}
