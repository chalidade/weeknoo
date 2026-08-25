// WYSIWYG editor — CKEditor 5 (free GPL build), prewired so a site can drop
// it in when it needs rich-text input. Imported nowhere by default, so it
// adds nothing to the bundle until a page actually uses it.
//
//   import { RichTextEditor } from "@/components/editor/RichTextEditor"
//   const [html, setHtml] = useState("")
//   <RichTextEditor value={html} onChange={setHtml} />
//
// The value is HTML — persist it in @/lib/db or render it back with
// dangerouslySetInnerHTML on trusted content only.
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Link,
  List,
  BlockQuote,
} from "ckeditor5"
import "ckeditor5/ckeditor5.css"

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value = "", onChange, placeholder }: RichTextEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_event, editor) => onChange?.(editor.getData())}
      config={{
        licenseKey: "GPL",
        plugins: [Essentials, Paragraph, Heading, Bold, Italic, Link, List, BlockQuote],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "|",
          "undo",
          "redo",
        ],
        placeholder,
      }}
    />
  )
}
