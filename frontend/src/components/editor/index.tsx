"use client";

import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { slashCommand, suggestionItems } from "./slash-command";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { Separator } from "./ui/separator";

const extensions = [...defaultExtensions, slashCommand];

function parseContent(value: string): JSONContent | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (parsed?.type === "doc") return parsed;
  } catch {}
  return undefined;
}

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Editor({ value = "", onChange, className }: EditorProps) {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [wordCount, setWordCount] = useState<number | null>(null);

  const debouncedSave = useDebouncedCallback((json: string, words: number) => {
    setWordCount(words);
    onChange?.(json);
    setSaveStatus("saved");
  }, 500);

  // Flush any pending debounced save when the editor unmounts (e.g. dialog closes)
  // so changes are never silently discarded within the 500 ms window.
  useEffect(() => () => { debouncedSave.flush(); }, [debouncedSave]);

  const initialContent = parseContent(value);

  return (
    <div className="flex h-full flex-col">
      <EditorRoot>
        <EditorContent
          {...(initialContent ? { initialContent } : {})}
          immediatelyRender={false}
          extensions={extensions}
          className={className ?? "relative flex-1 overflow-y-auto"}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full px-8 py-10 sm:px-16",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedSave(
              JSON.stringify(editor.getJSON()),
              editor.storage.characterCount.words(),
            );
            setSaveStatus("unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
              onHidden: () => {
                setOpenNode(false);
                setOpenColor(false);
                setOpenLink(false);
              },
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>

      <div className="flex items-center justify-between border-t border-border/50 bg-background px-4 py-1 text-xs text-muted-foreground/60">
        <span>{saveStatus === "unsaved" ? "Unsaved changes…" : ""}</span>
        {wordCount !== null && (
          <span>
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        )}
      </div>
    </div>
  );
}
