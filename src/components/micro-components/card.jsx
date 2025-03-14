import Image from "next/image";

export default function CardComponent({ icon, title, description }) {
    return (
        <div className="card">
            <div className="card-body">
                {typeof icon === "string" ? (
                    <Image src={icon} alt={title} width={32} height={32} />
                ) : (
                    icon
                )}
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}
