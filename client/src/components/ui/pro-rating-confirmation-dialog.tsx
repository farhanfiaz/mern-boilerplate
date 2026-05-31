import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ProRatingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (applyProRating: boolean) => void;
  employeeData: {
    name: string;
    joinDate: string;
    department: string;
    fullAllocation: number;
    proRatedAllocation: number;
    leaveType: string;
  }[];
}

export function ProRatingConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  employeeData
}: ProRatingConfirmationDialogProps) {
  const totalEmployees = employeeData.length;
  const affectedEmployees = employeeData.filter(emp => emp.proRatedAllocation !== emp.fullAllocation);
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Pro-rating Confirmation Required</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 font-medium">
                Some employees joined after the year started and will receive pro-rated allocations.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Impact Summary:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Total Employees:</strong> {totalEmployees}</li>
                <li><strong>Employees with Pro-rated Allocation:</strong> {affectedEmployees.length}</li>
                <li><strong>Employees with Full Allocation:</strong> {totalEmployees - affectedEmployees.length}</li>
              </ul>
            </div>
            
            {affectedEmployees.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Pro-rated Allocations:</h4>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                  {affectedEmployees.map((emp, index) => (
                    <div key={index} className="text-sm py-1 flex justify-between">
                      <span>
                        {emp.name} ({emp.department}) - joined {emp.joinDate}
                      </span>
                      <span className="font-medium">
                        {emp.proRatedAllocation} days (instead of {emp.fullAllocation})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-amber-800 text-sm">
                <strong>Choose how to proceed:</strong>
              </p>
              <ul className="text-amber-700 text-sm mt-1 space-y-1">
                <li>• <strong>Apply Pro-rating:</strong> Use calculated pro-rated allocations based on join dates</li>
                <li>• <strong>Use Full Allocation:</strong> Give all employees the same full allocation regardless of join date</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onConfirm(false)}>
            Use Full Allocation
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Apply Pro-rating
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}