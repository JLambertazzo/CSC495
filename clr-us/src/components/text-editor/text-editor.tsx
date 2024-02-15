import katex from 'katex'
import React from 'react'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'
import 'katex/dist/katex.min.css'
window.katex = katex

export const TextEditor = (props: { value: string; onChange: (val: string) => void }) => {
  return (
    <ReactQuill
      theme="snow"
      value={props.value}
      onChange={(value, delta, source, editor) => {
        editor.getText().trim() ? props.onChange(value) : props.onChange('')
      }}
      style={{
        height: 200,
      }}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ header: [1, 2, 3, false] }],
          ['link', 'formula'],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
          ['clean'], // remove formatting button
        ],
        clipboard: {
          matchVisual: false,
        },
      }}
    />
  )
}
