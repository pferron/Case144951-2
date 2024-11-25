import React from 'react';
import useCardStyles from '@cvent/blocks/hooks/useCardStyles';
import { usePreviewCarousleStyles } from './styles';

interface Props {
  imageSrc: string;
  useCardStyle?: boolean;
  title: string;
  subtitle?: string;
  alignItem?: string;
  borderBottom?: boolean;
}

function Item({
  imageSrc,
  useCardStyle = false,
  title,
  subtitle = null,
  alignItem = 'center',
  borderBottom = true
}: Props): JSX.Element {
  const cardStyles = useCardStyles();
  const { itemImage, item, titleStyle, itemImageBottomBorder } = usePreviewCarousleStyles(alignItem);
  const itemStyle = useCardStyle ? [item, cardStyles] : item;
  return (
    <div css={itemStyle}>
      <img css={[itemImage, borderBottom ? itemImageBottomBorder : null]} src={imageSrc} alt="" />
      <div css={titleStyle}>{title}</div>
      {subtitle && <div>{subtitle}</div>}
    </div>
  );
}

export default Item;
