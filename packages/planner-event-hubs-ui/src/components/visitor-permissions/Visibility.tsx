import { GuestVisibility } from '@cvent/planner-event-hubs-model/types';
import CardContainer from '@components/visitor-permissions/CardContainer';
import React from 'react';
import { useTranslate } from 'nucleus-text';
import { VisitorPermissionsFieldStyles } from '@components/visitor-permissions/style';
import { useStyle } from '@hooks/useStyle';
import { VisitorPermissionsProps } from '@components/visitor-permissions/type/VisitorPermissionsProps';
import { getGuestVisibilityOptions } from '@components/visitor-permissions/VisibilityOptions';

function Visibility({ visibility, onEdit, disabled }: Props) {
  const styles = useStyle(VisitorPermissionsFieldStyles);
  const { translate } = useTranslate();
  const visibilityOptionSelected = getGuestVisibilityOptions(translate).find(iterator => iterator.value === visibility);

  return (
    <CardContainer testID="guest-visibility-field" onEdit={onEdit} disabled={disabled}>
      <div>
        <h2 css={styles.title}>{translate('visitor_permissions_visibility_header')}</h2>
        <p css={styles.description}>{translate('visitor_permissions_visibility_sub_header')}</p>
        <p>{visibilityOptionSelected.label}</p>
      </div>
    </CardContainer>
  );
}

interface Props {
  visibility: GuestVisibility;
  onEdit?: (settings: VisitorPermissionsProps) => void;
  disabled: boolean;
}
export default Visibility;
