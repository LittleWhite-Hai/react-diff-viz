import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestLight } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export default function CodeExample(props: {
  code: string;
  lineProps?: (lineNumber: number) => React.HTMLProps<HTMLElement>;
}) {
  return (
    <div style={{ flex: 1 }}>
      <SyntaxHighlighter
        language="javascript"
        style={atelierForestLight}
        customStyle={{
          textAlign: "left",
          padding: "20px",
        }}
        codeTagProps={{
          style: {
            display: "block",
            textAlign: "left",
          },
        }}
        wrapLines={true}
        showLineNumbers
        lineProps={props.lineProps}
        children={props.code}
      ></SyntaxHighlighter>
    </div>
  );
}
