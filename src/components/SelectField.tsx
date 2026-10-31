export function SelectField({ label, value, onChange, options, name }: { label: string; value: string; onChange: (v: string) => void; options: string[]; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <select id={name} className="input" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select>
    </div>
  )
}

export function TextArea({ label, value, onChange, error, name }: { label: string; value: string; onChange: (v: string) => void; error?: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <textarea id={name} rows={3} className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
