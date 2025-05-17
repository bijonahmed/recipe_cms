import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const EditorComponent = ({ value, onChange }) => {
  // Ensure that the value passed in is reflected in the editor
  const handleEditorChange = (content) => {
    // Update the content in the parent component (via the onChange callback)
    onChange(content);
  };

  return (
    <div className="editor-container">
      <Editor
        apiKey="cs5zf08rpt3ef21s4fo1yg9dzmjyg7b5iedcyq8mouj4fxaf" // You can use a free API key from TinyMCE if needed
        value={value} // Set value to reflect the state passed from the parent
        onEditorChange={handleEditorChange} // Handle editor content changes
        init={{
          height: 400,
          menubar: false,
          plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "print", "preview", "searchreplace", "wordcount"],
          toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright | outdent indent | numlist bullist | link image",
        }}
      />
    </div>
  );
};

export default EditorComponent;
