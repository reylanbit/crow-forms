import { useState } from 'react'
import { addResponse } from '../services/api'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

export default function Formulario() {
  const { register, handleSubmit, watch } = useForm()
  const [ok, setOk] = useState(null)
  const [loading, setLoading] = useState(false)
  const jQuinta = watch('quinta') === 'c'
  const jSabado = watch('sabado') === 'c'
  const MotionH1 = motion.h1

  return (
    <div className="max-w-2xl mx-auto p-6">
      <MotionH1
        className="text-3xl font-gothic text-gold"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ™ ϟ Guerra das Sombras 么
      </MotionH1>
      <form
        onSubmit={handleSubmit(async (data) => {
          setLoading(true)
          setOk(null)
          try {
            const res = await addResponse(data)
            setOk(res)
          } catch {
            setOk({ error: true })
          } finally {
            setLoading(false)
          }
        })}
        className="glass mt-4 p-4 rounded border border-neutral-700 grid gap-3"
      >
        <input {...register('nome', { required: true })} className="p-3 rounded bg-neutral-800 border border-neutral-700" placeholder="Qual seu nome?" />
        <input {...register('nick', { required: true })} className="p-3 rounded bg-neutral-800 border border-neutral-700" placeholder="Qual seu nick?" />

        <div>
          <label className="block mb-1">Podemos contar com sua presença na Quinta?</label>
          <select {...register('quinta', { required: true })} className="p-3 rounded bg-neutral-800 border border-neutral-700 w-full">
            <option value="a">a. Quinta</option>
            <option value="b">b. Não</option>
            <option value="c">☠️👨🏼‍🎓👮🏻‍♂️🫂 Justifique-se🤕🤒🤢🤡</option>
          </select>
          {jQuinta && (
            <textarea {...register('justQuinta')} className="mt-2 p-3 rounded bg-neutral-800 border border-neutral-700 w-full" rows={3} placeholder="Justificativa Quinta" />
          )}
        </div>

        <div>
          <label className="block mb-1">Podemos contar com sua presença no Sábado?</label>
          <select {...register('sabado', { required: true })} className="p-3 rounded bg-neutral-800 border border-neutral-700 w-full">
            <option value="a">a. Sábado</option>
            <option value="b">b. Não</option>
            <option value="c">☠️👨🏼‍🎓👮🏻‍♂️🫂 Justifique-se🤕🤒🤢🤡</option>
          </select>
          {jSabado && (
            <textarea {...register('justSabado')} className="mt-2 p-3 rounded bg-neutral-800 border border-neutral-700 w-full" rows={3} placeholder="Justificativa Sábado" />
          )}
        </div>

        <div>
          <label className="block mb-1">Qual Classe você usará?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['cruzado','monge','blood knight','demon hunter','bárbaro','arcanista','necromante','tempestário','druida'].map((c)=>(
              <label key={c} className="flex items-center gap-2">
                <input type="radio" value={c} {...register('classe', { required: true })} />
                <span className="capitalize">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block mb-1">Possui PET com savior?</label>
            <div className="flex items-center gap-3">
              <select {...register('pet', { required: true })} className="p-3 rounded bg-neutral-800 border border-neutral-700">
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
              <a href="https://youtu.be/o6Z5jQHHPFI" target="_blank" rel="noreferrer" className="text-gold underline">Ver</a>
            </div>
          </div>
          <div>
            <label className="block mb-1">Sua Ressonância no momento?</label>
            <input type="number" min="1" max="12000" {...register('ressonancia', { required: true })} className="p-3 rounded bg-neutral-800 border border-neutral-700 w-full" />
          </div>
        </div>

        <textarea {...register('tempo')} className="p-3 rounded bg-neutral-800 border border-neutral-700" rows={3} placeholder="Quanto tempo você joga?" />

        <button type="submit" className="p-3 rounded bg-blood text-white" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
      </form>
      {ok && !ok.error && (
        <div className="mt-3">Enviado</div>
      )}
      {ok && ok.error && <div className="mt-3 text-red-400">Falha ao enviar</div>}
    </div>
  )
}
