import { DiscriminatedItem } from '@graasp/sdk';
import TextEditor from '@graasp/ui/text-editor';

type DescriptionFormProps = {
  id?: string;
  item?: DiscriminatedItem;
  updatedProperties: Partial<DiscriminatedItem>;
  setChanges: (payload: Partial<DiscriminatedItem>) => void;
};

const DescriptionForm = ({
  id,
  updatedProperties,
  item,
  setChanges,
}: DescriptionFormProps): JSX.Element => {
  const onChange = (content: string): void => {
    setChanges({
      description: content,
    });
  };

  return (
    <TextEditor
      id={id}
      value={(updatedProperties?.description || item?.description) ?? ''}
      edit
      onChange={onChange}
      showActions={false}
    />
  );
};

export default DescriptionForm;
