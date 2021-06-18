import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { EditorState, Editor, RichUtils, getDefaultKeyBinding } from 'draft-js';
import React, { useCallback } from 'react';

interface ContentEditorProps {
  name: string;
  editorState: EditorState;
  setEditorState: (field: string, value: any, shouldValidate?: boolean) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  name,
  editorState,
  setEditorState,
}) => {
  const editor = React.useRef<Editor>(null);
  const focusEditor = () => {
    editor?.current?.focus();
  };

  const handleKeyCommand = useCallback((command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(name, newState);
      return 'handled';
    }

    return 'not-handled';
  }, []);

  const mapKeyToEditorCommand = useCallback(
    e => {
      if (e.keyCode === 9) {
        const newEditorState = RichUtils.onTab(e, editorState, 4);
        if (newEditorState !== editorState) {
          setEditorState(name, newEditorState);
        }
        return;
      }
      return getDefaultKeyBinding(e);
    },
    [editorState]
  );

  const toggleBlockType = useCallback(
    blockType => {
      setEditorState(name, RichUtils.toggleBlockType(editorState, blockType));
    },
    [editorState]
  );

  const toggleInlineStyle = useCallback(
    inlineStyle => {
      setEditorState(
        name,
        RichUtils.toggleInlineStyle(editorState, inlineStyle)
      );
    },
    [editorState]
  );

  return (
    <div
      id="DraftEditor"
      style={{ width: '100%', marginBottom: '1rem' }}
      className="RichEditor-root"
    >
      <div style={{display: 'flex'}}>
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      </div>
      <div
        className="RichEditor-editor RichEditor-hidePlaceholder"
        onFocus={focusEditor}
      >
        <Editor
          ref={editor}
          editorState={editorState}
          keyBindingFn={mapKeyToEditorCommand}
          handleKeyCommand={handleKeyCommand}
          onChange={editorState => setEditorState(name, editorState)}
        ></Editor>
      </div>
    </div>
  );
};

const StyleButton = props => {
  const onToggle = e => {
    e.preventDefault();
    props.onToggle(props.style);
  };
  let className = 'RichEditor-styleButton';
  if (props.active) {
    className += ' RichEditor-activeButton';
  }

  return (
    <span className={className} onMouseDown={onToggle}>
      {props.label}
    </span>
  );
};

const BLOCK_TYPES = [
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  {
    label: <UnorderedListOutlined style={{ fontSize: 16 }} />,
    style: 'unordered-list-item',
  },
  {
    label: <OrderedListOutlined style={{ fontSize: 16 }} />,
    style: 'ordered-list-item',
  },
];

const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditorControls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

var INLINE_STYLES = [
  { label: <BoldOutlined style={{ fontSize: 16 }} />, style: 'BOLD' },
  { label: <ItalicOutlined style={{ fontSize: 16 }} />, style: 'ITALIC' },
  { label: <UnderlineOutlined style={{ fontSize: 16 }} />, style: 'UNDERLINE' },
];

const InlineStyleControls = (props: {
  editorState: { getCurrentInlineStyle: () => any };
  onToggle: any;
}) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default ContentEditor;
