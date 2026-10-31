import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }

export default function Field({ label, error, type, id, className, ...rest }: Props) {
  const [show, setShow] = useState(false)
  const isPw = type === 'password'
  const fid = id ?? rest.name
  return (
    <div>
      <label htmlFor={fid} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="relative">
        <input id={fid} type={isPw && show ? 'text' : type} aria-invalid={Boolean(error)} aria-describedby={error ? `${fid}-err` : undefined}
          className={cn('input', isPw && 'pr-11', error && 'border-red-500', className)} {...rest} />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p id={`${fid}-err`} className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
