import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController } from "phosphor-react";
import { Input } from "./Form/Imput";
import { useEffect, useState, FormEvent } from 'react';
import { Game } from '../App';
import axios from 'axios';

export function CreateAdModal() {

    const [games, setGames] = useState<Game[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [useVoiceChannel, setUseVoiceChannel] = useState(false)

    useEffect(() => {
        axios('http://localhost:3000/games')
            .then(res => setGames(res.data))
    }, [])

    async function handleCreateAd(e: FormEvent) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const data = Object.fromEntries(formData)

        if(!data.name){
            return
        }

        try {
            await axios.post(`http://localhost:3000/games/${data.game}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                weekDays: weekDays.map(Number),
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel: useVoiceChannel
            })

            alert('Anuncio criado com sucesso!')
        } catch (err){
            alert('Erro ao criar o anúncio')
        }
    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className='bg-black/60 inset-0 fixed' />

            <Dialog.Content className='fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25'>
                <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>

                <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="game" className='font-semibold'>Qual o game?</label>
                        <select id='game' name='game' defaultValue="" className='bg-zinc-900 appearance-none py-3 px-4 rounded text-sm placeholder:text-zinc-500'>
                            <option disabled value="">Selecione o game que deseja jogar</option>

                            {games.map(game => {
                                return <option key={game.id} value={game.id}>{game.title}</option>
                            })}
                        </select>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="nome">Seu nome (ou nickname)</label>
                        <Input id='name' name='name' placeholder='Como te chamam dentro do game?' />
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="yearsPlying">Joga há quantos anos?</label>
                            <Input type="number" id="yearsPlying" name='yearsPlying' placeholder='Tudo bem ser ZERO' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="discord">Qual o seu Discord?</label>
                            <Input id='discord' name='discord' type="text" placeholder='Usuario#0000' />
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="weekDays">Quando costuma jogar?</label>


                            <ToggleGroup.Root value={weekDays} onValueChange={setWeekDays} className='grid grid-cols-4 gap-2' type='multiple'>
                                <ToggleGroup.Item value='0' className={`w-8 h-8 rounded  ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Domingo'>D</ToggleGroup.Item>
                                <ToggleGroup.Item value='1' className={`w-8 h-8 rounded  ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Segunda'>S</ToggleGroup.Item>
                                <ToggleGroup.Item value='2' className={`w-8 h-8 rounded  ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Terça'>T</ToggleGroup.Item>
                                <ToggleGroup.Item value='3' className={`w-8 h-8 rounded  ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quarta'>Q</ToggleGroup.Item>
                                <ToggleGroup.Item value='4' className={`w-8 h-8 rounded  ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quinta'>Q</ToggleGroup.Item>
                                <ToggleGroup.Item value='5' className={`w-8 h-8 rounded  ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sexta'>S</ToggleGroup.Item>
                                <ToggleGroup.Item value='6' className={`w-8 h-8 rounded  ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sabado'>S</ToggleGroup.Item>
                            </ToggleGroup.Root>


                        </div>
                        <div className='flex flex-col gap-2 flex-1'>
                            <label htmlFor="hourStart">Qual o horario do dia?</label>
                            <div className='grid grid-cols-2 gap-2'>
                                <Input id='hourStart' name='hourStart' type="time" placeholder='De' />
                                <Input id='hourEnd' name='hourEnd' type="time" placeholder='Ate' />
                            </div>
                        </div>
                    </div>

                    <label className='mt-2 items-center flex gap-2 text-sm'>
                        <Checkbox.Root className='w-6 h-6 rounded p-1 bg-zinc-900' checked={useVoiceChannel} onCheckedChange={(checked) => { if (checked === true) { setUseVoiceChannel(true) } else { setUseVoiceChannel(false) } }}>
                            <Checkbox.Indicator>
                                <Check className='w-4 h-4 text-emerald-400' />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        Costumo me conectar ao chat de voz
                    </label>

                    <footer className='mt-4 flex justify-end gap-4'>
                        <Dialog.Close className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'>Cancelar</Dialog.Close>
                        <button className='bg-violet-500 px-5 h-12 rounded-md flex items-center gap-3 font-semibold hover:bg-violet-600' type="submit">
                            <GameController className='w-6 h-6' />
                            Encontrar DUO
                        </button>
                    </footer>

                </form>

            </Dialog.Content>

        </Dialog.Portal>
    )
}