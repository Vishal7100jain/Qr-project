"use client";
import { useTheme } from "@/context/ThemeContext";
import { Editor } from "@tinymce/tinymce-react";
import { useMemo } from "react";

interface MyEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function MyEditor({ value, onChange }: MyEditorProps) {
  const { theme } = useTheme();

  const editorConfig: any = useMemo(
    () => ({
      height: 400,
      menubar: true,
      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "code",
        "help",
        "wordcount",
      ],
      toolbar:
        "undo redo | blocks | " +
        "bold italic forecolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help",
      skin: theme === "dark" ? "oxide-dark" : "oxide",
      content_css: theme === "dark" ? "dark" : "default",
      branding: false,
      promotion: false,
      license_key: "gpl",
      setup: (editor: any) => {
        editor.on("init", () => {
          document
            .querySelectorAll(".tox-notification--warning")
            .forEach((el) => el.remove());
          document
            .querySelectorAll(".tox-promotion")
            .forEach((el) => el.remove());
        });
      },
    }),
    [theme]
  );

  return (
    <div className={theme === "dark" ? "dark-editor-wrapper" : ""}>
      <Editor
        apiKey="wwgky4p8xs2djcknwra5b5dcq56g8pu9u7djotjtmwewckos"
        init={editorConfig}
        key={theme}
        value={value}
        onEditorChange={onChange}
      />
    </div>
  );
}
