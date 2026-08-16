import React from "react";

import ServiceRequestsPage from "./ServiceRequestsPage";

import {
  getEngineeringRequests,
  getEngineeringRequestById,
  forwardEngineeringRequestToMayor,
  rejectEngineeringRequest,
  getEngineeringAttachment,
} from "../services/serviceRequestsApi";

function EngineeringOfficeRequestsPage() {
  return (
    <ServiceRequestsPage
      title="طلبات الخدمات - المكتب الهندسي"
      description="مراجعة الطلبات المحالة من المكتب الفني واعتمادها"
      role="engineering"
      listRequests={getEngineeringRequests}
      getRequestById={getEngineeringRequestById}
      openAttachment={getEngineeringAttachment}
      forwardRequest={
        forwardEngineeringRequestToMayor
      }
      rejectRequest={rejectEngineeringRequest}
    />
  );
}

export default EngineeringOfficeRequestsPage;