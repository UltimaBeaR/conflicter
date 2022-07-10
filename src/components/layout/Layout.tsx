import MonacoEditor, { MonacoDiffEditor } from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import './Layout.scss';
import { useEffect, useState } from 'react';

// TODO: в итоге еще нужно добавить опцию сравнения всех возможных вариантов с output, т.к. после разрешения конфликтов иногда нужно смотреть и это чтобы удостовериться что все ок

const Layout = () => {
  const options: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
    renderLineHighlight: 'none',
    automaticLayout: true,
    minimap: { enabled: false },
    fontFamily: 'Cascadia Mono',
    renderWhitespace: 'all'
  };

  const diffOptions: monacoEditor.editor.IDiffEditorConstructionOptions = {
    renderLineHighlight: 'none',
    automaticLayout: true,
    minimap: { enabled: false },
    fontFamily: 'Cascadia Mono',
    renderWhitespace: 'all',

    readOnly: true
  };

  const [baseSource, setBaseSource] = useState('');
  const [localSource, setLocalSource] = useState('');
  const [remoteSource, setRemoteSource] = useState('');
  const [outputSource, setOutputSource] = useState('');

  const [leftSource, setLeftSource] = useState('');
  const [rightSource, setRightSource] = useState('');

  const [diffOptionSelected, setDiffOptionSelected] = useState(0);

  useEffect(function () {
    window.electron.ipcRenderer.on('read-file-contents', (arg) => {
      const id: string = (arg as any)[0];
      //const fileName: string = (arg as any)[1];
      const data: string = (arg as any)[2];

      if (id === 'base') {
        setBaseSource(data);
        setLeftSource(data);
      }
      else if (id === 'local') {
        setLocalSource(data);
        setRightSource(data);
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
  }, []);

  const handleBaseLocal = function () {
    setLeftSource(baseSource);
    setRightSource(localSource);
    setDiffOptionSelected(0);
  };

  const handleBaseRemote = function () {
    setLeftSource(baseSource);
    setRightSource(remoteSource);
    setDiffOptionSelected(1);
  };

  const handleLocalRemote = function () {
    setLeftSource(localSource);
    setRightSource(remoteSource);
    setDiffOptionSelected(2);
  };

  const handleRemoteLocal = function () {
    setLeftSource(remoteSource);
    setRightSource(localSource);
    setDiffOptionSelected(3);
  };

  const headerHeight = 40;
  const topHeightPercent = 0.5;

  const bottomHeightPercent = 1.0 - topHeightPercent;

  const topHeightStyle = `calc(${Math.round(topHeightPercent * 100)}% - ${Math.round(topHeightPercent * headerHeight)}px)`;
  const bottomHeightStyle = `calc(${Math.round(bottomHeightPercent * 100)}% - ${Math.round(bottomHeightPercent * headerHeight)}px)`;

  return (
    <div className='app'>
      <div className='row' style={{ height: `${headerHeight}px` }}>
        <div className='buttons-block' style={{ padding: '10px 10px 10px 10px' }}>
          <div>
            <span>BASE - </span>
            <button onClick={handleBaseLocal} className={diffOptionSelected === 0 ? 'button-selected' : undefined}>local</button>
            <span> / </span>
            <button onClick={handleBaseRemote} className={diffOptionSelected === 1 ? 'button-selected' : undefined}>remote</button>
          </div>
          <div>
            <button onClick={handleLocalRemote} className={diffOptionSelected === 2 ? 'button-selected' : undefined} style={{ marginRight: '10px' }}>local - remote</button>
            <button onClick={handleRemoteLocal} className={diffOptionSelected === 3 ? 'button-selected' : undefined}>remote - local</button>
          </div>
        </div>
      </div>
      <div className='row' style={{ height: topHeightStyle }}>
        <div className='editor-outer' style={{ padding: '10px 10px 10px 10px' }}>
          <div className='editor-inner'>
            <MonacoDiffEditor language='html' original={leftSource} value={rightSource} options={diffOptions} />
          </div>
        </div>
      </div>
      <div className='row' style={{ height: bottomHeightStyle }}>
        <div className='editor-outer' style={{ padding: '10px 10px 10px 10px' }}>
          <div className='editor-inner'>
            <MonacoEditor language='html' value={outputSource} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
