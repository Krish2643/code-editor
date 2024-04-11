import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange}) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;



















// import React, {useEffect, useRef} from 'react'
// // import * as Codemirror from 'codemirror';
// import Codemirror from 'codemirror'
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/dracula.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import ACTIONS from '../Actions';

// const Editor = ({socketRef, roomId}) => {
//   const editorRef = useRef(null);

//    useEffect(()=>{
    
//      async function init(){
//       Codemirror.fromTextArea(
//         document.getElementById('real-time-editor'), {
//             mode: { name: 'javascript', json: true },
//                     theme: 'dracula',
//                     autoCloseTags: true,
//                     autoCloseBrackets: true,
//                     lineNumbers: true,
//           })

//       //     //  if(editorRef.current){
//       //     editorRef.current.on('change', (instance, changes) => {
//       //       const { origin } = changes;
//       //       const code = instance.getValue();
//       //       // onCodeChange(code);
//       //       if (origin !== 'setValue') {
//       //           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//       //               roomId,
//       //               code,
//       //           });
//       //       }
//       //   });
//       // // }
//      }

//      init();

// }, [])

//     useEffect(()=>{
//             if(editorRef.current){
//           editorRef.current.on('change', (instance, changes) => {
//             const { origin } = changes;
//             const code = instance.getValue();
//             // onCodeChange(code);
//             if (origin !== 'setValue') {
//                 socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//                     roomId,
//                     code,
//                 });
//             }
//         });
//       }
//     },[editorRef.current])

//     useEffect(() => {
//       if (socketRef.current) {
//           socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//               if (code !== null) {
//                   editorRef.current.setValue(code);
//               }
//           });
//       }

//   return () => {
//       socketRef.current.off(ACTIONS.CODE_CHANGE);
//   };
// }, [socketRef.current]);


// return (
//   <div>
//       <textarea id='real-time-editor'></textarea>
//   </div>
// )
// }

// export default Editor