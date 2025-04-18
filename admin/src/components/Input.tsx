import * as React from 'react';
import { BlocksInput } from './BlocksInput/BlocksInput';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


interface InputProps {
  attribute: {
    type: string;
    customField: string;
    options?: {
      url?: string;
      disableIframe?: boolean;
      defaultValue?: string;
      required?: boolean;
      regex?: string;
      minLength?: number;
      unique?: boolean;
    };
  };
  description?: { id: string; defaultMessage: string };
  disabled?: boolean;
  intlLabel?: { id: string; defaultMessage: string };
  name: string;
  onChange: (e: { target: { name: string; type: string; value: string } }) => void;
  required?: boolean;
  value?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {

    console.log(props, 'props');

    return  (
      <DndProvider backend={HTML5Backend}>
        <BlocksInput ref={ref} name="blocks" type="blocks" />
      </DndProvider>
    );
  }
);

Input.displayName = 'RichTextBlocksExtendedInput';

export default Input;