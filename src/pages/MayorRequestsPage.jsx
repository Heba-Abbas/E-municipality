import React from "react";

import ServiceRequestsPage from "./ServiceRequestsPage";

import {
  getMayorRequests,
  getMayorRequestById,
  approveAndIssueMayorRequest,
  rejectMayorRequest,
  getMayorAttachment,
} from "../services/serviceRequestsApi";

function MayorRequestsPage() {
  return (
    <ServiceRequestsPage
      title="طلبات الخدمات - رئيس البلدية"
      description="مراجعة الطلبات واعتمادها وإصدار وثائق الخدمة"
      role="mayor"
      listRequests={getMayorRequests}
      getRequestById={getMayorRequestById}
      openAttachment={getMayorAttachment}
      approveAndIssue={approveAndIssueMayorRequest}
      rejectRequest={rejectMayorRequest}
    />
  );
}

export default MayorRequestsPage;