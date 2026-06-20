export const customStyles = `
/* Entire code block container */
.cm-editor * {
padding: 0 !important;
margin: 0 !important;
}
.cm-code-block {
  padding: 2px !important;
}

/* Custom cursor style */
.cm-editor .cm-cursor {
  border-left: 8px solid #2c313a !important;
  border-right: none !important;
  background: none !important;
  width: 2.5px !important;
  opacity: 1 !important;
  z-index: 10;
}
._codeMirrorWrapper_sects_392 {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
  cursor: pointer;
}
.cm-content {
  padding: 2px !important;
  margin: 2px !important;
}
.cm-gutterElement {
  width: 18px;
}

._codeMirrorToolbar_sects_409 {
  background: none !important;
  cursor: pointer;
}
._iconButton_sects_457 {
  color: red !important;
  cursor: pointer;
}
._toolbarNodeKindSelectTrigger_sects_306,
._toolbarButtonSelectTrigger_sects_307,
._selectTrigger_sects_308 {
  background: #30343b !important;
  font-size: 11px !important;
  font-weight: 700;
  width: 7rem;
  padding: 0px 4px;
  color : white;
}

._toolbarNodeKindSelectTrigger_sects_306,
._toolbarButtonSelectTrigger_sects_307,
._selectTrigger_sects_308 svg {
  width: 22px;
}
._selectTrigger_sects_308 [data-state='open'] {
  width: 7rem;
  background: #30343b !important;
}

[data-state="open"][role="listbox"] {
  background: #30343b !important;
  color: #fff !important;
  min-width: 7rem !important;
  border-radius : 6px;
}
  ._code_1tncs_52{
  background : none !important;
  }

  [role="listbox"] {
  width : 7rem !important
  }

  [role="listbox"] [role="option"]{
  padding : 2px 4px !important;
  width : 7rem !important;

  font-size : 11px !important;
  font-weight : 700;
  }

  [role="listbox"] [role="option"]:hover, [role="listbox"] [data-highlighted] {
  background: #444 !important;   /* Change background on hover */
  color: #ff5e5b !important;     /* Change text color on hover */
  cursor: pointer !important;    /* Show pointer cursor */
}


[role="listbox"] [role="option"]:hover,
[role="listbox"] [role="option"][data-highlighted] {
background: #444 !important;
color: #ff5e5b !important;
}

._toolbarRoot_sects_162{
  position: absolute !important;
  bottom: 0 !important;
  top : auto !important;
}



`

export const markdownStyles = `
prose max-w-none prose-outline-none  p-3  rounded-lg  bg-transparent prose-headings:text-white prose-heading-h1:font-bold prose-cursor:text-[#F84E4E] prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-300
      prose-code:text-[#F84E4E] prose-code:bg-[#F84E4E]/10 prose-code:rounded-md prose-pre:bg-black prose-pre:text-gray-300
      prose-blockquote:text-gray-400 prose-blockquote:font-medium prose-blockquote:border-[#F84E4E] prose-blockquote:border-l-2
      prose-ul:text-gray-300 prose-ul:font-medium prose-ol:text-gray-300
      prose-li:text-gray-300 prose-li:marker:text-[#F84E4E]
      prose-a:text-[#F84E4E] hover:prose-a:text-[#F84E4E]
      prose-img:rounded-lg prose-img:border prose-img:border-gray-700
      focus:outline-none
      [&_pre]:bg-gray-800/50 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:border-none
      [&_pre_.cm-editor]:!bg-transparent [&_pre_.cm-editor]:!border-none
      [&_pre_.cm-content]:!p-0 [&_pre_.cm-gutters]:!bg-transparent [&_pre_.cm-lineNumbers]:!text-gray-500
      [&_pre_button]:!text-sm [&_pre_button]:!p-1 [&_pre_button]:!rounded

      /* Toolbar styles */

`
