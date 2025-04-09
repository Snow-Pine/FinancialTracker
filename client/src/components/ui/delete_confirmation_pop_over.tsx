import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationPopoverProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationPopover: React.FC<DeleteConfirmationPopoverProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="popover-overlay">
      <div className="popover-content">
        <p>Are you sure you want to delete this transaction?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopover;