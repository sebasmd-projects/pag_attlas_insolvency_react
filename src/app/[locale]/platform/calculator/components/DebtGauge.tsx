interface DebtGaugeProps {
    years?: number;
    isInsolvent: boolean;
}

export default function DebtGauge({ isInsolvent, years }: DebtGaugeProps) {
    const angle = years !== undefined ? Math.min((years / 10) * 180, 180) : 0;

    let color = 'gray';

    if (isInsolvent) {
        color = 'red';
    } else if (years !== undefined && years <= 3) {
        color = 'green';
    } else if (years !== undefined && years <= 6) {
        color = 'orange';
    } else {
        color = 'red';
    }

    return (
        <div className="text-center my-4">
            {isInsolvent ? (
                <div className="d-flex justify-content-center my-4">
                    <img
                        alt="Alarma giratoria"
                        height={120}
                        src="/assets/imgs/page/alarm.gif"
                        style={{
                            borderRadius: '50%',
                        }}
                        width={120}
                    />
                </div>
            ) : (
                <svg height="120" viewBox="0 0 200 120" width="200">
                    {/* Zona verde */}
                    <path
                        d="M 10 100 A 90 90 0 0 1 75 19"
                        fill="none"
                        stroke="green"
                        strokeWidth="20"
                    />
                    {/* Zona naranja */}
                    <path
                        d="M 75 19 A 90 90 0 0 1 125 19"
                        fill="none"
                        stroke="orange"
                        strokeWidth="20"
                    />
                    {/* Zona roja */}
                    <path
                        d="M 125 19 A 90 90 0 0 1 190 100"
                        fill="none"
                        stroke="red"
                        strokeWidth="20"
                    />

                    {/* Rayitas del velocímetro */}
                    {Array.from({ length: 10 }).map((_, i) => {
                        const theta = (Math.PI * i) / 9;
                        const x1 = 100 - 85 * Math.cos(theta);
                        const y1 = 100 - 85 * Math.sin(theta);
                        const x2 = 100 - 95 * Math.cos(theta);
                        const y2 = 100 - 95 * Math.sin(theta);
                        return (
                            <line
                                key={i}
                                stroke="#333"
                                strokeWidth="2"
                                x1={x1}
                                x2={x2}
                                y1={y1}
                                y2={y2}
                            />
                        );
                    })}

                    {/* Aguja */}
                    <line
                        stroke={color}
                        strokeLinecap="round"
                        strokeWidth="6"
                        x1="100"
                        x2={100 - 80 * Math.cos((Math.PI * angle) / 180)}
                        y1="100"
                        y2={100 - 80 * Math.sin((Math.PI * angle) / 180)}
                    />

                    {/* Centro de la aguja */}
                    <circle cx="100" cy="100" fill={color} r="6" />
                </svg>
            )}
        </div>
    );
}
