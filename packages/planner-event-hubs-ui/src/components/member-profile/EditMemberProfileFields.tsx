import React, { Dispatch, SetStateAction } from 'react';
import CardContainer from '@components/privacy/CardContainer';
import { Col } from '@cvent/carina/components/Col';
import { Row } from '@cvent/carina/components/Row';
import { FieldControlCard } from '@cvent/multi-dimensional-profile';
import { RadioGroup } from '@cvent/carina/components/RadioGroup';
import { EditMemberProfileFieldsStyle } from '@components/member-profile/style';
import { useStyle } from '@hooks/useStyle';
import { useTheme } from '@cvent/carina/components/ThemeProvider/useTheme';
import { ProfileSettings } from '@components/privacy/type/PrivacySettings';
import { COLOR } from '@components/constants';
import { useTranslate } from 'nucleus-text';
import { ProfileCardContent } from '@components/member-profile/MemberProfileContainer';

function EditMemberProfileFields({
  onSave: originalOnSave,
  onCancel,
  cardContent,
  profileSettings,
  setProfileSettings
}: Props): JSX.Element {
  const fieldStyle = useStyle(EditMemberProfileFieldsStyle);
  const onSave = () => {
    originalOnSave(profileSettings);
  };
  const theme = useTheme();
  const { translate } = useTranslate();
  const actions = (fieldName: string): JSX.Element => (
    <>
      <p style={{ marginTop: 8, marginBottom: 0, color: theme.font.color.soft }}>
        {translate('member_profile_allow_edit_section')}
      </p>
      <RadioGroup
        options={[
          {
            label: translate('member_profile_allow_option'),
            value: 1
          },
          {
            label: translate('member_profile_donot_allow_option'),
            value: 0
          }
        ]}
        name={`profile-card-radio-${fieldName}`}
        selected={profileSettings.profileCard[fieldName] ? 1 : 0}
        onUpdate={selectedOption => {
          setProfileSettings(prev => ({
            ...prev,
            profileCard: { ...prev.profileCard, [fieldName]: Boolean(selectedOption) }
          }));
        }}
        inline
      />
    </>
  );

  return (
    <CardContainer backgroundColor={COLOR} testID="edit-member-profile-fields" onSave={onSave} onCancel={onCancel}>
      <div css={fieldStyle.title}>{translate('member_profile_fields_heading')}</div>
      <Row justifyContent="flex-start" margin={{ start: -42, end: -42 }}>
        {cardContent.map(field => (
          <Col key={field.title} padding={{ top: 24 }} l={{ width: 1 / 2 }}>
            <FieldControlCard
              title={field.title}
              body={field.body}
              switchValue={profileSettings.profileCard[field.switchValue]}
              onSwitchUpdate={updatedValue => {
                setProfileSettings(prev => ({
                  ...prev,
                  profileCard: { ...prev.profileCard, [field.switchValue]: Boolean(updatedValue) }
                }));
              }}
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
  onSave: (boolean) => void;
  onCancel: (boolean) => void;
  cardContent: Array<ProfileCardContent>;
  profileSettings: ProfileSettings;
  setProfileSettings: Dispatch<SetStateAction<ProfileSettings>>;
}

export default EditMemberProfileFields;
