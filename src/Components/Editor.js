import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/darcula.css'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import ACTIONS from '../Actions'

export default function Editor({ socketRef, roomID, onCodeChange }) {

  const EditorRef = useRef(null);

  useEffect(() => {
    async function init() {
      EditorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor'), {
        mode: { name: 'javascript', json: true },
        theme: 'darcula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true
      })

      EditorRef.current.on('change', (instance, changes) => {
        
        const { origin } = changes
        const code = instance.getValue();
        onCodeChange(code)
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomID,
            code,
          })
        }
        
      })
    }
    init();
  }, [roomID, socketRef])

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          EditorRef.current.setValue(code)
        }
      })
    }

    return () =>{

      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
  }, [socketRef.current])

  return (
    <textarea id="realTimeEditor"></textarea>
  )
}
