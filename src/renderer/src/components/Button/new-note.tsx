import { ActionButton, ActionButtonProps } from './action-button'
import { createEmptyNoteAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { LuSignature } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom)

  const handleCreation = async (): Promise<void> => {
    await createEmptyNote()
  }

  return (
    <ActionButton onClick={handleCreation} {...props}>
      <LuSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
