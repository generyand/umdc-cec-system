import { UserPosition } from "@prisma/client";

// Get the next step in the approval flow
export const getNextApprovalStep = (
  currentStep: UserPosition
): UserPosition | null => {
  const approvalFlow: Record<UserPosition, UserPosition | null> = {
    CEC_HEAD: "VP_DIRECTOR",
    CEC_OFFICE_ASSISTANT: null,
    CEC_COORDINATOR: null,
    VP_DIRECTOR: "CHIEF_OPERATION_OFFICER",
    DEAN: null,
    PROGRAM_HEAD: null,
    FOCAL_PERSON: null,
    CHIEF_OPERATION_OFFICER: null,
  };

  return approvalFlow[currentStep];
};

// Check if all previous steps are approved
export const isPreviousStepsApproved = (
  approvals: any[],
  currentRole: UserPosition
): boolean => {
  const approvalOrder: UserPosition[] = [
    "CEC_HEAD",
    "VP_DIRECTOR",
    "CHIEF_OPERATION_OFFICER",
  ];

  const currentStepIndex = approvalOrder.indexOf(currentRole);

  if (currentStepIndex === 0) return true;

  for (let i = 0; i < currentStepIndex; i++) {
    const previousApproval = approvals.find(
      (a) => a.approverRole === approvalOrder[i]
    );
    if (previousApproval?.status !== "APPROVED") {
      return false;
    }
  }

  return true;
};
