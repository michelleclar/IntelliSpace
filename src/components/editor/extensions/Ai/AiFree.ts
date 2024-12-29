// This is a dummy file, to make the project work without the AI extension.
import { Extension } from '@tiptap/core'

export type AiStorage = never
export type Language = never
export const tryParseToTiptapHTML = (args: never) => args
export const Ai = Extension.create({
  name: 'aiFree',
})
