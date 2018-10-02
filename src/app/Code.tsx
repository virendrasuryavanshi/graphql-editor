import * as React from 'react';
import * as styles from '../style/Code';
import { xonokai } from 'react-syntax-highlighter/styles/prism';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import * as FileSaver from 'file-saver';
import * as cx from 'classnames';
import { makeNodes } from '../livegen/import/makeNodes';
import { GraphQLNodeType } from 'livegen/gens';
import { LinkType } from '@slothking-online/diagram';

export type CodeEditorProps = {
  liveCode: string;
  loadNodes: (
    props: {
      nodes: GraphQLNodeType[];
      links: LinkType[];
    }
  ) => void;
};
export type CodeEditorState = {
  editor?: boolean;
};

export class CodeEditor extends React.Component<CodeEditorProps, CodeEditorState> {
  state: CodeEditorState = {};
  render() {
    return (
      <div
        className={cx({
          [styles.HideEditor]: this.state.editor,
          [styles.ShowEditor]: !this.state.editor,
          [styles.Editor]: true
        })}
      >
        <SyntaxHighlighter
          PreTag={({ children }) => <div className={styles.Pre}>{children}</div>}
          language="graphql"
          style={xonokai}
        >
          {this.props.liveCode}
        </SyntaxHighlighter>

        <input
          type="file"
          id="load"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            // if (file.type.match('application/json')) {
            console.log(file.type);
            const reader = new FileReader();
            reader.onload = (f) => {
              const result = makeNodes((f.target as any).result);
              this.props.loadNodes(result);
            };
            reader.readAsText(file);
            // }
          }}
        />
        <label htmlFor="load" className={styles.Load} onClick={() => {}}>
          Load
        </label>
        <div
          className={styles.Save}
          onClick={() => {
            var file = new File([this.props.liveCode], `graphql-editor-schema.gql`, {
              type: 'application/json'
            });
            FileSaver.saveAs(file, `graphql-editor-schema.gql`);
          }}
        >
          Save to file
        </div>
        <div
          className={styles.ClickInfo}
          onClick={() => {
            this.setState({
              editor: !this.state.editor
            });
          }}
        >
          {this.state.editor ? `>>` : `<<`}
        </div>
      </div>
    );
  }
}
