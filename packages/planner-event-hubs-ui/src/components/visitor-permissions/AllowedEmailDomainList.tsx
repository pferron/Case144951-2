import React, { useState } from 'react';
import { Tag } from '@cvent/carina/components/Tag';
import { useTranslate } from 'nucleus-text';

interface Props {
  item: string;
  index: number;
  removeEmailDomain: (val: number) => void;
  disabled?: boolean;
}
function AllowedEmailDomainList({ item, index, removeEmailDomain, disabled }: Props): JSX.Element {
  const { translate } = useTranslate();
  const [showTag, setShowTag] = useState(true);
  const removeItem = () => {
    setShowTag(true);
    removeEmailDomain(index);
  };
  return (
    <div>
      {item && (
        <div>
          {showTag && (
            <Tag
              testID="dismiss-button"
              disabled={disabled}
              accessibilityLabel={translate('view_code_snippet_close_button_lable')}
              onDismiss={removeItem}
              text={item}
            />
          )}
        </div>
      )}
    </div>
  );
}
export default AllowedEmailDomainList;
