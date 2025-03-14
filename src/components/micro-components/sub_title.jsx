
export default function SubTitleComponent({t, sub_title}) {
    return (
        <h2 className="display-5 fw-bold" style={{
            color: '#7fd2cb',
            fontSize: '2rem',
            lineHeight: '2.25rem',
            marginBottom: '1.5rem'
        }}>
            {
                t.rich(sub_title, {
                    span: (chunks) => (
                        <span style={{ color: '#0e3692' }}>
                            {chunks}
                        </span>
                    )
                }
                )
            }
        </h2>
    );
}