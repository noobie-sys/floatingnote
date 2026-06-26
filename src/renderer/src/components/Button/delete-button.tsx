import { deleteNoteAtom } from '@renderer/store'
import { ActionButton, ActionButtonProps } from './action-button'
import { useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'

export const DeleteNoteButton = ({ ...props }: ActionButtonProps): React.JSX.Element => {
  const deleteNote = useSetAtom(deleteNoteAtom)

  const handleDelete = async (): Promise<void> => {
    await deleteNote()
  }

  return (
    <ActionButton onClick={handleDelete} {...props}>
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
