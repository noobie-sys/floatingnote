import React from 'react'
import { AiFillFilePdf, AiFillFileImage, AiFillFileText } from 'react-icons/ai'

const FILE_ICONS: { [ext: string]: React.ReactNode } = {
  pdf: <AiFillFilePdf className="text-red-600" />,
  jpg: <AiFillFileImage className="text-yellow-500" />,
  jpeg: <AiFillFileImage className="text-yellow-500" />,
  png: <AiFillFileImage className="text-yellow-500" />,
  txt: <AiFillFileText className="text-gray-600" />
}

export default FILE_ICONS
