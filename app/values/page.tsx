export default function ValuesPage() {
  const values = [
    {
      number: 'I',
      title: 'We Take Ownership',
      rallyCry: 'EXCUSES ARE FOR LOSERS.',
      description:
        'Acknowledge mistakes immediately, resolve issues within 30 minutes, and avoid deflecting blame to others.',
      accent: '#c9a84c',
      glow: 'rgba(201,168,76,0.1)',
      border: 'rgba(201,168,76,0.2)',
      topBar: 'rgba(201,168,76,0.7)',
    },
    {
      number: 'II',
      title: 'We Keep Our Word',
      rallyCry: 'SAY IT. DO IT. NO EXCUSES.',
      description:
        'Track all commitments meticulously and meet every deadline. State three promises each Monday and report results by Friday.',
      accent: '#52c47e',
      glow: 'rgba(82,196,126,0.1)',
      border: 'rgba(82,196,126,0.2)',
      topBar: 'rgba(82,196,126,0.7)',
    },
    {
      number: 'III',
      title: 'We Run The Play',
      rallyCry: 'NO ONE IS ABOVE THE SYSTEMS.',
      description:
        'Follow standard operating procedures consistently. Propose improvements only after completing the current process.',
      accent: '#5b8dee',
      glow: 'rgba(91,141,238,0.1)',
      border: 'rgba(91,141,238,0.2)',
      topBar: 'rgba(91,141,238,0.7)',
    },
    {
      number: 'IV',
      title: 'We Set The Standard',
      rallyCry: 'EXCELLENCE IS OUR SIGNATURE.',
      description:
        'Leave every site better than you found it. Address what needs fixing. Reject mediocrity in all work.',
      accent: '#9b7fe8',
      glow: 'rgba(155,127,232,0.1)',
      border: 'rgba(155,127,232,0.2)',
      topBar: 'rgba(155,127,232,0.7)',
    },
    {
      number: 'V',
      title: 'We Speak Truth With Love',
      rallyCry: 'WORDS BUILD OR DESTROY. CHOOSE COURAGE.',
      description:
        'Cultivate potential in others through direct, honest communication. Address concerns face-to-face — never behind closed doors.',
      accent: '#38bdb0',
      glow: 'rgba(56,189,176,0.1)',
      border: 'rgba(56,189,176,0.2)',
      topBar: 'rgba(56,189,176,0.7)',
    },
    {
      number: 'VI',
      title: 'We Lead At Every Level',
      rallyCry: 'UNDERSTAND THE MISSION. MAKE DECISIONS. LEAD.',
      description:
        'Leaders communicate intent; teams execute independently. Make decisions, report upward, and lead proactively at every role.',
      accent: '#e07a9b',
      glow: 'rgba(224,122,155,0.1)',
      border: 'rgba(224,122,155,0.2)',
      topBar: 'rgba(224,122,155,0.7)',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-9">
        <p className="section-label mb-1">The Code</p>
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#f0f5f1' }}>
          Core 6 Values
        </h1>
        <p className="text-sm" style={{ color: '#3d5c49' }}>
          The laws every hero in this company lives by
        </p>
      </div>

      <div className="glass-divider mb-9" />

      {/* Values grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {values.map(({ number, title, rallyCry, description, accent, glow, border, topBar }) => (
          <div
            key={number}
            className="relative overflow-hidden rounded-2xl flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: `1px solid ${border}`,
              boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.07) inset`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: topBar }}
            />

            {/* Glow orb */}
            <div
              className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: glow }}
            />

            <div className="p-6 flex-1 relative">
              {/* Chapter number */}
              <p
                className="text-[9px] font-black tracking-[0.25em] uppercase mb-4"
                style={{ color: accent, opacity: 0.6 }}
              >
                Law {number}
              </p>

              {/* Title */}
              <h2
                className="text-base font-bold leading-snug mb-3"
                style={{ color: '#f0f5f1' }}
              >
                {title}
              </h2>

              {/* Rally cry */}
              <div
                className="inline-block px-3 py-1.5 rounded-xl mb-4"
                style={{
                  background: `rgba(255,255,255,0.05)`,
                  border: `1px solid ${border}`,
                }}
              >
                <p
                  className="text-[10px] font-black tracking-[0.12em] uppercase"
                  style={{ color: accent }}
                >
                  {rallyCry}
                </p>
              </div>

              {/* Description */}
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#7a9e87' }}
              >
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer attribution */}
      <div className="mt-10 text-center">
        <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#3d5c49' }}>
          These are the laws that separate the ordinary from the extraordinary
        </p>
      </div>
    </div>
  );
}
