import React from 'react'

function LabelTemplate({title,htmlfor}) {
  return (
    <label
    htmlFor={htmlfor}
    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  >{title}</label>
  )
}

export default LabelTemplate
