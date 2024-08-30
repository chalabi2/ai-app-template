import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatMessages } from "@/hooks/useChatMessages";
import { cn } from "@/lib/utils";
import { LoadingDots } from "@/components/LoadingDots";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Image as ImageIcon,
  Quote,
  List,
  ListOrdered,
  Minus,
  Heading1,
  Heading2,
  MessageCircle,
  Heading3,
  Send,
  Eye,
  EyeOff,
  GripHorizontal,
} from "lucide-react";
import MarkdownPreview from "./MarkdownPreview";

interface ChatBoxProps {
  chatId: string;
}

export default function ChatBox({ chatId }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { messages, sendMessage, isLoading } = useChatMessages(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addFormatting = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    let prefix = "";
    let suffix = "";
    let newText = text;

    switch (format) {
      case "bold":
        prefix = "**";
        suffix = "**";
        break;
      case "italic":
        prefix = "*";
        suffix = "*";
        break;
      case "strikethrough":
        prefix = "~~";
        suffix = "~~";
        break;
      case "inline-code":
        prefix = "`";
        suffix = "`";
        break;
      case "link":
        prefix = "[";
        suffix = "](url)";
        break;
      case "image":
        prefix = "![alt text](";
        suffix = ")";
        break;
      case "quote":
        prefix = "> ";
        break;
      case "unordered-list":
        prefix = "- ";
        break;
      case "ordered-list":
        prefix = "1. ";
        break;
      case "code-block":
        prefix = "```\n";
        suffix = "\n```";
        break;
      case "horizontal-rule":
        newText = `${text.slice(0, start)}\n---\n${text.slice(end)}`;
        break;
      default:
        if (format.startsWith("heading-")) {
          const level = format.split("-")[1];
          prefix = "#".repeat(Number(level)) + " ";
        }
    }

    if (format !== "horizontal-rule") {
      newText = `${text.slice(0, start)}${prefix}${text.slice(
        start,
        end
      )}${suffix}${text.slice(end)}`;
    }

    setInput(newText);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length, end + prefix.length);
  };

  const formatButtons = [
    { icon: <Bold size={18} />, tooltip: "Bold", format: "bold" },
    { icon: <Italic size={18} />, tooltip: "Italic", format: "italic" },
    {
      icon: <Strikethrough size={18} />,
      tooltip: "Strikethrough",
      format: "strikethrough",
    },
    { icon: <Code size={18} />, tooltip: "Inline Code", format: "inline-code" },
    { icon: <Link size={18} />, tooltip: "Link", format: "link" },
    { icon: <ImageIcon size={18} />, tooltip: "Image", format: "image" },
    { icon: <Quote size={18} />, tooltip: "Quote", format: "quote" },
    {
      icon: <List size={18} />,
      tooltip: "Unordered List",
      format: "unordered-list",
    },
    {
      icon: <ListOrdered size={18} />,
      tooltip: "Ordered List",
      format: "ordered-list",
    },
    { icon: <Code size={18} />, tooltip: "Code Block", format: "code-block" },
    {
      icon: <Minus size={18} />,
      tooltip: "Horizontal Rule",
      format: "horizontal-rule",
    },
    { icon: <Heading1 size={18} />, tooltip: "Heading 1", format: "heading-1" },
    { icon: <Heading2 size={18} />, tooltip: "Heading 2", format: "heading-2" },
    { icon: <Heading3 size={18} />, tooltip: "Heading 3", format: "heading-3" },
  ];

  const { theme } = useTheme();
  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)]    bg-purple-950 p-4 w-full">
      <PanelGroup direction="vertical" className="flex-grow">
        <Panel defaultSize={60} minSize={20}>
          <div className="h-full overflow-y-auto p-4 space-y-4 border-2 border-pink-800 shadow-[inset_2px_2px_0_0_#8b4b8b] bg-purple-900">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg inline-block max-w-[70%] border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b]",
                      message.role === "user"
                        ? "bg-purple-900 text-gray-200"
                        : "bg-purple-950 text-gray-300"
                    )}
                  >
                    {message.role === "loading" ? (
                      <LoadingDots />
                    ) : message.isMarkdown ? (
                      <ReactMarkdown
                        components={{
                          code({ inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={dracula as any}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <MessageCircle size={48} className="mb-4" />
                <p className="text-lg font-semibold">No messages yet</p>
                <p className="text-sm">
                  Start a conversation by typing a message below.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Panel>
        <PanelResizeHandle className="h-2 w-full cursor-row-resize flex items-center justify-center bg-purple-950 hover:bg-purple-900">
          <GripHorizontal size={20} className="text-gray-300" />
        </PanelResizeHandle>
        <Panel minSize={20}>
          <div className="flex flex-col h-full p-4 border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="mb-2 flex flex-wrap">
                {formatButtons.map((button) => (
                  <Tooltip key={button.format}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => addFormatting(button.format)}
                        className="mr-2 mb-2 border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950 text-gray-300 hover:bg-purple-900 hover:text-gray-200"
                        variant="outline"
                        size="sm"
                      >
                        {button.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{button.tooltip}</TooltipContent>
                  </Tooltip>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="mr-2 mb-2 border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950 text-gray-300 hover:bg-purple-900 hover:text-gray-200"
                      variant="outline"
                      size="sm"
                    >
                      {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div
                className={`flex flex-grow min-h-0 ${
                  showPreview ? "space-x-4" : ""
                }`}
              >
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message (Markdown supported)..."
                  className={`flex-grow p-2 border-2 border-pink-800 shadow-[inset_2px_2px_0_0_#8b4b8b] bg-purple-900 text-gray-300 ${
                    showPreview ? "w-1/2" : "w-full"
                  }`}
                  style={{ resize: "none", height: "100%" }}
                />
                {showPreview && (
                  <div className="w-1/2 overflow-y-auto border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-900 p-2 text-gray-300">
                    <MarkdownPreview content={input} />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 border-2 border-pink-800 shadow-[3px_3px_0_0_#8b4b8b] bg-purple-950 text-gray-300 hover:bg-purple-900 hover:text-gray-200"
              >
                {isLoading ? <LoadingDots /> : "Send"}
              </Button>
            </form>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
