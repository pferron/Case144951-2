import React from 'react';
import CardContainer from '@components/privacy/CardContainer';
import { useStyle } from '@hooks/useStyle';
import { MemberProfileFieldsStyle } from '@components/member-profile/style';
import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import { COLOR } from '@components/constants';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { FieldControlCard } from '@cvent/multi-dimensional-profile';
import TextContainer from '@components/privacy/TextContainer';
import { useTranslate } from 'nucleus-text';
import { ProfileCardContent } from '@components/member-profile/MemberProfileContainer';

function MemberProfileField({ onEdit, disabled, profileSettings, cardContent }: Props): JSX.Element {
  const style = useStyle(MemberProfileFieldsStyle);
  const { translate } = useTranslate();
  const cardSettings = profileSettings?.profileCard;
  const actions = (fieldName: string): JSX.Element => (
    <div css={style.sectionContainer}>
      <p>
        <TextContainer
          testID="memberProfileCard"
          question={translate('member_profile_allow_edit_section')}
          answer={
            cardSettings[fieldName]
              ? translate('member_profile_allow_option')
              : translate('member_profile_donot_allow_option')
          }
        />
      </p>
    </div>
  );
  return (
    <CardContainer backgroundColor={COLOR} testID="member-profile-fields" onEdit={onEdit} disabled={disabled}>
      <div css={style.title}>{translate('member_profile_fields_heading')}</div>
      <Row justifyContent="flex-start" margin={{ start: -42, end: -42 }}>
        {cardContent.map(field => (
          <Col key={field.title} padding={{ top: 24 }} l={{ width: 1 / 2 }}>
            <FieldControlCard
              title={field.title}
              body={field.body}
              hideSwitcher
              switchValue={cardSettings[field.switchValue]}
              actions={actions(field.allowCardValue)}
              required={field.required}
              requiredText={translate('member_profile_required_text')}
              testID={field.testID}
              message=""
            />
          </Col>
        ))}
      </Row>
    </CardContainer>
  );
}

interface Props {
  onEdit: (boolean) => void;
  disabled: boolean;
  cardContent: Array<ProfileCardContent>;
  profileSettings: ProfileSettings;
}

export default MemberProfileField;
