import { atom } from 'jotai'

const countAtom = atom(0)

const doubleCountAtom = atom((get) => get(countAtom) * 2)

export { countAtom, doubleCountAtom }
