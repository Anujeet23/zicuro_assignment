import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  Modifier,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { DefaultDraftInlineStyle } from "draft-js";

DefaultDraftInlineStyle["red"] = { color: "red" };

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      );
    }
  }, []);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
    alert("Content saved!");
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (char) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    const text = block.getText();

    if (char === " " && text === "#") {
      applyBlockStyle("header-one");
      return "handled";
    } else if (char === " " && text === "*") {
      applyInlineStyle("BOLD");
      return "handled";
    } else if (char === " " && text === "**") {
      applyInlineStyle("red");
      return "handled";
    } else if (char === " " && text === "***") {
      applyInlineStyle("UNDERLINE");
      return "handled";
    }
    return "not-handled";
  };

  const applyBlockStyle = (style) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const newContent = Modifier.replaceText(
      currentContent,
      selection.merge({
        anchorOffset: 0,
        focusOffset: 1,
      }),
      ""
    );
    setEditorState(
      RichUtils.toggleBlockType(
        EditorState.push(editorState, newContent, "remove-range"),
        style
      )
    );
  };

  const applyInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <div style={{ margin: "20px", border: "1px solid gray", padding: "10px" }}>
      <h2>Demo Editor</h2>
      <button onClick={saveContent}>Save</button>
      <div
        style={{ border: "1px solid #ddd", padding: "10px", marginTop: "10px" }}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
        />
      </div>
    </div>
  );
};

export default MyEditor;
