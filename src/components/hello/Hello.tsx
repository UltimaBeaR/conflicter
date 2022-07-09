import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import './Hello.css';
import { useEffect, useState } from 'react';

const Hello = () => {
  const options: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
    renderLineHighlight: 'none',
    automaticLayout: true,
    minimap: { enabled: false },
    fontFamily: 'Cascadia Mono',
    renderWhitespace: 'all'
  };

  const [baseSource, setBaseSource] = useState('');
  const [localSource, setLocalSource] = useState('');
  const [remoteSource, setRemoteSource] = useState('');
  const [outputSource, setOutputSource] = useState('');

  useEffect(
    function () {
      window.electron.ipcRenderer.on('read-file-contents', (arg) => {
        const id: string = (arg as any)[0];
        //const fileName: string = (arg as any)[1];
        const data: string = (arg as any)[2];

        if (id === 'base') {
          setBaseSource(data);
        }
        else if (id === 'local') {
          setLocalSource(data);
        }
        else if (id === 'remote') {
          setRemoteSource(data);
        }
        else if (id === 'output') {
          setOutputSource(data);
        }
      });

      window.electron.ipcRenderer.sendMessage('read-file-contents', ['base', 'C:/Users/BeaR/Desktop/conflicted/index.html.BASE']);
      window.electron.ipcRenderer.sendMessage('read-file-contents', ['local', 'C:/Users/BeaR/Desktop/conflicted/index.html.LOCAL']);
      window.electron.ipcRenderer.sendMessage('read-file-contents', ['remote', 'C:/Users/BeaR/Desktop/conflicted/index.html.REMOTE']);
      window.electron.ipcRenderer.sendMessage('read-file-contents', ['output', 'C:/Users/BeaR/Desktop/conflicted/index.html']);
    },
    []
  );

  return (
    <div className="app">
      <div className="row" style={{ height: '50%' }}>
        <div className="editor-outer editor-outer_width33" style={{ padding: '10px 5px 0 10px' }}>
          <div className="editor-inner">
            <MonacoEditor language="html" value={baseSource} options={options} />
          </div>
        </div>

        <div className="editor-outer editor-outer_width33" style={{ padding: '10px 5px 0 5px' }}>
          <div className="editor-inner">
            <MonacoEditor language="html" value={localSource} options={options} />
          </div>
        </div>

        <div className="editor-outer editor-outer_width33" style={{ padding: '10px 10px 0 5px' }}>
          <div className="editor-inner">
            <MonacoEditor language="html" value={remoteSource} options={options} />
          </div>
        </div>
      </div>
      <div className="row" style={{ height: '50%' }}>
        <div className="editor-outer" style={{ padding: '20px 10px 10px 10px' }}>
          <div className="editor-inner">
            <MonacoEditor language="html" value={outputSource} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hello;
