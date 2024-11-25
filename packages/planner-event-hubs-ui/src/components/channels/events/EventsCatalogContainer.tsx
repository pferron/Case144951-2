import React, { useCallback, useState } from 'react';
import Events from '@components/channels/events/Events';

function EventsCatalogContainer(): JSX.Element {
  const [editMode, setEditMode] = useState<boolean>(false);

  const onSave = useCallback((): void => {
    setEditMode(false);
  }, []);

  const onCancel = useCallback((): void => {
    setEditMode(false);
  }, []);

  return (
    <Events
      eventCatalog={[]}
      editMode={editMode}
      onEdit={() => setEditMode(true)}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}

export default EventsCatalogContainer;
