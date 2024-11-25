import React, { useContext, Fragment } from 'react';
import { Row } from '@cvent/carina/components/Row';
import { ThemeContext } from '@cvent/carina/components/ThemeProvider/ThemeContext';
import { injectTestId } from '@cvent/nucleus-test-automation';
import { CSSObject } from '@emotion/react';

const useStyles = (): Record<string, CSSObject> => {
  const theme = useContext(ThemeContext);
  const boxSize = 32;

  return {
    itemList: {
      display: 'flex',
      flexWrap: 'wrap',
      listStyleType: 'none',
      margin: 0,
      padding: 0
    },
    radio: {
      opacity: 0,
      position: 'fixed',
      width: 0,
      '&:first-of-type + label': {
        marginLeft: 0
      },
      '&:checked + label': {
        backgroundColor: theme.backgroundColor.surface,
        border: `solid ${theme.borderColor.interactive.base}`,
        borderWidth: theme.size.border.base
      },
      '&:hover + label': {
        border: `solid ${theme.borderColor.interactive.hover}`,
        borderWidth: theme.size.border.base
      },
      '&:focus + label': {
        border: `solid ${theme.borderColor.interactive.active}`,
        borderWidth: theme.size.border.base
      }
    },
    itemContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: theme.backgroundColor.base,
      border: `solid ${theme.borderColor.interactive.disabled}`,
      borderWidth: theme.size.border.base,
      padding: '1.5rem 0 0.5rem',
      borderRadius: theme.size.border.radius.twoX,
      textAlign: 'center',
      outline: 'none',
      height: 90,
      width: 90,
      boxSizing: 'border-box',
      margin: '0.063rem 0.5rem 0.5rem 0rem',
      cursor: 'pointer',
      color: theme.font.color.soft
    },
    mainContent: {
      borderRadius: '0.25rem',
      display: 'block',
      cursor: 'pointer',
      flex: 'none',
      width: boxSize,
      height: boxSize,
      backgroundPosition: '0 center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain'
    },
    label: {
      ...theme.label,
      fontSize: theme.font.base.size.xxs,
      userSelect: 'none',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'clip',
      width: 82,
      margin: '0 0.25rem'
    }
  };
};

interface VisualSelectorRadioItem {
  styledContent?: CSSObject;
  label: string;
  value: string;
  key?: string;
  content?: JSX.Element | string;
}

interface VisualSelectorRadioProps {
  readOnly: boolean;
  itemContents: VisualSelectorRadioItem[];
  onUpdateSelection: (val: string) => void;
  currentSelectionValue?: string;
  testID?: string;
  name: string;
}

/**
 * @returns {*}
 * @constructor
 */
export function VisualSelectorRadio(props: VisualSelectorRadioProps): JSX.Element {
  const {
    itemContents,
    currentSelectionValue = '',
    onUpdateSelection,
    testID = 'visual-selector-radio',
    name,
    readOnly
  } = props;

  const { itemList, radio, itemContainer, mainContent, label } = useStyles();

  const selected =
    !currentSelectionValue && !itemContents.some(item => item.value === '')
      ? itemContents[0].value
      : currentSelectionValue;

  const isChecked = (value: string): boolean => selected === value;

  return (
    <Row>
      <span css={itemList} {...injectTestId(testID)}>
        {itemContents?.map(item => (
          <Fragment key={`${name}-${item.value}`}>
            <input
              type="radio"
              id={`${name}-${item.value}-selection`}
              onChange={evt => {
                onUpdateSelection(evt.target.value);
              }}
              css={radio}
              checked={isChecked(item.value)}
              value={item.value}
              name={name}
              disabled={readOnly}
            />
            <label css={itemContainer} htmlFor={`${name}-${item.value}-selection`}>
              <div css={[mainContent, item.styledContent]} {...injectTestId(`${name}-${item.label}-color-square`)}>
                {item.content}
              </div>
              {item.label && (
                <div css={label} {...injectTestId(`${name}-${item.label}-selection-label`)}>
                  {item.label}
                </div>
              )}
            </label>
          </Fragment>
        ))}
      </span>
    </Row>
  );
}
