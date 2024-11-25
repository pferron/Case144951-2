import useLeavePrevention from '@hooks/useLeavePrevention';
import { useEffect } from 'react';

interface Props {
  isPageEdited: boolean;
  setIsPageEdited?: (isPageEdited: boolean) => void;
}
function LeavePageAlert({ isPageEdited, setIsPageEdited }: Props): JSX.Element {
  const { leavePage } = useLeavePrevention({
    preventLeave: isPageEdited,
    onPreventRouteChange: () => {
      setIsPageEdited(true);
    }
  });

  useEffect(() => {
    if (isPageEdited) {
      leavePage();
    }
  }, [isPageEdited, leavePage]);

  return null;
}
export default LeavePageAlert;
