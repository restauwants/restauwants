import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  cancelVerb: string;
  actionVerb: string;
  onAction: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmationDialog = ({
  title,
  description,
  cancelVerb,
  actionVerb,
  onAction,
  open,
  onOpenChange,
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelVerb}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>{actionVerb}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
